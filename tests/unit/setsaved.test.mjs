import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const mod = await import(`../../assets/js/progress.js?sv=${Math.random()}`);
await mod.initProgress();

describe("setSaved persistence", () => {
  it("writes saved=true into storage", () => {
    mod.setSaved("word-be83d23d14", true);
    const savedIds = mod.getSavedIds();
    assert.ok(savedIds.includes("word-be83d23d14"), "getSavedIds missing id");
    const raw = JSON.parse(store.get("batakTobaPlay.progress.v2"));
    assert.equal(raw.items["word-be83d23d14"].saved, true);
  });

  it("survives export/import round-trip with flags", () => {
    const exported = mod.exportProgress();
    mod.resetProgress();
    const result = mod.importProgress(exported);
    assert.ok(result.ok);
    assert.ok(mod.getSavedIds().includes("word-be83d23d14"));
  });
});
