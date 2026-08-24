/**
 * Progress schema v2 with migration, per-item review scheduling,
 * bounded storage, safe export/import, and localStorage-failure resilience.
 *
 * Storage layout:
 *   - "batakTobaPlay.progress.v2"  -> versioned v2 payload (current)
 *   - "batakTobaGameProgress"      -> legacy v1 payload (read once for migration)
 *
 * Review schedule (deterministic):
 *   stage 1 correct -> +1 day, then +3, +7, +14 days; mastered (+30 days).
 *   An incorrect answer resets the item to repeat-in-session semantics
 *   (stage 0, due immediately).
 */

const V2_KEY = "batakTobaPlay.progress.v2";
const LEGACY_KEY = "batakTobaGameProgress";

export const PROGRESS_SCHEMA_VERSION = 2;

const DAY_MS = 24 * 60 * 60 * 1000;
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30];

const MAX_TRACKED_ITEMS = 2000;
const MAX_SESSIONS = 30;

function nowMs() {
  return Date.now();
}

function emptyItemStats() {
  return {
    seen: 0,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    lastResult: null,
    lastReviewedAt: null,
    nextReviewAt: null,
    reviewStage: 0,
    bucket: null,
  };
}

export function createEmptyProgress() {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    answered: 0,
    correct: 0,
    lastMode: "meaning",
    items: {},
    sessions: [],
    migratedFromLegacy: false,
    migratedAt: null,
    savedAt: null,
  };
}

/* -------------------------------------------------------------------------
 * Safe storage layer: never throws when localStorage is unavailable.
 * ---------------------------------------------------------------------- */

const memoryFallback = new Map();

function storageGet(key) {
  try {
    if (typeof localStorage === "undefined") return memoryFallback.get(key) ?? null;
    return localStorage.getItem(key);
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

function storageSet(key, value) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return true;
    }
  } catch {
    // fall through to memory
  }
  memoryFallback.set(key, value);
  return true;
}

function storageRemove(key) {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  memoryFallback.delete(key);
}

/* -------------------------------------------------------------------------
 * Validation helpers (import safety)
 * ---------------------------------------------------------------------- */

function clampInt(value, min, max, fallback = min) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function sanitizeItemStats(raw) {
  if (!raw || typeof raw !== "object") return emptyItemStats();
  const stats = emptyItemStats();
  stats.seen = clampInt(raw.seen, 0, 1e9, 0);
  stats.correctCount = clampInt(raw.correctCount, 0, 1e9, 0);
  stats.incorrectCount = clampInt(raw.incorrectCount, 0, 1e9, 0);
  stats.consecutiveCorrect = clampInt(raw.consecutiveCorrect, 0, 1e9, 0);
  stats.lastResult = raw.lastResult === "correct" || raw.lastResult === "incorrect" ? raw.lastResult : null;
  stats.lastReviewedAt =
    typeof raw.lastReviewedAt === "number" && Number.isFinite(raw.lastReviewedAt)
      ? raw.lastReviewedAt
      : null;
  stats.nextReviewAt =
    typeof raw.nextReviewAt === "number" && Number.isFinite(raw.nextReviewAt)
      ? raw.nextReviewAt
      : null;
  stats.reviewStage = clampInt(raw.reviewStage, 0, REVIEW_INTERVAL_DAYS.length, 0);
  stats.bucket =
    raw.bucket === "known" ||
    raw.bucket === "review" ||
    raw.bucket === "difficult" ||
    raw.bucket === "saved"
      ? raw.bucket
      : null;
  return stats;
}

export function validateProgressPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.schemaVersion !== PROGRESS_SCHEMA_VERSION) return null;
  const progress = createEmptyProgress();
  progress.answered = clampInt(payload.answered, 0, 1e9, 0);
  progress.correct = clampInt(payload.correct, 0, 1e9, 0);
  progress.lastMode = typeof payload.lastMode === "string" ? payload.lastMode.slice(0, 40) : "meaning";
  progress.migratedFromLegacy = Boolean(payload.migratedFromLegacy);
  progress.migratedAt =
    typeof payload.migratedAt === "number" && Number.isFinite(payload.migratedAt)
      ? payload.migratedAt
      : null;
  if (Array.isArray(payload.sessions)) {
    progress.sessions = payload.sessions
      .filter((session) => session && typeof session === "object")
      .slice(-MAX_SESSIONS);
  }
  if (payload.items && typeof payload.items === "object") {
    for (const [id, raw] of Object.entries(payload.items).slice(0, MAX_TRACKED_ITEMS)) {
      if (!/^[a-z]+-[0-9a-f]{10}$/.test(id)) continue; // only stable ids accepted
      progress.items[id] = sanitizeItemStats(raw);
    }
  }
  return progress;
}

