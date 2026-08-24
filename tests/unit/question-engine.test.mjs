import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { createQuizRunner, makeQuestion, QuestionQueue, shuffleWith } = await import(
  "../../assets/js/game/question-engine.js"
);
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

function buildPool(count = 40, { prefixB = "b", prefixI = "i" } = {}) {
  const pool = [];
  for (let index = 0; index < count; index += 1) {
    const id = `word-${String(index).padStart(3, "0")}`;
    pool.push({
      id,
      type: "word",
      batak: `${prefixB}${index}`,
      indonesia: `${prefixI}${index}`,
      indonesianAlternatives: [],
      batakAlternatives: [],
      reviewStatus: "corpus-derived",
      quality: "high confidence",
    });
  }
  return pool;
}

describe("makeQuestion", () => {
  it("produces exactly one correct option", () => {
    const pool = buildPool();
    for (let seed = 0; seed < 50; seed += 1) {
      const random = mulberry32(seed);
      const item = pool[Math.floor(random() * pool.length)];
      const question = makeQuestion(item, pool, { random });
      assert.ok(question);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.itemId, item.id);
    }
  });

  it("option labels are unique after normalization", () => {
    // includes tricky near-duplicates that only differ by case/spacing
    const pool = buildPool(12);
    pool[5].indonesia = "Matahari";
    pool.push({ ...pool[6], id: "word-dup-case", indonesia: "matahari" });
    for (let seed = 0; seed < 50; seed += 1) {
      const random = mulberry32(100 + seed);
      const item = pool[Math.floor(random() * pool.length)];
      const question = makeQuestion(item, pool, { random });
      if (!question) continue;
      const labels = question.options.map((option) => normalizeLabel(option.label));
      assert.equal(new Set(labels).size, labels.length, `duplicate labels: ${labels.join(", ")}`);
    }
  });

  it("never places the answer's recorded alternatives as wrong options", () => {
    const pool = buildPool(20);
    const item = pool[0];
    item.indonesianAlternatives = ["i7"]; // i7 exists as another item's label
    for (let seed = 0; seed < 100; seed += 1) {
      const random = mulberry32(200 + seed);
      const question = makeQuestion(item, pool, { random });
      assert.ok(question);
      const wrongLabels = question.options
        .filter((option) => !option.isCorrect)
        .map((option) => normalizeLabel(option.label));
      assert.ok(!wrongLabels.includes("i7"));
    }
  });

  it("degrades gracefully when the pool is tiny", () => {
    const pool = buildPool(2);
    const question = makeQuestion(pool[0], pool, {});
    assert.ok(question);
    assert.equal(question.options.length, 2);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  });

  it("returns null instead of an ambiguous question when every distractor collides", () => {
    const pool = [
      { id: "w1", batak: "sama", indonesia: "sama", reviewStatus: "corpus-derived" },
      { id: "w2", batak: "beda", indonesia: "beda", reviewStatus: "corpus-derived" },
    ];
    // asking from indonesia side: distractor candidates collide on batak? no -
    // force collision by making both sides identical except ids.
    const colliding = [
      { id: "c1", batak: "halak", indonesia: "orang", reviewStatus: "corpus-derived" },
      { id: "c2", batak: "halak", indonesia: "manusia", reviewStatus: "corpus-derived" },
    ];
    // c1 asked from batak: other candidate's indonesia differs -> usable.
    // c2 asked with to=batak: distractor label 'halak' == answer label.
    const question = makeQuestion(colliding[1], colliding, { from: "indonesia", to: "batak" });
    assert.equal(question, null);
  });
});

