import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePerformanceBudget, PERFORMANCE_BUDGET } from "../../tools/check-performance-budget.mjs";

test("measured production bundle fits the initial budgets", () => {
  const report = evaluatePerformanceBudget([
    { path: "dist/assets/js/ads.523484b2.js", size: 3_222 },
    { path: "dist/assets/js/analytics.ab842beb.js", size: 4_099 },
    { path: "dist/assets/js/app.649678b6.js", size: 77_391 },
    { path: "dist/assets/js/config.6316db9b.js", size: 884 },
    { path: "dist/assets/js/data.cfd4b3c2.js", size: 1_060 },
    { path: "dist/assets/js/game/lesson-engine.f650cc27.js", size: 1_951 },
    { path: "dist/assets/js/game/modes.94847ebc.js", size: 5_979 },
    { path: "dist/assets/js/game/question-engine.5494a83a.js", size: 6_555 },
    { path: "dist/assets/js/game/session.30f0491c.js", size: 4_636 },
    { path: "dist/assets/js/onboarding.b17e4b59.js", size: 2_225 },
    { path: "dist/assets/js/progress.fa26cbf8.js", size: 18_370 },
    { path: "dist/assets/js/utils/corrections.2eedd2fd.js", size: 923 },
    { path: "dist/assets/js/utils/dom.742eac8c.js", size: 1_512 },
    { path: "dist/assets/js/utils/normalize.9471d62c.js", size: 1_038 },
    { path: "dist/assets/css/styles.940b46b4.css", size: 15_217 },
    { path: "dist/assets/fonts/learning.woff2", size: 500_000 },
  ]);

  assert.equal(report.javascript.count, 14);
  assert.equal(report.javascript.totalBytes, 129_845);
  assert.equal(report.css.count, 1);
  assert.equal(report.css.totalBytes, 15_217);
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
