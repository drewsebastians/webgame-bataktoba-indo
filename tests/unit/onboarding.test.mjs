import test from "node:test";
import assert from "node:assert/strict";
import { getOnboarding, hasLessonHistory, saveOnboarding, shouldOfferOnboarding } from "../../assets/js/onboarding.js";

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
