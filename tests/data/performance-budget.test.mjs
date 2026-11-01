import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePerformanceBudget, PERFORMANCE_BUDGET } from "../../tools/check-performance-budget.mjs";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function collectProductionAssets(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) return collectProductionAssets(fullPath);
    if (![".js", ".mjs", ".css"].includes(entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase())) {
      return [];
    }
    return [{
      path: relative(process.cwd(), fullPath).replaceAll("\\", "/"),
      size: statSync(fullPath).size,
    }];
  });
}

test("measured production bundle fits the budgets, including focused page entrypoints", () => {
  const assets = collectProductionAssets(join(process.cwd(), "dist", "assets"));
  const report = evaluatePerformanceBudget(assets);

  assert.ok(assets.some(({ path }) => /dist\/assets\/js\/dictionary-page\.[\da-f]{8}\.js$/.test(path)));
  assert.ok(assets.some(({ path }) => /dist\/assets\/js\/flashcards-page\.[\da-f]{8}\.js$/.test(path)));
  assert.ok(assets.some(({ path }) => /dist\/assets\/js\/progress-page\.[\da-f]{8}\.js$/.test(path)));
  assert.ok(report.javascript.count >= 17);
  assert.ok(report.javascript.totalBytes <= PERFORMANCE_BUDGET.javascript.totalBytes);
  assert.ok(report.css.count >= 1);
  assert.ok(report.css.totalBytes <= PERFORMANCE_BUDGET.css.totalBytes);
  assert.deepEqual(report.violations, []);
});

test("rejects JavaScript and CSS files over their individual budgets", () => {
  const report = evaluatePerformanceBudget([
    { path: "dist/assets/js/app.js", size: PERFORMANCE_BUDGET.javascript.fileBytes + 1 },
    { path: "dist/assets/css/styles.css", size: PERFORMANCE_BUDGET.css.fileBytes + 1 },
  ]);

  assert.ok(report.violations.some((message) => message.includes("app.js") && message.includes("per-file budget")));
  assert.ok(report.violations.some((message) => message.includes("styles.css") && message.includes("per-file budget")));
});

test("rejects aggregate growth even when each asset fits its per-file budget", () => {
  const report = evaluatePerformanceBudget([
    { path: "dist/assets/js/one.js", size: 50_000 },
    { path: "dist/assets/js/two.js", size: 50_000 },
    { path: "dist/assets/js/three.js", size: 50_000 },
    { path: "dist/assets/js/four.js", size: 50_000 },
    { path: "dist/assets/css/one.css", size: 25_000 },
    { path: "dist/assets/css/two.css", size: 25_000 },
  ]);

  assert.ok(report.violations.some((message) => message.startsWith("JavaScript total")));
  assert.ok(report.violations.some((message) => message.startsWith("CSS total")));
});
