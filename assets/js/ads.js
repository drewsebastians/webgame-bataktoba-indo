/**
 * Ad component - disabled by default and inert until ALL of these hold:
 *   1. SITE_CONFIG.features.ads === true
 *   2. SITE_CONFIG.adsensePublisherId matches the ca-pub-XXXXXXXXXXXXXXXX format
 *   3. the user granted ad consent (consent state lives in localStorage)
 *
 * While inactive, any stray [data-ad-position] placeholder is removed from
 * the DOM so visitors never see "empty ad space" scaffolding.
 * No script is loaded, no network request is made, no auto-refresh exists.
 */

import { SITE_CONFIG } from "./config.js";

const ADSENSE_PUBLISHER_RE = /^ca-pub-\d{16}$/;
const CONSENT_KEY = "batakTobaPlay.consent.ads";

function hasValidPublisherId() {
  return ADSENSE_PUBLISHER_RE.test(SITE_CONFIG.adsensePublisherId ?? "");
}

export function readAdsConsent() {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function grantAdsConsent() {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(CONSENT_KEY, "granted");
  } catch {
    /* ignore */
  }
}

export function revokeAdsConsent() {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
}

export function adsActive() {
  return Boolean(
    SITE_CONFIG.features.ads && hasValidPublisherId() && readAdsConsent(),
  );
}

/** Placement allowlist: ads may only ever mount inside these zones. */
export const ALLOWED_PLACEMENTS = new Set([
  "home-after-content",
  "lesson-complete",
  "session-summary",
  "editorial-footer",
]);

/**
 * Mount a reserved-size slot at `container` for an allowed position.
 * Returns null unless ads are fully active; removes empty containers so no
 * blank boxes or "Ruang iklan" placeholders ever appear.
 */
export function mountAd(container, { placement = null, format = "auto" } = {}) {
  if (!container) return null;
  if (!adsActive()) {
    container.remove();
    return null;
  }
  if (!placement || !ALLOWED_PLACEMENTS.has(placement)) {
    container.remove();
    return null;
  }
  const slot = document.createElement("ins");
  slot.className = "adsbygoogle";
  slot.style.display = "block";
  slot.dataset.adClient = SITE_CONFIG.adsensePublisherId;
  slot.dataset.adFormat = format;
  container.append(slot);
  loadAdSenseScript();
  (window.adsbygoogle = window.adsbygoogle || []).push({});
  return slot;
}

let scriptRequested = false;

/** Loads the official AdSense script exactly once, only when fully active. */
export function loadAdSenseScript() {
  if (!adsActive()) return false;
  if (scriptRequested) return true;
  scriptRequested = true;
  const script = document.createElement("script");
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.adsensePublisherId}`;
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.append(script);
  return true;
}

/** Safety sweep for pages that still carry server-rendered placeholders. */
export function sweepPlaceholders(root = document) {
  if (adsActive()) return;
  root.querySelectorAll("[data-ad-position]").forEach((node) => node.remove());
}
