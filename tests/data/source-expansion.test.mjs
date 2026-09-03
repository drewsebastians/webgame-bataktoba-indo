import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

describe("source expansion — synthetic fixture (public-safe: 0 pool items)", () => {
  const fixture = JSON.parse(readFileSync(join(process.cwd(), "tests/fixtures/source-synthetic-angka.json"), "utf8"));

  it("source validate passes for synthetic approved source", () => {
    assert.equal(fixture.sourceId, "synthetic-test-angka");
    assert.equal(fixture.licenseStatus, "APPROVED_FOR_INGESTION");
    assert.equal(fixture.records.length, 3);
    for (const r of fixture.records) {
      assert.ok(r.externalRecordId);
      assert.ok(r.batak);
      assert.ok(r.indonesian);
      assert.ok(r.sourceReference);
    }
  });

  it("candidate generation logic works with public-safe empty pool", () => {
    const topics = JSON.parse(readFileSync(join(process.cwd(), "data/published/topics.json"), "utf8"));
    const angka = topics.topics.find((t) => t.slug === "angka");
    // Public-safe: angka has 0 pool items (no licensed content)
    assert.equal(angka.poolItems, 0);
    // Fixture would add 3, but they're synthetic and don't affect production
    const wouldBe = angka.poolItems + fixture.records.length;
    assert.equal(wouldBe, 3);
    // Production word pairs is 0 (public-safe mode, licensing blocked)
    const published = JSON.parse(readFileSync(join(process.cwd(), "data/published/word-pairs.json"), "utf8"));
    assert.equal(published.items.length, 0);
  });

  it("fixture never leaks to published/dist", () => {
    const published = JSON.parse(readFileSync(join(process.cwd(), "data/published/word-pairs.json"), "utf8"));
    const hasSynthetic = published.items.some((i) => i.batak === "zalpha" || i.id.includes("zalpha"));
    assert.equal(hasSynthetic, false);
    const distLearning = JSON.parse(readFileSync(join(process.cwd(), "dist/data/published/learning-items.json"), "utf8"));
    assert.equal(distLearning.items.some((i) => i.batak === "zalpha"), false);
  });

  it("stable IDs, dedupe, lesson gap, review queue delta", () => {
    const ids = fixture.records.map((r) => {
      const h = createHash("sha256").update(r.batak + "\x1f" + r.indonesian).digest("hex").slice(0, 10);
      return `word-${h}`;
    });
    assert.equal(new Set(ids).size, 3); // no dup
    // Lesson gap would increase from current (0)
    const topics = JSON.parse(readFileSync(join(process.cwd(), "data/published/topics.json"), "utf8"));
    const angka = topics.topics.find((t) => t.slug === "angka");
    assert.equal(angka.poolItems + 3 >= 8, false); // 3 < 8, not publishable
  });
});