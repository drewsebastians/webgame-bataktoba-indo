/**
 * Session engine: pure helpers for bounded practice sessions,
 * daily-practice prioritization, and summaries.
 *
 * Priority order for daily practice (blueprint 12.4):
 *   1. items currently due for review
 *   2. items most often answered incorrectly
 *   3. items answered incorrectly recently
 *   4. unseen items
 *
 * Streak rule: a day counts when at least one completed session had >= 5
 * answers (a "meaningful session"). Missing one day keeps the streak;
 * two consecutive missed days break it (non-punishing by design).
 */

import { normalizeLabel } from "../utils/normalize.9471d62c.js";

export const SESSION_SIZES = [5, 10, 20];

function todayKey(atMs = Date.now()) {
  const date = new Date(atMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Build an ordered practice queue from a pool plus per-item stats.
 * statsById: Map<string, itemStats-like> or plain object.
 */
export function buildDailyQueue(pool, statsById, { size = 10, now = Date.now(), random = Math.random } = {}) {
  const statsFor = (id) => statsById?.[id] ?? null;

  function bucketOf(item) {
    const stats = statsFor(item.id);
    if (!stats || (!stats.seen && stats.nextReviewAt == null)) return 4; // new
    if (stats.nextReviewAt != null && stats.nextReviewAt <= now) return 1; // due
    if ((stats.incorrectCount ?? 0) >= 3) return 2; // often wrong
    if (stats.lastResult === "incorrect") return 3; // recently wrong
    return 5; // known / not due
  }

  const scored = pool.map((item) => ({ item, bucket: bucketOf(item) }));
  const groups = new Map();
  for (const entry of scored) {
    if (!groups.has(entry.bucket)) groups.set(entry.bucket, []);
    groups.get(entry.bucket).push(entry.item);
  }

  const ordered = [];
  for (const bucket of [1, 2, 3, 4, 5].sort((a, b) => a - b)) {
    const group = groups.get(bucket) ?? [];
    ordered.push(...shuffle(group, random));
  }

  // Never include duplicate visible prompts within one session.
  const seenPrompts = new Set();
  const uniquePrompts = [];
  for (const item of ordered) {
    const promptKey = `${normalizeLabel(item.batak)}\u0000${normalizeLabel(item.indonesia)}`;
    if (seenPrompts.has(promptKey)) continue;
    seenPrompts.add(promptKey);
    uniquePrompts.push(item);
  }

  return uniquePrompts.slice(0, size);
}

function shuffle(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

/** Pure summary computation from accepted answers. */
export function summarizeSession(answers) {
  const answered = answers.length;
  const correct = answers.filter((entry) => entry.isCorrect).length;
  const incorrect = answered - correct;
  const accuracy = answered === 0 ? null : Math.round((100 * correct) / answered);
  const mistakeIds = [...new Set(answers.filter((entry) => !entry.isCorrect).map((entry) => entry.itemId))];
  const strongIds = [
    ...new Set(
      answers.filter((entry) => entry.isCorrect && entry.wasWeakBefore).map((entry) => entry.itemId),
    ),
  ];
  const newItemIds = [...new Set(answers.filter((entry) => entry.isNew).map((entry) => entry.itemId))];
  return {
    answered,
    correct,
    incorrect,
    accuracy,
    mistakeIds,
    strongIds,
    newItemIds,
    isMeaningful: answered >= 5,
  };
}

/** Non-punishing streak: a single missed day does not break it. */
export function computeStreak(sessionDates, todayMs = Date.now()) {
  if (!Array.isArray(sessionDates) || sessionDates.length === 0) return 0;
  const meaningfulDays = new Set(sessionDates);
  let streak = 0;
  let missesLeft = 1;
  const cursor = new Date(todayMs);
  for (let guard = 0; guard < 400; guard += 1) {
    if (meaningfulDays.has(todayKey(cursor.getTime()))) {
      streak += 1;
      missesLeft = 1;
    } else {
      if (missesLeft === 0) break;
      missesLeft -= 1;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Derive a human-readable mastery label from per-item stats. */
export function masteryLabel(itemStats) {
  const stats = itemStats ?? {};
  if (!stats.seen) return "baru";
  if (stats.bucket === "difficult" || stats.lastResult === "incorrect") return "perlu-review";
  const stage = stats.reviewStage ?? 0;
  if (stage >= 5) return "dikuasai";
  if (stage >= 4) return "hampir-dikuasai";
  if (stage >= 2) return "berkembang";
  return "sedang-dipelajari";
}
