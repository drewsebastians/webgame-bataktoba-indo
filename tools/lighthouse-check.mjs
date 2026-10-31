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
const PREVIEW_ORIGIN = "http://127.0.0.1:4178";
const PREVIEW_URL = `${PREVIEW_ORIGIN}/`;
const LIGHTHOUSE_VERSION = "13.4.1";
export const SCORE_FLOORS = Object.freeze({ performance: 0.7, accessibility: 0.9 });
export const LIGHTHOUSE_ROUTES = Object.freeze([
  Object.freeze({ id: "home", path: "/" }),
  Object.freeze({ id: "learn-angka", path: "/learn/angka/" }),
  Object.freeze({ id: "games", path: "/games/" }),
  Object.freeze({ id: "flashcards", path: "/flashcards/" }),
  Object.freeze({ id: "dictionary", path: "/dictionary/" }),
  Object.freeze({ id: "progress", path: "/progres/" }),
]);

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

const PERFORMANCE_METRICS = Object.freeze([
  Object.freeze({ id: "first-contentful-paint", label: "FCP" }),
  Object.freeze({ id: "largest-contentful-paint", label: "LCP" }),
  Object.freeze({ id: "speed-index", label: "Speed Index" }),
  Object.freeze({ id: "total-blocking-time", label: "TBT" }),
  Object.freeze({ id: "cumulative-layout-shift", label: "CLS" }),
]);

export function summarizePerformanceDiagnostics(report) {
  const audits = report?.audits && typeof report.audits === "object" ? report.audits : {};
  const metrics = Object.fromEntries(PERFORMANCE_METRICS.map(({ id, label }) => {
    const audit = audits[id] ?? {};
    return [label, {
      displayValue: typeof audit.displayValue === "string" ? audit.displayValue : null,
      numericValue: Number.isFinite(audit.numericValue) ? audit.numericValue : null,
    }];
  }));

  const opportunities = Object.entries(audits)
    .filter(([, audit]) => audit?.details?.type === "opportunity")
    .map(([id, audit]) => {
      const details = audit.details;
      return {
        id,
        savingsMs: Number.isFinite(details.overallSavingsMs) && details.overallSavingsMs > 0
          ? details.overallSavingsMs : 0,
        savingsBytes: Number.isFinite(details.overallSavingsBytes) && details.overallSavingsBytes > 0
          ? details.overallSavingsBytes : 0,
      };
    })
    .filter(({ savingsMs, savingsBytes }) => savingsMs > 0 || savingsBytes > 0)
    .sort((a, b) => b.savingsMs - a.savingsMs || b.savingsBytes - a.savingsBytes || a.id.localeCompare(b.id))
    .slice(0, 3);

  return { metrics, opportunities };
}

function formatPerformanceDiagnostics(summary) {
  const metrics = Object.entries(summary.metrics)
    .map(([label, metric]) => `${label} ${metric.displayValue ?? metric.numericValue ?? "n/a"}`)
    .join("; ");
  const opportunities = summary.opportunities.length
    ? summary.opportunities.map(({ id, savingsMs, savingsBytes }) => {
      const savings = [];
      if (savingsMs) savings.push(`${savingsMs} ms`);
      if (savingsBytes) savings.push(`${savingsBytes} bytes`);
      return `${id} (${savings.join(", ")})`;
    }).join("; ")
    : "none reported";
  return `metrics: ${metrics}; top opportunities: ${opportunities}`;
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

function runLighthouse(profile, url, outputPath, chromePath) {
  const args = [
    "--yes",
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    url,
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
    throw new Error(`Lighthouse ${profile} audit for ${url} exited with status ${result.status}`);
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

  for (const route of LIGHTHOUSE_ROUTES) {
    const relativePage = route.path === "/" ? "index.html" : join(route.path.slice(1), "index.html");
    if (!existsSync(join(ROOT, "dist", relativePage))) {
      throw new Error(`dist route page missing for ${route.path} — run npm run build first`);
    }
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
    for (const route of LIGHTHOUSE_ROUTES) {
      const url = new URL(route.path, PREVIEW_ORIGIN).toString();
      for (const profile of ["mobile", "desktop"]) {
        const outputPath = join(outputDirectory, `lighthouse-${route.id}-${profile}.json`);
        runLighthouse(profile, url, outputPath, chromePath);
        const report = JSON.parse(readFileSync(outputPath, "utf8"));
        const scores = readLighthouseScores(report);
        assertLighthouseScoreFloors(scores);
        console.log(
          `Lighthouse ${route.id} ${profile}: performance ${Math.round(scores.performance * 100)}/100; ` +
          `accessibility ${Math.round(scores.accessibility * 100)}/100 — PASS`,
        );
        if (scores.performance < 0.9) {
          console.log(
            `Lighthouse ${route.id} ${profile} diagnostics: ` +
            formatPerformanceDiagnostics(summarizePerformanceDiagnostics(report)),
          );
        }
      }
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
