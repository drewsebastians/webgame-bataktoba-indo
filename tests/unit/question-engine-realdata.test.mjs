import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { createQuizRunner, makeQuestion } = await import("../../assets/js/game/question-engine.js");
const { normalizeLabel } = await import("../../assets/js/utils/normalize.js");

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const root = new URL("../../", import.meta.url);

function loadPublishedItems(name) {
  return JSON.parse(readFileSync(new URL(`data/published/${name}`, root), "utf8")).items;
}

describe("question engine against real published data", () => {
  const wordPool = loadPublishedItems("word-pairs.json");
  const sentencePool = loadPublishedItems("sample-sentences.json");

  // Public-safe mode: if pools are empty (licensing blocked), skip gracefully
  const isPublicSafe = wordPool.length === 0 && sentencePool.length === 0;

  if (isPublicSafe) {
    it("public-safe mode: skips real-data tests (licensing blocks public corpus)", () => {
      assert.ok(true, "Public-safe mode active - no corpus-derived content in public runtime");
    });
    return;
  }

  it("word pool is large enough for meaningful quizzes", () => {
    assert.ok(wordPool.length >= 300);
  });

  it("plays 500 forward rounds on real words without broken questions", () => {
    let checked = 0;
    for (let seed = 0; seed < 5; seed += 1) {
      const runner = createQuizRunner({
        pool: wordPool,
        from: "batak",
        to: "indonesia",
        random: mulberry32(31 + seed),
      });
      let previousPrompt = null;
      for (let step = 0; step < 100; step += 1) {
        const { question, error } = runner.nextQuestion();
        assert.ok(!error);
        assert.ok(question.options.length >= 2, "real questions must have at least two options");
        assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
        const labels = question.options.map((option) => normalizeLabel(option.label));
        assert.equal(new Set(labels).size, labels.length);
        assert.notEqual(question.prompt, previousPrompt);
        previousPrompt = question.prompt;
        runner.answer(question.options.find((option) => option.isCorrect).id);
        checked += 1;
      }
    }
    assert.equal(checked, 500);
  });

  it("plays reverse mode on real words without ambiguity", () => {
    const runner = createQuizRunner({
      pool: wordPool,
      from: "indonesia",
      to: "batak",
      random: mulberry32(77),
    });
    for (let step = 0; step < 100; step += 1) {
      const { question, error } = runner.nextQuestion();
      assert.ok(!error);
      const correctOptions = question.options.filter((option) => option.isCorrect);
      assert.equal(correctOptions.length, 1);
      const correctLabel = normalizeLabel(correctOptions[0].label);
      for (const option of question.options.filter((candidate) => !candidate.isCorrect)) {
        assert.notEqual(normalizeLabel(option.label), correctLabel);
      }
      runner.answer(correctOptions[0].id);
    }
  });

  it("plays sentence mode on real sentences", () => {
    const runner = createQuizRunner({
      pool: sentencePool,
      from: "batak",
      to: "indonesia",
      random: mulberry32(99),
    });
    for (let step = 0; step < 80; step += 1) {
      const { question, error } = runner.nextQuestion();
      assert.ok(!error);
      assert.ok(question.options.length >= 2);
      runner.answer(question.options.find((option) => option.isCorrect).id);
    }
  });

  it("pipeline-recorded alternatives are never offered as wrong options", () => {
    const itemsWithAlternatives = wordPool.filter(
      (item) =>
        (item.indonesianAlternatives?.length ?? 0) > 0 ||
        (item.batakAlternatives?.length ?? 0) > 0,
    );
    assert.ok(itemsWithAlternatives.length > 0, "expected merged alternatives in real data");
    for (const item of itemsWithAlternatives.slice(0, 10)) {
      for (let seed = 0; seed < 20; seed += 1) {
        const question = makeQuestion(item, wordPool, {
          random: mulberry32(400 + seed),
          from: "batak",
          to: "indonesia",
        });
        if (!question) continue;
        const answerLabels = new Set([item.indonesia, ...(item.indonesianAlternatives ?? [])].map(normalizeLabel));
        for (const option of question.options.filter((candidate) => !candidate.isCorrect)) {
          assert.ok(!answerLabels.has(normalizeLabel(option.label)));
        }
      }
    }
  });
});