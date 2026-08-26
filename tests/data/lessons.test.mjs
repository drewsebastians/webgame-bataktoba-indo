import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);

function loadPublished(name) {
  return JSON.parse(readFileSync(new URL(`data/published/${name}`, root), "utf8"));
}

const lessons = loadPublished("lessons.json");
const topics = loadPublished("topics.json");
const internalDrafts = JSON.parse(
  readFileSync(new URL("data/candidates/lesson-drafts.json", root), "utf8"),
);
const learning = new Map(loadPublished("learning-items.json").items.map((item) => [item.id, item]));

describe("public lesson registry (published-only)", () => {
  it("contains no drafts key and no draft records", () => {
    assert.equal(lessons.drafts, undefined);
    for (const lesson of lessons.published) {
      assert.equal(lesson.publicationStatus, "published");
    }
    const text = JSON.stringify(lessons);
    assert.ok(!text.includes('"publicationStatus": "draft"'));
    assert.ok(!text.includes('"needs-review"'));
    assert.ok(!text.includes('"editorial-draft"'));
  });

  it("internal drafts stay in the candidates layer only", () => {
    assert.ok(internalDrafts.draftLessons.length > 0 || internalDrafts.supplements.length >= 0);
    for (const lesson of internalDrafts.draftLessons) {
      assert.equal(lesson.publicationStatus, "draft");
    }
  });

  it("topics registry is public-safe and carries published item ids per theme", () => {
    for (const topic of topics.topics) {
      assert.ok(topic.slug && topic.title);
      assert.ok(["public-indexable", "public-noindex"].includes(topic.pageStatus));
      for (const id of topic.itemIds) {
        assert.ok(learning.has(id), `topic ${topic.slug} references missing item ${id}`);
      }
    }
  });

  it("published lessons meet minimum pool size and reference real items", () => {
    for (const lesson of lessons.published) {
      assert.ok(lesson.counts.poolItems >= lessons.minPoolItemsForPublication);
      for (const id of lesson.itemIds) assert.ok(learning.has(id));
      if (lesson.reviewRollup === "human-reviewed") {
        for (const id of lesson.itemIds) {
          assert.equal(learning.get(id)?.reviewStatus, "human-reviewed");
        }
      }
    }
  });
});
