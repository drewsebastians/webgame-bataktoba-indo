import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { buildDailyQueue, summarizeSession, computeStreak, masteryLabel, SESSION_SIZES } = await import(
  "../../assets/js/game/session.js"
);

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pool(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `word-${String(i).padStart(10, "0")}`,
    batak: `b${i}`,
    indonesia: `i${i}`,
  }));
}

const NOW = 1_800_000_000_000;

describe("buildDailyQueue", () => {
  it("prioritizes due items first, then often-wrong, then recently-wrong, then new", () => {
    const items = pool(8);
    const stats = {
      [items[0].id]: { seen: 2, nextReviewAt: NOW - 1000 }, // due
      [items[1].id]: { seen: 5, incorrectCount: 4 }, // often wrong
      [items[2].id]: { seen: 3, lastResult: "incorrect" }, // recently wrong
      [items[3].id]: { seen: 1, nextReviewAt: NOW + 864e5 }, // known, not due
    };
    const queue = buildDailyQueue(items, stats, { size: 10, now: NOW, random: rng(1) });
    const ids = queue.map((item) => item.id);
    assert.equal(ids.indexOf(items[0].id), 0);
    assert.equal(ids.indexOf(items[1].id), 1);
    assert.equal(ids.indexOf(items[2].id), 2);
    // new items come before the not-due known item
    assert.ok(
      Math.max(ids.indexOf(items[4].id), ids.indexOf(items[5].id)) < ids.indexOf(items[3].id),
    );
  });

  it("respects the requested session size", () => {
    const queue = buildDailyQueue(pool(30), {}, { size: 5, random: rng(2) });
    assert.equal(queue.length, 5);
  });

  it("caps size to available pool", () => {
    const queue = buildDailyQueue(pool(3), {}, { size: 20, random: rng(3) });
    assert.equal(queue.length, 3);
  });

  it("excludes duplicate prompts from one session", () => {
    const items = [...pool(5), ...pool(5).map((item) => ({ ...item, id: `${item.id}-dup` }))];
    const queue = buildDailyQueue(items, {}, { size: 20, random: rng(4) });
    const keys = queue.map((item) => `${item.batak}|${item.indonesia}`);
    assert.equal(new Set(keys).size, keys.length);
  });
});

describe("summarizeSession", () => {
  it("computes counts, accuracy, and unique mistake ids", () => {
    const summary = summarizeSession([
      { itemId: "a", isCorrect: true },
      { itemId: "b", isCorrect: false },
      { itemId: "b", isCorrect: false },
      { itemId: "c", isCorrect: true },
      { itemId: "d", isCorrect: false },
    ]);
    assert.equal(summary.answered, 5);
    assert.equal(summary.correct, 2);
    assert.equal(summary.incorrect, 3);
    assert.equal(summary.accuracy, 40);
    assert.deepEqual(summary.mistakeIds, ["b", "d"]);
    assert.equal(summary.isMeaningful, true);
  });

  it("short sessions are not meaningful", () => {
    const summary = summarizeSession([{ itemId: "a", isCorrect: true }]);
    assert.equal(summary.isMeaningful, false);
  });

  it("handles empty sessions safely", () => {
    const summary = summarizeSession([]);
    assert.equal(summary.answered, 0);
    assert.equal(summary.accuracy, null);
  });
});

describe("computeStreak", () => {
  const today = new Date("2026-08-24T12:00:00");
  const dayMs = 864e5;

  function dateKeyAt(offsetDays) {
    const d = new Date(today.getTime() - offsetDays * dayMs);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  it("counts consecutive days including today", () => {
    const dates = [dateKeyAt(0), dateKeyAt(1), dateKeyAt(2)];
    assert.equal(computeStreak(dates, today.getTime()), 3);
  });

  it("survives a single missed day (non-punishing)", () => {
    const dates = [dateKeyAt(0), dateKeyAt(2), dateKeyAt(3)];
    assert.equal(computeStreak(dates, today.getTime()), 3);
  });

  it("breaks after two consecutive missed days", () => {
    const dates = [dateKeyAt(0), dateKeyAt(3), dateKeyAt(4)];
    assert.equal(computeStreak(dates, today.getTime()), 1);
  });

  it("returns zero with no history", () => {
    assert.equal(computeStreak([], today.getTime()), 0);
  });
});

describe("masteryLabel", () => {
  it("maps stages to readable labels", () => {
    assert.equal(masteryLabel(null), "baru");
    assert.equal(masteryLabel({ seen: 0 }), "baru");
    assert.equal(masteryLabel({ seen: 1, lastResult: "correct", reviewStage: 1 }), "sedang-dipelajari");
    assert.equal(masteryLabel({ seen: 3, reviewStage: 2 }), "berkembang");
    assert.equal(masteryLabel({ seen: 5, reviewStage: 4 }), "hampir-dikuasai");
    assert.equal(masteryLabel({ seen: 9, reviewStage: 5 }), "dikuasai");
    assert.equal(masteryLabel({ seen: 5, reviewStage: 3, lastResult: "incorrect" }), "perlu-review");
  });
});

describe("session sizes", () => {
  it("offers the blueprint lengths 5/10/20", () => {
    assert.deepEqual(SESSION_SIZES, [5, 10, 20]);
  });
});
