import { learningResource } from "../../tools/lib/learning-resource.mjs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const published = {
  slug: "angka",
  title: "Angka Batak Toba",
  description: "Angka dasar.",
  level: 1,
  estMinutes: 5,
  reviewRollup: "corpus-derived-beta",
  publicationStatus: "published",
  counts: { poolItems: 6 },
  itemIds: ["a", "b", "c", "d", "e", "f"],
};
const draft = { ...published, publicationStatus: "draft" };
const empty = { ...published, counts: { poolItems: 0 }, itemIds: [] };

describe("LearningResource generator (Task 7)", () => {
  it("emits truthful LearningResource for published lessons only", () => {
    const resource = learningResource(published, "https://example.com/");
    assert.equal(resource["@type"], "LearningResource");
    assert.equal(resource.url, "https://example.com/belajar/angka/");
    assert.equal(resource.numberOfItems, 6);
    assert.equal(resource.reviewStatus, "corpus-derived-beta");
  });

  it("returns null for drafts / empty shells / missing input", () => {
    assert.equal(learningResource(draft, "https://example.com/"), null);
    assert.equal(learningResource(empty, "https://example.com/"), null);
    assert.equal(learningResource(undefined, "https://example.com/"), null);
  });
});
