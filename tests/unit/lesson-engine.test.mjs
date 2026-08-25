import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { buildLessonPlan, recommendNext, collectMistakes } = await import(
  "../../assets/js/game/lesson-engine.js"
);
const { makeQuestion } = await import("../../assets/js/game/question-engine.js");

const fixture = JSON.parse(readFileSync(new URL("../fixtures/lesson-fixture.json", import.meta.url), "utf8"));
const items = fixture.items;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("lesson engine plan", () => {
  const plan = buildLessonPlan(fixture.lesson, items, items, makeQuestion, { random: rng(1) });

  it("emits the full phase order", () => {
    assert.deepEqual(
      plan.map((s) => s.type),
      ["intro", "recognition", "recall", "mistake-review", "summary"],
    );
  });

  it("intro carries title/objective; recognition covers all items with one correct each", () => {
    assert.equal(plan[0].title, "Fixture Lesson");
    const questions = plan[1].questions;
    assert.equal(questions.length, items.length);
    for (const q of questions) {
      assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    }
  });

  it("recall prompts map to expected meanings", () => {
    for (const step of plan[2].prompts) {
      const item = items.find((i) => i.id === step.itemId);
      assert.equal(step.expected, item.indonesia);
    }
  });

  it("mistake review starts empty and collectMistakes dedupes preserving order", () => {
    assert.deepEqual(plan[3].itemIds, []);
    assert.deepEqual(collectMistakes(["a", "b", "a"]), ["a", "b"]);
  });

  it("recommendNext skips current and returns null when no other published lesson exists", () => {
    const registry = { published: [{ slug: "fixture" }, { slug: "other" }] };
    assert.equal(recommendNext(registry, "fixture"), "other");
    assert.equal(recommendNext({ published: [{ slug: "fixture" }] }, "fixture"), null);
    assert.equal(recommendNext(undefined, "x"), null);
  });
});
