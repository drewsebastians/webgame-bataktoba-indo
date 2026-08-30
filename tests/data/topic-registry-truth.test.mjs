import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8"));
const lessons = JSON.parse(readFileSync(join(root, "content/lessons.json"), "utf8"));

describe("topic registry truth (pool 0 must not claim lexical availability)", () => {
  it("published topics with poolItems 0 must use bounded description", () => {
    const boundedPhrases = [
      "materi terverifikasi belum tersedia",
      "masih menunggu sumber/review",
      "Panduan tema",
    ];
    for (const t of topics.topics) {
      if (t.poolItems === 0) {
        const desc = t.description.toLowerCase();
        // Fail if description claims specific lexical availability like listing kinship terms
        const risky = ["ayah, ibu", "dalihan na tolu", "salam dan ungkapan sopan dasar untuk memulai"];
        for (const phrase of risky) {
          assert.equal(
            desc.includes(phrase.toLowerCase()),
            false,
            `topic ${t.slug} pool 0 should not claim "${phrase}" — description: "${t.description}"`,
          );
        }
        // Must contain bounded framing
        const hasBounded = boundedPhrases.some((p) => desc.includes(p.toLowerCase()));
        assert.ok(hasBounded, `topic ${t.slug} with 0 items must use bounded description, got "${t.description}"`);
      }
    }
  });

  it("content/lessons.json definitions for 0-pool topics must be bounded", () => {
    const topicsBySlug = new Map(topics.topics.map((t) => [t.slug, t]));
    for (const [slug, def] of Object.entries(lessons.lessons)) {
      const meta = topicsBySlug.get(slug);
      if (meta && meta.poolItems === 0) {
        const lower = def.description.toLowerCase();
        assert.equal(
          lower.includes("dalihan na tolu"),
          false,
          `lessons.json ${slug} must not claim dalihan na tolu when pool 0`,
        );
        assert.ok(
          lower.includes("panduan tema") || lower.includes("materi terverifikasi") || lower.includes("masih menunggu"),
          `lessons.json ${slug} should be bounded, got "${def.description}"`,
        );
      }
    }
  });

  it("public JSON does not expose draft human-reviewed claims", () => {
    for (const t of topics.topics) {
      assert.notEqual(t.reviewRollup, "human-reviewed", `topic ${t.slug} should not be human-reviewed`);
    }
  });
});
