/**
 * Additional practice modes built on the same safety guarantees as the
 * question engine: normalized comparisons, no invented synonyms, deterministic
 * seeding for the Daily Challenge.
 *
 * Pure module - no DOM, no storage, RNG injectable.
 */

import { normalizeLabel } from "../utils/normalize.js";

/* -------------------------------------------------------------------------
 * Typed answer
 * ---------------------------------------------------------------------- */

/** Levenshtein distance with early exit above `max`. */
export function boundedLevenshtein(a, b, max = 2) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      current[j] = value;
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}

function typoTolerance(length) {
  if (length >= 8) return 2;
  if (length >= 5) return 1;
  return 0;
}

/**
 * Grade a typed answer against the item's recorded labels + alternatives.
 * Never accepts unrecorded synonyms; typo tolerance is length-based and
 * transparent (result reports whether fuzzy matching was used).
 */
export function checkTypedAnswer(input, item, { to = "indonesia", from = "batak" } = {}) {
  const given = normalizeLabel(input);
  if (!given) return { correct: false, fuzzy: false, expected: item[to] };
  const candidates = [
    normalizeLabel(item[to]),
    ...(to === "indonesia"
      ? item.indonesianAlternatives ?? []
      : item.batakAlternatives ?? []
    ).map(normalizeLabel),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate === given) return { correct: true, fuzzy: false, expected: item[to] };
  }
  for (const candidate of candidates) {
    if (!candidate) continue;
    const tolerance = typoTolerance(candidate.length);
    if (tolerance > 0 && boundedLevenshtein(given, candidate, tolerance) <= tolerance) {
      return { correct: true, fuzzy: true, expected: item[to] };
    }
  }
  // prompt-side match guard is irrelevant here; report failure honestly
  void from;
  return { correct: false, fuzzy: false, expected: item[to] };
}

/* -------------------------------------------------------------------------
 * True / False
 * ---------------------------------------------------------------------- */

function reservedFor(item, toKey) {
  const reserved = new Set([normalizeLabel(item.batak), normalizeLabel(item.indonesia)]);
  const alternatives =
    toKey === "indonesia" ? item.indonesianAlternatives ?? [] : item.batakAlternatives ?? [];
  for (const alternative of alternatives) reserved.add(normalizeLabel(alternative));
  return reserved;
}

/**
 * Build a True/False question. False statements pair the prompt with a label
 * that is provably NOT a recorded alternative of the item.
 */
export function buildTrueFalse(item, pool, { random = Math.random, to = "indonesia" } = {}) {
  const makeTrue = random() < 0.5;
  if (makeTrue || pool.length <= 1) {
    return { statement: `${item.batak} = ${item[to]}`, isTrueStatement: true, itemId: item.id };
  }
  const reserved = reservedFor(item, to);
  const wrongs = pool.filter(
    (candidate) =>
      candidate.id !== item.id &&
      !reserved.has(normalizeLabel(candidate[to])) &&
      normalizeLabel(candidate[to]) !== normalizeLabel(item[to]),
  );
  if (wrongs.length === 0) {
    return { statement: `${item.batak} = ${item[to]}`, isTrueStatement: true, itemId: item.id };
  }
  const wrong = wrongs[Math.floor(random() * wrongs.length)];
  return { statement: `${item.batak} = ${wrong[to]}`, isTrueStatement: false, itemId: item.id };
}

/* -------------------------------------------------------------------------
 * Memory game board
 * ---------------------------------------------------------------------- */

/** Build a shuffled memory board of `pairCount` Batak/Indonesia card pairs. */
export function buildMemoryBoard(pool, { pairCount = 6, random = Math.random } = {}) {
  const seenBatak = new Set();
  const chosen = [];
  for (const item of pool) {
    const key = normalizeLabel(item.batak);
    if (!key || seenBatak.has(key)) continue;
    seenBatak.add(key);
    chosen.push(item);
    if (chosen.length >= pairCount) break;
  }
  const cards = [];
  for (const item of chosen) {
    cards.push({ id: item.id, side: "batak", text: item.batak });
    cards.push({ id: item.id, side: "indonesia", text: item.indonesia });
  }
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [cards[index], cards[swap]] = [cards[swap], cards[index]];
  }
  return { cards, pairs: chosen.length };
}

/* -------------------------------------------------------------------------
 * Daily Challenge seeding
 * ---------------------------------------------------------------------- */

export function dailySeed(dateKey) {
  let hash = 2166136261;
  const input = String(dateKey);
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function todayDateKey(atMs = Date.now()) {
  const date = new Date(atMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
