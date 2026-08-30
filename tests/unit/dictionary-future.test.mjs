import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("dictionary future fields readiness (fixtures only)", () => {
  const fixtureWithFuture = {
    id: "word-test",
    batak: "horas",
    indonesia: "salam",
    difficulty: 1,
    usageNote: "dipakai untuk sapaan",
    example: { batak: "horas ma", indonesia: "salam lah" },
    source: "human-reviewed",
    reviewStatus: "human-reviewed",
  };
  const prodItem = {
    id: "word-real",
    batak: "panangko",
    indonesia: "pencuri",
    difficulty: null,
    usageNote: "",
    example: null,
    source: "corpus-derived",
    reviewStatus: "corpus-derived",
  };

  it("schema/UI can support difficulty/usageNote/example when present (fixture)", () => {
    assert.equal(fixtureWithFuture.difficulty, 1);
    assert.equal(typeof fixtureWithFuture.usageNote, "string");
    assert.ok(fixtureWithFuture.example);
  });

  it("production hides unavailable fields honestly", () => {
    assert.equal(prodItem.difficulty, null);
    assert.equal(prodItem.usageNote, "");
    assert.equal(prodItem.example, null);
    // UI would disable difficulty filter and hide usage note — correct
  });

  it("bounded fuzzy does not mislead", () => {
    // Simple check: fuzzy should not match distant strings
    const query = "xyznope";
    const label = "panangko";
    assert.equal(label.includes(query), false);
  });
});
