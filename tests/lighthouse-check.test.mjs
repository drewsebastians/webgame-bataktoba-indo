import assert from "node:assert/strict";
import test from "node:test";
import {
  LIGHTHOUSE_ROUTES,
  SCORE_FLOORS,
  assertLighthouseScoreFloors,
  readLighthouseScores,
  summarizePerformanceDiagnostics,
  shouldReportPerformanceDiagnostics,
  DIAGNOSTICS_PERFORMANCE_THRESHOLD,
  resolveNpxInvocation,
} from "../tools/lighthouse-check.mjs";

const report = (performance, accessibility) => ({
  categories: {
    performance: { score: performance },
    accessibility: { score: accessibility },
  },
});

test("reads real Lighthouse category scores", () => {
  assert.deepEqual(readLighthouseScores(report(0.82, 0.96)), {
    performance: 0.82,
    accessibility: 0.96,
  });
});

test("audits only the fixed local learner-facing route set", () => {
  assert.deepEqual(
    LIGHTHOUSE_ROUTES.map(({ id, path }) => [id, path]),
    [
      ["home", "/"],
      ["learn-angka", "/learn/angka/"],
      ["games", "/games/"],
      ["flashcards", "/flashcards/"],
      ["dictionary", "/dictionary/"],
      ["progress", "/progres/"],
    ],
  );
  assert.ok(LIGHTHOUSE_ROUTES.every(({ id, path }) =>
    /^[a-z0-9-]+$/.test(id) && path.startsWith("/") && !path.startsWith("//"),
  ));
});

test("runs the Windows Lighthouse CLI through Node without a shell", () => {
  const npmExecPath = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
  const npxCli = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npx-cli.js";
  assert.deepEqual(
    resolveNpxInvocation({
      platform: "win32",
      npmExecPath,
      nodeExecutable: "C:\\Program Files\\nodejs\\node.exe",
      pathExists: (path) => path === npxCli,
    }),
    { command: "C:\\Program Files\\nodejs\\node.exe", argsPrefix: [npxCli] },
  );
});

test("uses npx directly without enabling a command shell on POSIX", () => {
  assert.deepEqual(
    resolveNpxInvocation({ platform: "linux" }),
    { command: "npx", argsPrefix: [] },
  );
});

test("accepts scores at the documented mobile and desktop floors", () => {
  assert.equal(assertLighthouseScoreFloors({
    performance: SCORE_FLOORS.performance,
    accessibility: SCORE_FLOORS.accessibility,
  }), true);
});

test("fails when either category falls below its floor", () => {
  assert.throws(
    () => assertLighthouseScoreFloors({ performance: 0.69, accessibility: 0.89 }),
    /performance 69 < 70, accessibility 89 < 90/,
  );
});

test("fails closed when Lighthouse omits a required score", () => {
  assert.throws(() => readLighthouseScores({ categories: {} }), /performance category score/);
});

test("summarizes performance metrics and ranks measured opportunities", () => {
  const summary = summarizePerformanceDiagnostics({
    audits: {
      "first-contentful-paint": { displayValue: "1.2 s", numericValue: 1200 },
      "largest-contentful-paint": { displayValue: "1.8 s", numericValue: 1800 },
      "speed-index": { displayValue: "1.4 s", numericValue: 1400 },
      "total-blocking-time": { displayValue: "120 ms", numericValue: 120 },
      "cumulative-layout-shift": { displayValue: "0.02", numericValue: 0.02 },
      "layout-shifts": {
        details: {
          type: "table",
          items: [
            { score: 0.12, node: { selector: "main > .lesson-card" } },
            { score: 0.04, node: { selector: ".site-footer" } },
            { score: 0, node: { selector: ".stable" } },
          ],
        },
      },
      "render-blocking-resources": {
        details: { type: "opportunity", overallSavingsMs: 120, overallSavingsBytes: 4500 },
      },
      "unused-javascript": {
        details: { type: "opportunity", overallSavingsMs: 80, overallSavingsBytes: 9000 },
      },
      "modern-image-formats": {
        details: { type: "opportunity", overallSavingsBytes: 12000 },
      },
      diagnostic: { details: { type: "table", overallSavingsMs: 9999 } },
    },
  });

  assert.equal(summary.metrics.FCP.displayValue, "1.2 s");
  assert.equal(summary.metrics.LCP.numericValue, 1800);
  assert.deepEqual(summary.opportunities, [
    { id: "render-blocking-resources", savingsMs: 120, savingsBytes: 4500 },
    { id: "unused-javascript", savingsMs: 80, savingsBytes: 9000 },
    { id: "modern-image-formats", savingsMs: 0, savingsBytes: 12000 },
  ]);
  assert.deepEqual(summary.layoutShifts, [
    { selector: "main > .lesson-card", score: 0.12 },
    { selector: ".site-footer", score: 0.04 },
  ]);
});

test("reports actionable diagnostics for all routes below the 95-point target", () => {
  assert.equal(shouldReportPerformanceDiagnostics(0.90), true);
  assert.equal(shouldReportPerformanceDiagnostics(0.93), true);
  assert.equal(shouldReportPerformanceDiagnostics(0.949), true);
  assert.equal(shouldReportPerformanceDiagnostics(DIAGNOSTICS_PERFORMANCE_THRESHOLD), false);
  assert.equal(shouldReportPerformanceDiagnostics(1), false);
  assert.equal(shouldReportPerformanceDiagnostics(Number.NaN), false);
});

test("diagnostic summary tolerates a missing audit payload", () => {
  const summary = summarizePerformanceDiagnostics(null);
  assert.ok(Object.values(summary.metrics).every((metric) =>
    metric.displayValue === null && metric.numericValue === null,
  ));
  assert.deepEqual(summary.opportunities, []);
  assert.deepEqual(summary.layoutShifts, []);
});