describe("QuestionQueue", () => {
  it("does not repeat until the whole pool has been served", () => {
    const pool = buildPool(30);
    const queue = new QuestionQueue(pool, { random: mulberry32(7) });
    const served = [];
    for (let index = 0; index < 30; index += 1) {
      served.push(queue.next().id);
    }
    assert.equal(new Set(served).size, 30);
  });

  it("first item of a new cycle never equals the last served item", () => {
    const pool = buildPool(10);
    const queue = new QuestionQueue(pool, { random: mulberry32(11) });
    let last = null;
    for (let index = 0; index < 200; index += 1) {
      const item = queue.next();
      if (last && servedIndexInCycle(index)) {
        assert.notEqual(item.id, last.id, "immediate repeat across cycles");
      }
      last = item;
    }
    function servedIndexInCycle() {
      return true; // any adjacent pair must differ; covered below
    }
  });

  it("adjacent questions always differ, including across cycle boundaries", () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const pool = buildPool(5 + (seed % 10));
      const queue = new QuestionQueue(pool, { random: mulberry32(500 + seed) });
      let previousId = null;
      for (let step = 0; step < 120; step += 1) {
        const current = queue.next();
        assert.notEqual(current.id, previousId);
        previousId = current.id;
      }
    }
  });
});

describe("createQuizRunner", () => {
  it("scores an accepted answer exactly once and locks afterwards", () => {
    const runner = createQuizRunner({ pool: buildPool(), from: "batak", to: "indonesia" });
    const { question } = runner.nextQuestion();
    const correctOption = question.options.find((option) => option.isCorrect);

    const first = runner.answer(correctOption.id);
    assert.ok(first.accepted);
    assert.ok(first.isCorrect);

    const second = runner.answer(correctOption.id);
    assert.ok(!second.accepted);
  });

  it("reports the correct option on a wrong answer", () => {
    const runner = createQuizRunner({ pool: buildPool(), from: "batak", to: "indonesia" });
    const { question } = runner.nextQuestion();
    const wrongOption = question.options.find((option) => !option.isCorrect);
    const result = runner.answer(wrongOption.id);
    assert.ok(result.accepted);
    assert.ok(!result.isCorrect);
    assert.equal(result.correctOptionId, question.options.find((option) => option.isCorrect).id);
  });

  it("survives long sessions without broken questions or immediate repeats", () => {
    for (let seed = 0; seed < 10; seed += 1) {
      const runner = createQuizRunner({
        pool: buildPool(25),
        from: "batak",
        to: "indonesia",
        random: mulberry32(900 + seed),
      });
      let previousPrompt = null;
      for (let step = 0; step < 150; step += 1) {
        const { question, error } = runner.nextQuestion();
        assert.ok(!error, `unexpected error state: ${error}`);
        assert.ok(question);
        const correctOptions = question.options.filter((option) => option.isCorrect);
        assert.equal(correctOptions.length, 1);
        const labels = question.options.map((option) => normalizeLabel(option.label));
        assert.equal(new Set(labels).size, labels.length);
        if (previousPrompt !== null && question.prompt === previousPrompt) {
          assert.fail("same prompt served twice in a row");
        }
        previousPrompt = question.prompt;
        runner.answer(correctOptions[0].id);
      }
    }
  });

  it("handles reverse direction", () => {
    const runner = createQuizRunner({ pool: buildPool(), from: "indonesia", to: "batak" });
    const { question } = runner.nextQuestion();
    assert.match(question.prompt, /^i\d+$/);
    assert.match(question.options.find((option) => option.isCorrect).label, /^b\d+$/);
  });

  it("returns an explicit error state for an empty pool", () => {
    const runner = createQuizRunner({ pool: [], from: "batak", to: "indonesia" });
    const result = runner.nextQuestion();
    assert.equal(result.error, "empty-pool");
  });

  it("shuffleWith is injectable and deterministic", () => {
    const input = [1, 2, 3, 4, 5];
    const a = shuffleWith(input, mulberry32(42));
    const b = shuffleWith(input, mulberry32(42));
    assert.deepEqual(a, b);
    assert.deepEqual(input, [1, 2, 3, 4, 5]);
  });
});
