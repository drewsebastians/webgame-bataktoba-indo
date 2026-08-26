/**
 * Central site configuration.
 * Single source of truth for URLs, feature flags, and dataset locations.
 * Feature flags default to false: analytics and ads must never activate
 * without an explicit, reviewed configuration change.
 */

export const SITE_CONFIG = Object.freeze({
  name: "Batak Toba Play",
  baseUrl: "https://webgame-bataktoba-indo.pages.dev/",
  repositoryIssuesUrl: "https://github.com/drewsebastians/webgame-bataktoba-indo/issues/new",
  dataDir: "../../data/published/",
  adsensePublisherId: "",
  features: Object.freeze({
    analytics: false,
    ads: false,
    pwa: true,
  }),
});

export const MIN_LESSON_POOL_ITEMS = 8;

export const PRACTICE_MODES = Object.freeze(["meaning", "reverse", "typed", "truefalse", "matching", "memory", "daily", "sentence"]);

export function absoluteUrl(path = "") {
  return new URL(path, SITE_CONFIG.baseUrl).toString();
}