/* -------------------------------------------------------------------------
 * Migration from legacy v1
 * ---------------------------------------------------------------------- */

/**
 * Pure migration: legacy v1 payload + optional id map -> v2 payload.
 * Legacy ids that cannot be mapped keep their original id so no data is
 * silently dropped.
 */
export function migrateLegacyProgress(legacy, idMap = {}) {
  const progress = createEmptyProgress();
  progress.migratedFromLegacy = true;
  progress.migratedAt = nowMs();
  if (!legacy || typeof legacy !== "object") return progress;

  progress.answered = clampInt(legacy.answered, 0, 1e9, 0);
  progress.correct = clampInt(legacy.correct, 0, 1e9, 0);
  progress.lastMode = typeof legacy.lastMode === "string" ? legacy.lastMode : "meaning";

  function remap(id) {
    return idMap[id] ?? id;
  }

  for (const bucketValue of ["known", "review"]) {
    const list = Array.isArray(legacy[bucketValue]) ? legacy[bucketValue] : [];
    for (const rawId of list) {
      if (typeof rawId !== "string" || !rawId) continue;
      const id = remap(rawId);
      const stats = progress.items[id] ?? emptyItemStats();
      stats.bucket = bucketValue;
      if (bucketValue === "known") {
        // treat previously known words as mastered-ish for review purposes
        stats.seen = Math.max(stats.seen, 1);
        stats.correctCount = Math.max(stats.correctCount, 1);
        stats.consecutiveCorrect = Math.max(stats.consecutiveCorrect, 1);
        stats.reviewStage = Math.max(stats.reviewStage, 3);
        stats.lastResult = "correct";
      } else {
        stats.seen = Math.max(stats.seen, 1);
        stats.reviewStage = Math.max(stats.reviewStage, 0);
      }
      progress.items[id] = stats;
    }
  }
  return progress;
}

function loadIdMap() {
  try {
    const response = fetch(new URL("../../data/migration/id-map.json", import.meta.url));
    // synchronous consumers cannot await; cache the promise result when ready
    return Promise.resolve(response)
      .then((res) => (res.ok ? res.json() : {}))
      .then((payload) => payload.mappings ?? {})
      .catch(() => ({}));
  } catch {
    return Promise.resolve({});
  }
}

let idMapPromise = null;

function getIdMap() {
  if (!idMapPromise) idMapPromise = loadIdMap();
  return idMapPromise;
}

/* -------------------------------------------------------------------------
 * Persistence
 * ---------------------------------------------------------------------- */

function persist(progress) {
  progress.savedAt = nowMs();
  storageSet(V2_KEY, JSON.stringify(progress));
}

