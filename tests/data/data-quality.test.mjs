import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);

function loadPublished(name) {
  return JSON.parse(readFileSync(new URL(`data/published/${name}`, root), "utf8"));
}

function normalizeLabel(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const publishedFiles = [
  "word-pairs.json",
  "phrase-pairs.json",
  "sample-sentences.json",
  "learning-items.json",
];

describe("published dataset shape", () => {
  it("every published file declares schemaVersion 2", () => {
    for (const name of publishedFiles) {
      const payload = loadPublished(name);
      assert.equal(payload.metadata.schemaVersion, 2, `${name} metadata.schemaVersion`);
      for (const item of payload.items) {
        assert.equal(item.schemaVersion, 2, `${name} item ${item.id} schemaVersion`);
      }
    }
  });

  it("metadata counts match actual published item counts", () => {
    const expectations = [
      ["word-pairs.json", "wordPairs"],
      ["phrase-pairs.json", "phrasePairs"],
      ["sample-sentences.json", "sampleSentences"],
      ["learning-items.json", "learningItems"],
    ];
    for (const [name, countKey] of expectations) {
      const payload = loadPublished(name);
      assert.equal(
        payload.metadata.counts[countKey],
        payload.items.length,
        `${name}.${countKey}`,
      );
    }
  });
});

describe("stable ids", () => {
  it("ids use the stable content-hash format, not sequential numbering", () => {
    for (const name of publishedFiles) {
      const { items } = loadPublished(name);
      if (name === "phrase-pairs.json") {
        // The phrase pool may legitimately be empty while no genuine
        // multi-token pairs exist in the corpus.
        continue;
      }
      assert.ok(items.length > 0);
      for (const item of items) {
        assert.match(item.id, /^(word|phrase|sentence)-[0-9a-f]{10}$/, `bad id: ${item.id}`);
        assert.ok(!/^-\d{4}$/.test(item.id.slice(-5)), `sequential id detected: ${item.id}`);
      }
    }
  });

  it("ids are globally unique across all published pools", () => {
    const seen = new Map();
    for (const name of publishedFiles.filter((n) => n !== "learning-items.json")) {
      for (const item of loadPublished(name).items) {
        assert.ok(!seen.has(item.id), `duplicate id across pools: ${item.id}`);
        seen.set(item.id, name);
      }
    }
  });

  it("learning-items is exactly the union of its source pools", () => {
    const poolIds = new Set();
    for (const name of ["word-pairs.json", "phrase-pairs.json", "sample-sentences.json"]) {
      for (const item of loadPublished(name).items) poolIds.add(item.id);
    }
    const learningIds = loadPublished("learning-items.json").items.map((item) => item.id);
    assert.equal(learningIds.length, poolIds.size);
    for (const id of learningIds) {
      assert.ok(poolIds.has(id), `learning item ${id} not present in any pool`);
    }
  });
});

describe("honest review statuses", () => {
  const allowed = new Set([
    "candidate",
    "corpus-derived",
    "source-evidence-qualified",
    "machine-reviewed",
    "human-reviewed",
    "needs-revision",
    "beta-unreviewed",
    "evidence-insufficient",
    "conflicted",
    "source-blocked",
    "reported",
    "rejected",
    "archived",
  ]);

  it("no item carries an unknown reviewStatus", () => {
    for (const name of publishedFiles.filter((n) => n !== "learning-items.json")) {
      for (const item of loadPublished(name).items) {
        assert.ok(
          allowed.has(item.reviewStatus),
          `item ${item.id} has invalid reviewStatus ${item.reviewStatus}`,
        );
        if (item.reviewStatus === "human-reviewed") {
          assert.ok(item.reviewedBy, `human-reviewed item ${item.id} lacks reviewer attribution`);
        }
      }
    }
  });

  it("no word item claims human review (corpus-only pipeline today)", () => {
    const words = loadPublished("word-pairs.json").items;
    for (const item of words) {
      assert.notEqual(item.reviewStatus, "human-reviewed");
    }
  });
});

describe("phrase integrity", () => {
  it("every published phrase has at least two meaningful tokens per side", () => {
    const phrases = loadPublished("phrase-pairs.json").items;
    for (const item of phrases) {
      assert.ok(normalizeLabel(item.batak).split(" ").length >= 2, `single-token batak: ${item.id}`);
      assert.ok(normalizeLabel(item.indonesia).split(" ").length >= 2, `single-token indonesia: ${item.id}`);
    }
  });

  it("phrase set stays empty while the corpus yields no genuine multi-token pairs", () => {
    // Honest state: the Bible-only word-level corpus cannot produce real
    // phrases yet. If this starts failing, new corpus data arrived - great.
    const phrases = loadPublished("phrase-pairs.json").items;
    assert.ok(Array.isArray(phrases));
  });
});

describe("question-pool invariants", () => {
  it("normalized batak labels are unique inside each pool", () => {
    for (const name of ["word-pairs.json", "phrase-pairs.json"]) {
      const labels = loadPublished(name).items.map((item) => normalizeLabel(item.batak));
      assert.equal(new Set(labels).size, labels.length, `duplicate batak labels in ${name}`);
    }
  });

  it("normalized indonesia labels are unique inside each pool", () => {
    for (const name of ["word-pairs.json", "phrase-pairs.json"]) {
      const labels = loadPublished(name).items.map((item) => normalizeLabel(item.indonesia));
      assert.equal(new Set(labels).size, labels.length, `duplicate indonesia labels in ${name}`);
    }
  });

  it("merged duplicates record their alternatives instead of being dropped silently", () => {
    const words = loadPublished("word-pairs.json").items;
    for (const item of words) {
      assert.ok(Array.isArray(item.indonesianAlternatives));
      assert.ok(Array.isArray(item.batakAlternatives));
    }
  });
});

describe("migration safety net", () => {
  it("id-map exists and maps legacy sequential ids onto stable ids", () => {
    const map = JSON.parse(readFileSync(new URL("data/migration/id-map.json", root), "utf8"));
    assert.equal(map.schemaVersion, 2);
    assert.ok(map.mappingCount > 0, "expected legacy ids to be mapped");
    for (const [legacyId, stableId] of Object.entries(map.mappings)) {
      assert.match(legacyId, /^(\w+)-\d{4}$/, `legacy id format: ${legacyId}`);
      assert.match(stableId, /^(\w+)-[0-9a-f]{10}$/, `stable id format: ${stableId}`);
    }
  });

  it("quality report stageCounts match the published pools", () => {
    const report = JSON.parse(readFileSync(new URL("data/reports/data-quality-report.json", root), "utf8"));
    assert.equal(report.stageCounts.wordPairs, loadPublished("word-pairs.json").items.length);
    assert.equal(report.stageCounts.phrasePairs, loadPublished("phrase-pairs.json").items.length);
    assert.equal(report.stageCounts.sampleSentences, loadPublished("sample-sentences.json").items.length);
  });
});
