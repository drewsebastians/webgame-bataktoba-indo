/**
 * Optional local-only session preference.
 * Stores only the default number of practice prompts; no personal profile.
 */

const KEY = "batakTobaPlay.onboarding";
export const ONBOARDING_VERSION = 2;

const SESSION_SIZES = [5, 10, 20];
const LEGACY_DURATION_TO_SIZE = new Map([[3, 5], [5, 10], [10, 20]]);

function normalizeStored(parsed) {
  if (parsed?.version === ONBOARDING_VERSION) {
    if (!SESSION_SIZES.includes(parsed.sessionSize)) return null;
    return {
      version: ONBOARDING_VERSION,
      sessionSize: parsed.sessionSize,
      skipped: Boolean(parsed.skipped),
      completedAt: Number.isSafeInteger(parsed.completedAt) && parsed.completedAt >= 0
        ? parsed.completedAt
        : Date.now(),
    };
  }

  // Migrate v1's approximate minute preference to a nearby prompt count.
  // This is a default length only; it does not create a timed session.
  if (parsed?.version === 1 && LEGACY_DURATION_TO_SIZE.has(parsed.durationMinutes)) {
    return {
      version: ONBOARDING_VERSION,
      sessionSize: LEGACY_DURATION_TO_SIZE.get(parsed.durationMinutes),
      skipped: Boolean(parsed.skipped),
      completedAt: Number.isSafeInteger(parsed.completedAt) && parsed.completedAt >= 0
        ? parsed.completedAt
        : Date.now(),
    };
  }
  return null;
}

function read() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const normalized = normalizeStored(parsed);
    if (!normalized) return null;
    if (parsed?.version !== ONBOARDING_VERSION) {
      try {
        localStorage.setItem(KEY, JSON.stringify(normalized));
      } catch {
        /* keep the migrated value in memory when storage is unavailable */
      }
    }
    return normalized;
  } catch {
    return null;
  }
}

export function getOnboarding() {
  return read();
}

export function saveOnboarding({ sessionSize = 10, skipped = false } = {}) {
  const payload = {
    version: ONBOARDING_VERSION,
    sessionSize: SESSION_SIZES.includes(sessionSize) ? sessionSize : 10,
    skipped: Boolean(skipped),
    completedAt: Date.now(),
  };
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable: preference simply won't persist */
  }
  return payload;
}

export function resetOnboarding() {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** True when a learner has started or completed a lesson. */
export function hasLessonHistory(progressState) {
  const lessons = progressState?.lessons;
  if (!lessons || typeof lessons !== "object" || Array.isArray(lessons)) return false;
  return Object.values(lessons).some((lesson) =>
    Boolean(lesson && (lesson.startedAt || lesson.completedAt)),
  );
}

/** True when we should offer onboarding (never asked + no meaningful history). */
export function shouldOfferOnboarding(progressState) {
  if (read()) return false;
  const answered = progressState?.answered ?? 0;
  const sessions = progressState?.sessions ?? [];
  return answered === 0 && sessions.length === 0 && !hasLessonHistory(progressState);
}
