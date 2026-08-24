import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

const { track, evaluateEvent, setAnalyticsProvider, isAnalyticsEnabled, grantAnalyticsConsent } =
  await import(`../../assets/js/analytics.js?ts=${Date.now()}`);

describe("analytics foundation", () => {
  it("is disabled by default and sends nothing", () => {
    assert.equal(isAnalyticsEnabled(), false);
    let called = 0;
    const result = setAnalyticsProvider(() => {
      called += 1;
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, "feature-disabled");
    const outcome = track("session_complete", { mode: "meaning" });
    assert.equal(outcome.sent, false);
    assert.equal(called, 0);
  });

  describe("evaluateEvent (pure validation)", () => {
    it("accepts known blueprint events with primitive props", () => {
      const decision = evaluateEvent("session_complete", { mode: "meaning", answered: "10" });
      assert.ok(decision.ok);
      assert.equal(decision.event, "session_complete");
    });

    it("rejects unknown events", () => {
      assert.equal(evaluateEvent("page_view", {}).ok, false);
      assert.equal(evaluateEvent("made_up_event", {}).reason, "unknown-event");
    });

    it("rejects prohibited PII-ish fields", () => {
      for (const key of ["name", "email", "query", "text", "user_id"]) {
        const decision = evaluateEvent("dictionary_search", { [key]: "x" });
        assert.equal(decision.reason, "prohibited-field");
      }
    });

    it("rejects non-primitive values and oversized values", () => {
      assert.equal(evaluateEvent("word_saved", { nested: {} }).reason, "non-primitive-value");
      assert.equal(
        evaluateEvent("word_saved", { id: "x".repeat(200) }).reason,
        "value-too-long",
      );
      assert.equal(evaluateEvent("game_start", null).reason, "invalid-props");
    });
  });
});
