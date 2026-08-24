/**
 * Analytics foundation: provider-neutral, disabled by default, consent-aware.
 *
 * Guarantees:
 *  - nothing is sent while SITE_CONFIG.features.analytics is false OR the
 *    user has not granted consent;
 *  - unknown event names are rejected;
 *  - props containing prohibited keys (PII / raw content) are rejected;
 *  - values are length-capped and primitive-only.
 *
 * The actual provider function is injected; none ships with this module.
 */

import { SITE_CONFIG } from "./config.js";

const CONSENT_KEY = "batakTobaPlay.consent.analytics";

const ALLOWED_EVENTS = new Set([
  "lesson_view",
  "lesson_start",
  "lesson_complete",
  "game_start",
  "question_answered",
  "answer_correct",
  "answer_incorrect",
  "session_complete",
  "mistake_review_start",
  "mistake_review_complete",
  "daily_practice_complete",
  "dictionary_search",
  "dictionary_no_result",
  "word_saved",
  "correction_opened",
  "progress_exported",
  "pwa_installed",
  "offline_session",
]);

const PROHIBITED_KEYS = new Set([
  "name",
  "email",
  "query",
  "search",
  "text",
  "body",
  "message",
  "progressfile",
  "items",
  "userid",
  "user_id",
  "identifier",
]);

function readConsent() {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

let provider = null;

export function isAnalyticsEnabled() {
  return Boolean(SITE_CONFIG.features.analytics);
}

export function hasConsent() {
  return readConsent();
}

export function grantAnalyticsConsent() {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(CONSENT_KEY, "granted");
  } catch {
    /* storage unavailable: consent cannot persist */
  }
}

export function revokeAnalyticsConsent() {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Register a delivery function. Only succeeds when the feature flag is on.
 * Signature: provider({ event, props }) - must not throw.
 */
export function setAnalyticsProvider(fn) {
  if (!isAnalyticsEnabled()) return { ok: false, reason: "feature-disabled" };
  if (typeof fn !== "function") return { ok: false, reason: "invalid-provider" };
  provider = fn;
  return { ok: true };
}

/** Pure decision helper (unit-testable without touching flags). */
export function evaluateEvent(event, props = {}) {
  if (!ALLOWED_EVENTS.has(event)) {
    return { ok: false, reason: "unknown-event" };
  }
  if (props === null || typeof props !== "object" || Array.isArray(props)) {
    return { ok: false, reason: "invalid-props" };
  }
  const clean = {};
  for (const [key, value] of Object.entries(props)) {
    if (PROHIBITED_KEYS.has(key.toLowerCase())) {
      return { ok: false, reason: "prohibited-field", field: key };
    }
    if (value !== null && typeof value === "object") {
      return { ok: false, reason: "non-primitive-value", field: key };
    }
    const stringValue = String(value ?? "");
    if (stringValue.length > 120) {
      return { ok: false, reason: "value-too-long", field: key };
    }
    clean[key] = value;
  }
  if (Object.keys(clean).length > 8) {
    return { ok: false, reason: "too-many-fields" };
  }
  return { ok: true, event, props: clean };
}

export function track(event, props) {
  if (!isAnalyticsEnabled()) return { sent: false, reason: "feature-disabled" };
  if (!readConsent()) return { sent: false, reason: "no-consent" };
  const decision = evaluateEvent(event, props ?? {});
  if (!decision.ok) return { sent: false, reason: decision.reason };
  if (provider) {
    try {
      provider({ event: decision.event, props: decision.props });
    } catch {
      /* a broken analytics provider must never break the product */
    }
  }
  return { sent: true };
}
