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

  it("no lesson claims human review without reviewed members", () => {
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      if (lesson.reviewRollup === "human-reviewed") {
        const allReviewed = lesson.itemIds.every(
          (id) => learning.get(id)?.reviewStatus === "human-reviewed",
        );
        assert.ok(allReviewed, `lesson ${lesson.slug} claims human review without reviewed members`);
      }
    }
  });

  it("supplement drafts never leak into the published layer", () => {
    const { readFileSync, readdirSync } = require_fs();
    const draftsFile = JSON.parse(
      readFileSync(new URL("data/candidates/lesson-drafts.json", root), "utf8"),
    );
    for (const s of draftsFile.supplements) {
      assert.equal(s.reviewStatus, "needs-review");
      assert.equal(s.sourceType, "editorial-draft");
    }
    // no published file may contain any draft marker
    for (const file of readdirSync(new URL("data/published/", root))) {
      const text = readFileSync(new URL(`data/published/${file}`, root), "utf8");
      assert.ok(!text.includes('"needs-review"'), `draft status leaked into ${file}`);
      assert.ok(!text.includes('"editorial-draft"'), `draft source leaked into ${file}`);
    }
    // the public registry must not carry supplement item content
    for (const lesson of [...lessons.published, ...lessons.drafts]) {
      assert.equal(lesson.supplementItems, undefined, "public lessons must not embed supplements");
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

function require_fs() {
  return { readFileSync: fs.readFileSync, readdirSync: fs.readdirSync };
}
const fs = await import("node:fs");
