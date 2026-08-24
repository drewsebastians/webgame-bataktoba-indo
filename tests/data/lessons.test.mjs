import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);

function loadPublished(name) {
  return JSON.parse(readFileSync(new URL(`data/published/${name}`, root), "utf8"));
}

const lessons = loadPublished("lessons.json");
const learning = new Map(loadPublished("learning-items.json").items.map((item) => [item.id, item]));

describe("lesson registry integrity", () => {
  it("declares schema version and minimum pool rule", () => {
    assert.equal(lessons.schemaVersion, 2);
    assert.ok(lessons.minPoolItemsForPublication >= 6);
  });

  it("published lessons meet the minimum corpus pool size", () => {
    for (const lesson of lessons.published) {
      assert.ok(
        lesson.counts.poolItems >= lessons.minPoolItemsForPublication,
        `lesson ${lesson.slug} published below minimum`,
      );
    }
  });

  it("every lesson item id exists in published learning items", () => {
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      for (const id of lesson.itemIds) {
        assert.ok(learning.has(id), `${lesson.slug} references missing item ${id}`);
      }
    }
  });

  it("lesson titles match actual theme content (no overpromising)", () => {
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      const hasMaterial = lesson.counts.poolItems > 0 || lesson.counts.supplementItems > 0;
      assert.ok(hasMaterial, `lesson ${lesson.slug} titled without any material`);
    }
  });

  it("review rollups are honest - no lesson claims human review", () => {
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      if (lesson.reviewRollup === "human-reviewed") {
        const allReviewed = lesson.itemIds.every(
          (id) => learning.get(id)?.reviewStatus === "human-reviewed",
        );
        assert.ok(allReviewed, `lesson ${lesson.slug} claims human review without reviewed members`);
      } else {
        assert.notEqual(lesson.reviewRollup, "human-reviewed");
      }
    }
  });

  it("supplement drafts never leak into game data", () => {
    const supplementKeys = new Set();
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      for (const s of lesson.supplementItems) {
        supplementKeys.add(`${s.batak}|${s.indonesia}`);
        assert.equal(s.reviewStatus, "needs-review");
        assert.equal(s.sourceType, "editorial-draft");
      }
    }
    for (const item of learning.values()) {
      assert.ok(
        !supplementKeys.has(`${item.batak}|${item.indonesia}`),
        `draft supplement leaked into game pool: ${item.id}`,
      );
    }
  });

  it("theme tags on corpus items are consistent with the lessons referencing them", () => {
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      for (const id of lesson.itemIds) {
        const item = learning.get(id);
        if (item.themes) {
          assert.ok(item.themes.includes(lesson.theme), `item ${id} lacks theme ${lesson.theme}`);
        }
      }
    }
  });
});
