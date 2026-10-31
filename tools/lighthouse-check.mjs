#!/usr/bin/env node
/**
 * Run pinned Lighthouse performance and accessibility audits against the built
 * local site in mobile and desktop profiles. Reports are written under artifacts/.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PREVIEW_URL = "http://127.0.0.1:4178/";
const LIGHTHOUSE_VERSION = "13.4.1";
export const SCORE_FLOORS = Object.freeze({ performance: 0.7, accessibility: 0.9 });

export function readLighthouseScores(report) {
  const scores = {
    performance: report?.categories?.performance?.score,
    accessibility: report?.categories?.accessibility?.score,
  };
  for (const [category, score] of Object.entries(scores)) {
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1) {
      throw new Error(`Lighthouse report is missing a valid ${category} category score`);
    }
  }
  return scores;
}

export function assertLighthouseScoreFloors(scores, floors = SCORE_FLOORS) {
  const failures = Object.entries(floors)
    .filter(([category, minimum]) => scores[category] < minimum)
    .map(([category, minimum]) => `${category} ${Math.round(scores[category] * 100)} < ${Math.round(minimum * 100)}`);
  if (failures.length) {
    throw new Error(`Lighthouse score floor failed: ${failures.join(", ")}`);
  }
  return true;
}

async function waitForPreview(server) {
  let spawnError;
  server.once("error", (error) => { spawnError = error; });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (spawnError) throw spawnError;
    if (server.exitCode !== null) {
      throw new Error(`Preview server exited before becoming ready (code ${server.exitCode})`);
    }
    try {
      const response = await fetch(PREVIEW_URL);
      if (response.ok) {
        await response.body?.cancel();
        return;
      }
    } catch {
      // The static preview can take a moment to bind its local port.
    }
    await delay(250);
  }
  throw new Error("Preview server did not become ready within 20 seconds");
}

function runLighthouse(profile, outputPath, chromePath) {
  const args = [
    "--yes",
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    PREVIEW_URL,
    "--only-categories=performance,accessibility",
    "--output=json",
    `--output-path=${outputPath}`,
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--quiet",
  ];
  if (profile === "desktop") args.push("--preset=desktop");

  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, CHROME_PATH: chromePath },
    stdio: "inherit",
    shell: process.platform === "win32",
    timeout: 180_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Lighthouse ${profile} audit exited with status ${result.status}`);
  }
}

async function runAudits() {
  const checklist = join(ROOT, "docs", "RELEASE_CHECKLIST.md");
  const distIndex = join(ROOT, "dist", "index.html");
  const distHeaders = join(ROOT, "dist", "_headers");
  if (!existsSync(checklist)) throw new Error("Missing docs/RELEASE_CHECKLIST.md");
  if (!existsSync(distIndex)) throw new Error("dist/index.html missing — run npm run build first");
  if (!existsSync(distHeaders)) throw new Error("dist/_headers missing — run npm run build first");
  if (!readFileSync(distHeaders, "utf8").includes("Content-Security-Policy")) {
    throw new Error("dist/_headers is missing Content-Security-Policy");
  }

  const chromePath = process.env.CHROME_PATH || chromium.executablePath();
  if (!existsSync(chromePath)) {
    throw new Error("Chromium executable missing; run npx playwright install chromium first");
  }

  const outputDirectory = join(ROOT, "artifacts", "lighthouse");
  mkdirSync(outputDirectory, { recursive: true });
  const server = spawn(process.execPath, [join(ROOT, "tools", "e2e-server.mjs"), "4178"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  try {
    await waitForPreview(server);
    for (const profile of ["mobile", "desktop"]) {
      const outputPath = join(outputDirectory, `lighthouse-${profile}.json`);
      runLighthouse(profile, outputPath, chromePath);
      const report = JSON.parse(readFileSync(outputPath, "utf8"));
      const scores = readLighthouseScores(report);
      assertLighthouseScoreFloors(scores);
      console.log(
        `Lighthouse ${profile}: performance ${Math.round(scores.performance * 100)}/100; ` +
        `accessibility ${Math.round(scores.accessibility * 100)}/100 — PASS`,
      );
    }
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await Promise.race([new Promise((done) => server.once("exit", done)), delay(2_000)]);
      if (server.exitCode === null) server.kill("SIGKILL");
    }
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  runAudits().catch((error) => {
    console.error(`lighthouse-check: FAIL — ${error.message}`);
    process.exitCode = 1;
  });
}
