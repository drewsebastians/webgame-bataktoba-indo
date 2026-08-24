import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { normalizeLabel, normalizeSearch, tokenizeLabel } = await import(
  "../../assets/js/utils/normalize.js"
);

describe("normalizeLabel", () => {
  it("lowercases and trims", () => {
    assert.equal(normalizeLabel("  Horas "), "horas");
  });

  it("collapses internal whitespace", () => {
    assert.equal(normalizeLabel("di  mula\nni"), "di mula ni");
  });

  it("applies Unicode NFC composition", () => {
    const decomposed = "e\u0301"; // é as e + combining acute
    assert.equal(normalizeLabel(decomposed), "é");
    assert.equal(normalizeLabel("café"), normalizeLabel("cafe\u0301"));
  });

  it("treats visually identical labels as equal regardless of case or spacing", () => {
    assert.equal(normalizeLabel("Panangko"), normalizeLabel("panangko"));
    assert.equal(normalizeLabel("ma ulahon"), normalizeLabel("ma   ulahon"));
  });

  it("handles null and undefined safely", () => {
    assert.equal(normalizeLabel(null), "");
    assert.equal(normalizeLabel(undefined), "");
    assert.equal(normalizeLabel(42), "42");
  });
});

describe("normalizeSearch", () => {
  it("matches normalizeLabel behavior for search equality", () => {
    assert.equal(normalizeSearch("Debata   i"), "debata i");
  });
});

describe("tokenizeLabel", () => {
  it("splits a phrase into meaningful tokens", () => {
    assert.deepEqual(tokenizeLabel("Ama ni  Dakdanak"), ["ama", "ni", "dakdanak"]);
  });

  it("returns empty array for empty input", () => {
    assert.deepEqual(tokenizeLabel("   "), []);
  });

  it("returns single token for plain words", () => {
    assert.deepEqual(tokenizeLabel("panangko"), ["panangko"]);
  });
});
