#!/usr/bin/env node
/**
 * Deterministic size guard for minified production JavaScript and CSS artifacts.
 * The values are uncompressed file sizes in dist/assets; they do not estimate transfer size.
 */
import { readdir, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PERFORMANCE_BUDGET = Object.freeze({
  javascript: Object.freeze({ totalBytes: 196_608, fileBytes: 98_304 }),
  css: Object.freeze({ totalBytes: 49_152, fileBytes: 49_152 }),
});

const javascriptExtensions = new Set([".js", ".mjs"]);

export function evaluatePerformanceBudget(assets, budget = PERFORMANCE_BUDGET) {
  const javascript = assets.filter(({ path }) => javascriptExtensions.has(extname(path).toLowerCase()));
  const css = assets.filter(({ path }) => extname(path).toLowerCase() === ".css");
  const violations = [];

  function summarize(files, label, limits) {
    if (files.length === 0) {
      violations.push(`No production ${label} assets found under dist/assets`);
    }
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    const largestFile = files.reduce((largest, file) => !largest || file.size > largest.size ? file : largest, null);
    if (totalBytes > limits.totalBytes) {
      violations.push(`${label} total is ${totalBytes} bytes; budget is ${limits.totalBytes} bytes`);
    }
    for (const file of files) {
      if (file.size > limits.fileBytes) {
        violations.push(`${file.path} is ${file.size} bytes; per-file budget is ${limits.fileBytes} bytes`);
      }
    }
    return { count: files.length, totalBytes, largestFile };
  }

  return {
    javascript: summarize(javascript, "JavaScript", budget.javascript),
    css: summarize(css, "CSS", budget.css),
    violations,
  };
}

async function collectAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      assets.push(...await collectAssets(path));
    } else if ([".js", ".mjs", ".css"].includes(extname(entry.name).toLowerCase())) {
      assets.push({ path: relative(process.cwd(), path), size: (await stat(path)).size });
    }
  }
  return assets;
}

async function main() {
  const repoRoot = fileURLToPath(new URL("..", import.meta.url));
  const assetRoot = resolve(repoRoot, "dist", "assets");
  const report = evaluatePerformanceBudget(await collectAssets(assetRoot));
  const format = (label, result, limit) => {
    const largest = result.largestFile ? `${result.largestFile.path} (${result.largestFile.size} bytes)` : "none";
    return `${label}: ${result.totalBytes}/${limit.totalBytes} bytes across ${result.count} files; largest ${largest} (file budget ${limit.fileBytes})`;
  };
  console.log(format("JavaScript", report.javascript, PERFORMANCE_BUDGET.javascript));
  console.log(format("CSS", report.css, PERFORMANCE_BUDGET.css));
  if (report.violations.length) {
    for (const violation of report.violations) console.error(`performance:budget: FAIL — ${violation}`);
    process.exitCode = 1;
    return;
  }
  console.log("performance:budget: PASS");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
