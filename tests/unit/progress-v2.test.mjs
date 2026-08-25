import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Minimal localStorage stub before importing the module.
class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

const store = new MemoryStorage();
globalThis.localStorage = store;

let progress;
let legacy;

beforeEach(async () => {
  store.clear();
  // fresh module instance per test via query-string cache buster
  const mod = await import(`../../assets/js/progress.js?ts=${Date.now()}-${Math.random()}`);
  progress = mod;
  return mod.initProgress();
});

describe("progress v3 basics", () => {
  it("starts with an empty versioned payload", async () => {
    const state = progress.getProgress();
    assert.equal(state.schemaVersion, 3);
    assert.equal(state.answered, 0);
    assert.deepEqual(state.items, {});
  });

  it("records aggregate answers", () => {
    progress.recordAnswer(true, "meaning", "word-0000000001");
    progress.recordAnswer(false, "meaning", "word-0000000002");
    const state = progress.getProgress();
    assert.equal(state.answered, 2);
    assert.equal(state.correct, 1);
    assert.equal(state.lastMode, "meaning");
  });

  it("saved and difficult are independent flags", () => {
    const id = "word-flags00001";
    progress.recordAnswer(true, "meaning", id); // stage 1
    progress.setSaved(id, true);
    progress.setDifficult(id, true);
    let stats = progress.getItemStats(id);
    assert.equal(stats.saved, true);
    assert.equal(stats.difficult, true);
    assert.equal(stats.reviewStage, 1, "flags must not reset review stage");

    // answering wrong keeps flags but resets schedule
    progress.recordAnswer(false, "meaning", id);
    stats = progress.getItemStats(id);
    assert.equal(stats.saved, true);
    assert.equal(stats.difficult, true);
    assert.equal(stats.reviewStage, 0);

    progress.setSaved(id, false);
    stats = progress.getItemStats(id);
    assert.equal(stats.saved, false);
    assert.equal(stats.difficult, true);

    assert.ok(progress.getSavedIds().includes(id) === false);
    assert.ok(progress.getDifficultIds().includes(id));
  });
});

describe("v2 -> v3 migration", () => {
  it("promotes bucket saved/difficult into independent flags", async () => {
    const fresh = await import(`../../assets/js/progress.js?v23=${Math.random()}`);
    const v2Payload = {
      schemaVersion: 2,
      answered: 4,
      correct: 2,
      lastMode: "meaning",
      items: {
        "word-aaaaaaaaaa": { seen: 2, correctCount: 1, bucket: "saved" },
        "word-bbbbbbbbbb": { seen: 3, incorrectCount: 2, bucket: "difficult" },
        "word-cccccccccc": { seen: 5, correctCount: 5, bucket: "known" },
        "word-dddddddddd": { seen: 1, incorrectCount: 1, bucket: "review" },
      },
    };
    const migrated = fresh.validateProgressPayload(v2Payload);
    assert.equal(migrated.schemaVersion, 3);
    assert.equal(migrated.items["word-aaaaaaaaaa"].saved, true);
    assert.equal(migrated.items["word-aaaaaaaaaa"].bucket, null);
    assert.equal(migrated.items["word-bbbbbbbbbb"].difficult, true);
    assert.equal(migrated.items["word-bbbbbbbbbb"].bucket, null);
    assert.equal(migrated.items["word-cccccccccc"].bucket, "known");
    assert.equal(migrated.items["word-dddddddddd"].bucket, "review");
  });
});

describe("review schedule (deterministic)", () => {
  it("correct answers advance stages with the documented intervals", () => {
    const id = "word-aaaaaaaaaa";
    progress.recordAnswer(true, "meaning", id);
    let stats = progress.getItemStats(id);
    assert.equal(stats.reviewStage, 1);
    assert.ok(Math.abs((stats.nextReviewAt - Date.now()) - progress.nextReviewDelayDays(1) * 864e5) < 2000);

    progress.recordAnswer(false, "meaning", id);
    stats = progress.getItemStats(id);
    assert.equal(stats.reviewStage, 0);
    assert.ok(stats.nextReviewAt <= Date.now(), "wrong answer must be due immediately");
    assert.equal(stats.bucket, "review");
  });

  it("interval table matches the blueprint: 1, 3, 7, 14, 30 days", () => {
    assert.deepEqual(progress.REVIEW_INTERVAL_DAYS, [1, 3, 7, 14, 30]);
  });

  it("getDueItems only returns items whose next review time passed", async () => {
    const pool = [
      { id: "word-due000001" },
      { id: "word-late000002" },
      { id: "word-fresh00003" },
    ];
    progress.markFlashcard(pool[0].id, "review"); // due now
    progress.recordAnswer(true, "meaning", pool[1].id); // due in ~1 day
    const due = progress.getDueItems(pool);
    assert.ok(due.some((item) => item.id === "word-due000001"));
    assert.ok(!due.some((item) => item.id === "word-fresh00003"));
  });
});

