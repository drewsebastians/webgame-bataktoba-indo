/**
 * Optional local-only onboarding (blueprint section 8).
 * No personal information; used only for recommendations.
 */

const KEY = "batakTobaPlay.onboarding";
export const ONBOARDING_VERSION = 1;

const FAMILIARITY = ["belum", "beberapa-kata", "sedikit", "review"];
const GOALS = ["keluarga", "percakapan", "kosakata-umum", "budaya", "santai"];
const DURATIONS = [3, 5, 10];

function read() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== ONBOARDING_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getOnboarding() {
  return read();
}

export function saveOnboarding({ familiarity, goal, durationMinutes, skipped = false }) {
  const payload = {
    version: ONBOARDING_VERSION,
    familiarity: FAMILIARITY.includes(familiarity) ? familiarity : null,
    goal: GOALS.includes(goal) ? goal : null,
    durationMinutes: DURATIONS.includes(durationMinutes) ? durationMinutes : 5,
    skipped: Boolean(skipped),
    completedAt: Date.now(),
  };
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable: onboarding simply won't persist */
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

/** True when we should offer onboarding (never asked + no meaningful history). */
export function shouldOfferOnboarding(progressState) {
  if (read()) return false;
  const answered = progressState?.answered ?? 0;
  const sessions = progressState?.sessions ?? [];
  return answered === 0 && sessions.length === 0;
}
