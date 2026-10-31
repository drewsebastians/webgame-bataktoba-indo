import assert from "node:assert/strict";
import test from "node:test";
import {
  LIGHTHOUSE_ROUTES,
  SCORE_FLOORS,
  assertLighthouseScoreFloors,
  readLighthouseScores,
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
