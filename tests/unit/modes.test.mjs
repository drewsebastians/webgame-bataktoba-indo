import { describe, it } from "node:test";
import assert from "node:assert/strict";

const {
  checkTypedAnswer,
  buildTrueFalse,
  buildMemoryBoard,
  dailySeed,
  mulberry32,
  boundedLevenshtein,
} = await import("../../assets/js/game/modes.js");
const { normalizeLabel } = await import("../../assets/js/utils/normalize.js");

function pool(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `word-${String(i).padStart(10, "0")}`,
    batak: `batak${i}`,
    indonesia: `indo${i}`,
    indonesianAlternatives: [],
    batakAlternatives: [],
  }));
}

describe("boundedLevenshtein", () => {
  it("computes distance with early exit", () => {
    assert.equal(boundedLevenshtein("kuda", "kudah", 2), 1);
    assert.equal(boundedLevenshtein("abcdef", "abdcef", 2), 2);
    assert.ok(boundedLevenshtein("short", "aVeryDifferentLongWord", 2) > 2);
  });
});

describe("checkTypedAnswer", () => {
  const item = {
    id: "word-0000000001",
    batak: "panangko",
    indonesia: "pencuri",
    indonesianAlternatives: ["maling"],
    batakAlternatives: [],
  };

  it("accepts exact normalized answers", () => {
    for (const input of ["pencuri", "  PENCURI  ", "pencuri\n"]) {
      const result = checkTypedAnswer(input, item);
      assert.equal(result.correct, true);
      assert.equal(result.fuzzy, false);
    }
  });

  it("accepts recorded alternatives as exact matches", () => {
    assert.equal(checkTypedAnswer("Maling", item).correct, true);
  });

  it("allows limited transparent typo tolerance", () => {
    const oneOff = checkTypedAnswer("pencuru", item); // len>=5 -> tolerance 1
    assert.equal(oneOff.correct, true);
    assert.equal(oneOff.fuzzy, true);

    // long words get tolerance 2
    const long = { ...item, indonesia: "bertanggungjawab" };
    assert.equal(checkTypedAnswer("bertanggungjawab", long).correct, true);
  });

  it("rejects unrecorded synonyms and wrong answers", () => {
    assert.equal(checkTypedAnswer("penjahat", item).correct, false);
    // two substitutions on a 7-char word exceeds tolerance 1
    assert.equal(checkTypedAnswer("pxnclri", item).correct, false);
  });

  it("never invents synonyms: empty input fails", () => {
    assert.equal(checkTypedAnswer("", item).correct, false);
  });
});

describe("buildTrueFalse", () => {
  it("false statements never use recorded alternatives", () => {
    const items = pool(20);
    items[0].indonesia = "ind0";
    items[0].indonesianAlternatives = ["ind1"];
    for (let seed = 0; seed < 200; seed += 1) {
      const random = mulberry32(seed);
      const q = buildTrueFalse(items[0], items, { random, to: "indonesia" });
      if (!q.isTrueStatement) {
        const shownLabel = q.statement.split(" = ")[1];
        assert.notEqual(normalizeLabel(shownLabel), "ind1");
        assert.notEqual(normalizeLabel(shownLabel), "ind0");
      }
    }
  });

  it("produces both true and false statements across seeds", () => {
    const items = pool(20);
    let trues = 0;
    let falses = 0;
    for (let seed = 0; seed < 50; seed += 1) {
      const q = buildTrueFalse(items[seed % items.length], items, { random: mulberry32(seed) });
      if (q.isTrueStatement) trues += 1;
      else falses += 1;
    }
    assert.ok(trues > 0 && falses > 0);
  });
});

describe("buildMemoryBoard", () => {
  it("creates pairCount*2 unique-position cards with matching sides", () => {
    const { cards, pairs } = buildMemoryBoard(pool(12), { pairCount: 6, random: mulberry32(3) });
    assert.equal(pairs, 6);
    assert.equal(cards.length, 12);
    const ids = new Map();
    for (const card of cards) {
      ids.set(card.id, (ids.get(card.id) ?? 0) + 1);
    }
    for (const count of ids.values()) assert.equal(count, 2);
    for (const [id] of ids) {
      const sides = cards.filter((c) => c.id === id).map((c) => c.side).sort();
      assert.deepEqual(sides, ["batak", "indonesia"]);
    }
  });

  it("caps pairs to available distinct items", () => {
    const { pairs } = buildMemoryBoard(pool(3), { pairCount: 8 });
    assert.equal(pairs, 3);
  });
});

describe("daily challenge seeding", () => {
  it("same date key -> same seed; different date -> different seed", () => {
    assert.equal(dailySeed("2026-08-25"), dailySeed("2026-08-25"));
    assert.notEqual(dailySeed("2026-08-25"), dailySeed("2026-08-26"));
  });

  it("seeded RNG is deterministic", () => {
    const a = Array.from({ length: 5 }, () => mulberry32(dailySeed("2026-01-01"))());
    void a;
    const rngA = mulberry32(dailySeed("2026-01-01"));
    const rngB = mulberry32(dailySeed("2026-01-01"));
    for (let i = 0; i < 10; i += 1) assert.equal(rngA(), rngB());
  });
});
