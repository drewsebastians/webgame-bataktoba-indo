import test from "node:test";
import assert from "node:assert/strict";
import { getOnboarding, hasLessonHistory, saveOnboarding, shouldOfferOnboarding } from "../../assets/js/onboarding.js";

const ONBOARDING_KEY = "batakTobaPlay.onboarding";

function installLocalStorage(t) {
  const values = new Map();
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else delete globalThis.localStorage;
  });
  return storage;
}

test("onboarding is offered only before meaningful progress", () => {
  assert.equal(shouldOfferOnboarding({ answered: 0, sessions: [], lessons: {} }), true);
  assert.equal(shouldOfferOnboarding({ answered: 0, sessions: [], lessons: { angka: { startedAt: 1 } } }), false);
  assert.equal(shouldOfferOnboarding({ answered: 0, sessions: [], lessons: { angka: { completedAt: 2 } } }), false);
  assert.equal(shouldOfferOnboarding({ answered: 1, sessions: [], lessons: {} }), false);
});

test("lesson history accepts only progress records with start or completion timestamps", () => {
  assert.equal(hasLessonHistory({ lessons: { angka: { startedAt: 1 } } }), true);
  assert.equal(hasLessonHistory({ lessons: { sapaan: { completedAt: 2 } } }), true);
  assert.equal(hasLessonHistory({ lessons: { keluarga: {} } }), false);
  assert.equal(hasLessonHistory({ lessons: [] }), false);
  assert.equal(hasLessonHistory({}), false);
});

test("migrates supported legacy durations into version-two session sizes", (t) => {
  const storage = installLocalStorage(t);
  for (const [durationMinutes, sessionSize] of [[3, 5], [5, 10], [10, 20]]) {
    storage.setItem(ONBOARDING_KEY, JSON.stringify({
      version: 1,
      durationMinutes,
      skipped: true,
      completedAt: 123,
    }));

    assert.deepEqual(getOnboarding(), {
      version: 2,
      sessionSize,
      skipped: true,
      completedAt: 123,
    });
    assert.equal(JSON.parse(storage.getItem(ONBOARDING_KEY)).version, 2);
  }
});

test("normalizes unsupported session sizes when saving preferences", (t) => {
  const storage = installLocalStorage(t);
  assert.equal(saveOnboarding({ sessionSize: 20 }).sessionSize, 20);
  const fallback = saveOnboarding({ sessionSize: 7 });
  assert.equal(fallback.sessionSize, 10);
  assert.equal(JSON.parse(storage.getItem(ONBOARDING_KEY)).sessionSize, 10);
});