function parseStoredV2(raw) {
  try {
    return validateProgressPayload(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Corrupted v2 payloads are backed up instead of overwritten blindly. */
function quarantineCorrupted(raw) {
  if (!raw) return;
  try {
    storageSet(`${V2_KEY}.corrupt-backup`, raw);
  } catch {
    /* ignore */
  }
}

async function ensureMigrated() {
  let stored = storageGet(V2_KEY);
  let progress = parseStoredV2(stored);
  if (!progress && stored) {
    quarantineCorrupted(stored);
  }
  if (progress) return progress;

  const legacyRaw = storageGet(LEGACY_KEY);
  if (!legacyRaw) return createEmptyProgress();

  let legacy = null;
  try {
    legacy = JSON.parse(legacyRaw);
  } catch {
    return createEmptyProgress();
  }
  const idMap = await getIdMap();
  progress = migrateLegacyProgress(legacy, idMap);
  persist(progress);
  return progress;
}

let cached = null;
let hydration = null;

function hydrateSync() {
  // Fast path used by sync APIs: read whatever is persisted right now.
  if (cached) return cached;
  const stored = storageGet(V2_KEY);
  cached = parseStoredV2(stored) ?? createEmptyProgress();
  return cached;
}

/** Awaitable init so async flows can guarantee legacy migration ran. */
export async function initProgress() {
  if (!hydration) {
    hydration = ensureMigrated().then((progress) => {
      cached = progress;
      persist(progress); // write migrated state back once
      return progress;
    });
  }
  return hydration;
}

export function getProgress() {
  return hydrateSync();
}

export function saveProgress(partial = {}) {
  const current = hydrateSync();
  const next = { ...current };
  for (const [key, value] of Object.entries(partial)) {
    if (key === "items" || key === "schemaVersion") continue;
    next[key] = value;
  }
  cached = next;
  persist(next);
  return next;
}

/* -------------------------------------------------------------------------
 * Recording answers and review scheduling
 * ---------------------------------------------------------------------- */

export function nextReviewDelayDays(stage) {
  // stage 1 -> INTERVALS[0], ..., stage 5 (mastered) -> INTERVALS[4]
  const index = clampInt(stage, 1, REVIEW_INTERVAL_DAYS.length, 1) - 1;
  return REVIEW_INTERVAL_DAYS[index];
}

function updateItemStats(items, itemId, isCorrect, timestamp) {
  const stats = items[itemId] ?? emptyItemStats();
  stats.seen += 1;
  stats.lastReviewedAt = timestamp;
  stats.lastResult = isCorrect ? "correct" : "incorrect";
  if (isCorrect) {
    stats.correctCount += 1;
    stats.consecutiveCorrect += 1;
    if (stats.bucket !== "difficult") {
      stats.reviewStage = Math.min(stats.reviewStage + 1, REVIEW_INTERVAL_DAYS.length);
    }
    stats.nextReviewAt =
      timestamp + nextReviewDelayDays(Math.max(stats.reviewStage, 1)) * DAY_MS;
  } else {
    stats.incorrectCount += 1;
    stats.consecutiveCorrect = 0;
    stats.reviewStage = 0; // repeat soon / in session
    stats.bucket = "review";
    stats.nextReviewAt = timestamp; // due immediately
  }
  items[itemId] = stats;
  return stats;
}

/**
 * Record a single answer. `itemId` optional for modes without stable ids.
 */
export function recordAnswer(isCorrect, mode, itemId = null) {
  const current = hydrateSync();
  const timestamp = nowMs();
  const next = { ...current, items: { ...current.items } };
  next.answered = current.answered + 1;
  next.correct = current.correct + (isCorrect ? 1 : 0);
  next.lastMode = mode ?? current.lastMode;
  if (itemId) {
    updateItemStats(next.items, itemId, isCorrect, timestamp);
    enforceBoundedStorage(next.items);
  }
  cached = next;
  persist(next);
}

function enforceBoundedStorage(items) {
  const ids = Object.keys(items);
  if (ids.length <= MAX_TRACKED_ITEMS) return;
  const sorted = ids.sort(
    (a, b) => (items[a].lastReviewedAt ?? 0) - (items[b].lastReviewedAt ?? 0),
  );
  for (const id of sorted.slice(0, ids.length - MAX_TRACKED_ITEMS)) {
    delete items[id];
  }
}

export function getItemStats(itemId) {
  return getProgress().items[itemId] ?? emptyItemStats();
}

export function markFlashcard(id, bucket) {
  if (!id || !["known", "review", "difficult", "saved"].includes(bucket)) return;
  const current = hydrateSync();
  const timestamp = nowMs();
  const next = { ...current, items: { ...current.items } };
  const stats = updateItemStats(next.items, id, bucket === "known", timestamp);
  if (bucket === "saved") {
    // saving marks intent to study later, not a correct/incorrect answer
    stats.seen = Math.max(stats.seen - 1, 0);
    stats.bucket = "saved";
    stats.nextReviewAt = timestamp;
  } else {
    if (bucket === "known") stats.nextReviewAt = timestamp + 30 * DAY_MS;
    else if (bucket === "review") stats.nextReviewAt = timestamp;
  }
  enforceBoundedStorage(next.items);
  cached = next;
  persist(next);
}

/** Items whose nextReviewAt has passed (or never been scheduled). */
export function getDueItems(pool, atMs = nowMs()) {
  const { items } = getProgress();
  return pool.filter((item) => {
    const stats = items[item.id];
    if (!stats) return false;
    return stats.nextReviewAt === null || stats.nextReviewAt <= atMs;
  });
}

/* -------------------------------------------------------------------------
 * Export / import / reset
 * ---------------------------------------------------------------------- */

export function exportProgress() {
  return JSON.stringify(hydrateSync(), null, 2);
}

export function importProgress(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }
  const validated = validateProgressPayload(parsed);
  if (!validated) {
    return { ok: false, reason: "unsupported-schema" };
  }
  cached = validated;
  persist(validated);
  return { ok: true, progress: validated };
}

export function resetProgress() {
  const fresh = createEmptyProgress();
  cached = fresh;
  persist(fresh);
  storageRemove(`${V2_KEY}.corrupt-backup`);
  return fresh;
}
