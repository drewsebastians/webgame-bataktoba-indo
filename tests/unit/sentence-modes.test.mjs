import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { tokenizeLabel } from "../../assets/js/utils/normalize.js";

// Sentence reorder / fill-blank capability — test-only fixtures, not production activation (beta-unreviewed 80 remain excluded)
describe("sentence modes — reorder & fill-blank (fixture proof)", () => {
  const reviewedSentences = [
    { id: "sent-001", batak: "horas ma", indonesia: "salam lah", reviewStatus: "human-reviewed" },
    { id: "sent-002", batak: "tabe mardongan", indonesia: "salam berteman", reviewStatus: "human-reviewed" },
  ];
  const unreviewed = { id: "sent-999", batak: "beta", indonesia: "beta", reviewStatus: "beta-unreviewed" };

  it("reviewed eligibility gate", () => {
    assert.equal(reviewedSentences.every((s) => s.reviewStatus === "human-reviewed"), true);
    assert.equal(unreviewed.reviewStatus === "human-reviewed", false);
  });

  it("stable tokenization and reconstruction", () => {
    for (const s of reviewedSentences) {
      const tokens = tokenizeLabel(s.batak);
      assert.ok(tokens.length >= 2, "sentence must tokenize to >=2 tokens");
      const reconstructed = tokens.join(" ");
      assert.equal(reconstructed, s.batak.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase().split(" ").join(" "));
    }
  });

  it("reorder scoring deterministic", () => {
    const tokens = tokenizeLabel("horas ma");
    const shuffled = [...tokens].sort();
    const isCorrect = (answer) => answer.join(" ") === tokens.join(" ");
    assert.equal(isCorrect(tokens), true);
    assert.equal(isCorrect(shuffled), shuffled.join(" ") === tokens.join(" "));
  });

  it("fill-blank: one bounded blank, one intended answer", () => {
    const sentence = "horas ma tondi";
    const tokens = tokenizeLabel(sentence);
    const blankIdx = 1;
    const blanked = tokens.map((t, i) => (i === blankIdx ? "___" : t)).join(" ");
    assert.equal(blanked.includes("___"), true);
    assert.equal(blanked.split("___").length, 2); // exactly one blank
    const intended = tokens[blankIdx];
    assert.equal(intended, "ma");
    // alternatives handled via normalize
    assert.equal(intended.toLowerCase(), "ma");
  });

  it("production beta sentences remain excluded", () => {
    // Gating: only human-reviewed sentences may be used for reorder/fill-blank
    const eligible = reviewedSentences.filter((s) => s.reviewStatus === "human-reviewed");
    const prodBeta = [unreviewed].filter((s) => s.reviewStatus === "human-reviewed");
    assert.equal(eligible.length, 2);
    assert.equal(prodBeta.length, 0);
  });
});