describe("legacy migration", () => {
  it("migrates aggregates and remaps bucket ids through the id map", async () => {
    store.setItem(
      "batakTobaGameProgress",
      JSON.stringify({
        answered: 12,
        correct: 9,
        known: ["word-0001"],
        review: ["word-0002"],
        lastMode: "reverse",
      }),
    );
    const fresh = await import(`../../assets/js/progress.js?m=${Math.random()}`);
    const migrated = fresh.migrateLegacyProgress(
      JSON.parse(store.getItem("batakTobaGameProgress")),
      { "word-0001": "word-1111111111", "word-0002": "word-2222222222" },
    );
    assert.equal(migrated.answered, 12);
    assert.equal(migrated.correct, 9);
    assert.equal(migrated.lastMode, "reverse");
    assert.equal(migrated.migratedFromLegacy, true);
    assert.equal(migrated.items["word-1111111111"].bucket, "known");
    assert.equal(migrated.items["word-2222222222"].bucket, "review");
    assert.ok(migrated.items["word-1111111111"].reviewStage >= 3);
  });

  it("keeps unmapped legacy ids instead of dropping them", () => {
    const migrated = progress.migrateLegacyProgress({ known: ["word-9999"] }, {});
    assert.equal(migrated.items["word-9999"].bucket, "known");
  });

  it("auto-migrates on init when only legacy storage exists", async () => {
    store.removeItem("batakTobaPlay.progress.v2");
    store.setItem(
      "batakTobaGameProgress",
      JSON.stringify({ answered: 5, correct: 4, known: [], review: [], lastMode: "matching" }),
    );
    const fresh = await import(`../../assets/js/progress.js?auto=${Math.random()}`);
    await fresh.initProgress();
    const state = fresh.getProgress();
    assert.equal(state.answered, 5);
    assert.equal(state.migratedFromLegacy, true);
    assert.ok(store.getItem("batakTobaPlay.progress.v2"), "migrated state must be persisted");
  });

  it("legacy storage survives migration (never deleted blindly)", async () => {
    store.removeItem("batakTobaPlay.progress.v2");
    store.setItem(
      "batakTobaGameProgress",
      JSON.stringify({ answered: 3, correct: 2, known: ["x"], review: [] }),
    );
    const fresh = await import(`../../assets/js/progress.js?keep=${Math.random()}`);
    await fresh.initProgress();
    assert.ok(store.getItem("batakTobaGameProgress"), "legacy key must not be deleted by migration");
  });
});

describe("corrupted storage handling", () => {
  it("quarantines corrupt payloads instead of crashing or overwriting silently", async () => {
    store.removeItem("batakTobaPlay.progress.v2");
    const corrupt = '{"schemaVersion":2,"answered":"not-a-number",';
    store.setItem("batakTobaPlay.progress.v2", corrupt);

    const fresh = await import(`../../assets/js/progress.js?corrupt=${Math.random()}`);
    const state = await fresh.initProgress();
    assert.equal(state.schemaVersion, 3);
    assert.ok(
      store.getItem("batakTobaPlay.progress.v2.corrupt-backup")?.includes("not-a-number"),
      "corrupt payload must be preserved as backup",
    );
  });

  it("rejects invalid imports without touching current state", () => {
    const before = progress.exportProgress();
    const bad = progress.importProgress("{ nope");
    assert.equal(bad.ok, false);
    assert.equal(progress.exportProgress(), before);

    const wrongSchema = progress.importProgress(JSON.stringify({ schemaVersion: 99 }));
    assert.equal(wrongSchema.ok, false);
    assert.equal(progress.exportProgress(), before);
  });

  it("accepts valid exports round-trip", () => {
    progress.recordAnswer(true, "meaning", "word-ab12cd34ef");
    const exported = progress.exportProgress();
    progress.resetProgress();
    const result = progress.importProgress(exported);
    assert.ok(result.ok);
    assert.equal(result.progress.answered, 1);
    assert.ok(result.progress.items["word-ab12cd34ef"]);
  });
});

describe("bounded storage and resilience", () => {
  it("caps tracked items to the configured maximum", async () => {
    const fresh = await import(`../../assets/js/progress.js?bound=${Math.random()}`);
    for (let index = 0; index < 2100; index += 1) {
      fresh.recordAnswer(index % 2 === 0, "meaning", `word-bounded${String(index).padStart(6, "0")}`.slice(0, 15));
    }
    const state = fresh.getProgress();
    assert.ok(Object.keys(state.items).length <= 2000);
  });

  it("works when localStorage is unavailable (memory fallback)", async () => {
    globalThis.localStorage = undefined;
    try {
      const fresh = await import(`../../assets/js/progress.js?nomem=${Math.random()}`);
      await fresh.initProgress();
      fresh.recordAnswer(true, "meaning", "word-nostorage1");
      assert.equal(fresh.getProgress().answered, 1);
    } finally {
      globalThis.localStorage = store;
    }
  });

  it("reset produces a clean v2 payload", () => {
    progress.recordAnswer(false, "reverse", "word-reset00001");
    progress.resetProgress();
    const state = progress.getProgress();
    assert.equal(state.answered, 0);
    assert.deepEqual(state.items, {});
  });
});
