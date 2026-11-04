import { describe, it } from "node:test";
import assert from "node:assert/strict";

const {
  getItemStats,
  getProgress,
  markFlashcard,
  recordAnswer,
  resetProgress,
  setDifficult,
  setSaved,
} = await import("../../assets/js/progress.js");

const EMPTY_STATS = {
  seen: 0,
  correctCount: 0,
  incorrectCount: 0,
  consecutiveCorrect: 0,
  lastResult: null,
  lastReviewedAt: null,
  nextReviewAt: null,
  reviewStage: 0,
  bucket: null,
  saved: false,
  difficult: false,
};

describe("progress item ID boundary", () => {
  it("ignores malformed and prototype-named IDs at read and write boundaries", () => {
    resetProgress();

    recordAnswer(true, "meaning", "__proto__");
    setSaved("constructor");
    setDifficult("toString");
    markFlashcard("prototype", "known");
    markFlashcard("bad/id", "review");

    assert.equal(getProgress().answered, 1);
    assert.equal(getProgress().correct, 1);
    assert.deepEqual(Object.keys(getProgress().items), []);
    assert.equal(Object.getPrototypeOf(getProgress().items), Object.prototype);

    for (const id of ["__proto__", "constructor", "toString", "prototype", "bad/id"]) {
      assert.deepEqual(getItemStats(id), EMPTY_STATS);
    }
  });

  it("keeps tracking valid stable IDs", () => {
    resetProgress();
    const itemId = "word-0123456789";

    recordAnswer(true, "meaning", itemId);
    setSaved(itemId, true);

    assert.equal(getItemStats(itemId).seen, 1);
    assert.equal(getItemStats(itemId).correctCount, 1);
    assert.equal(getItemStats(itemId).saved, true);
  });
});
