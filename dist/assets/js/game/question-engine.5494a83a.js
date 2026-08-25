/**
 * Pure quiz question engine.
 *
 * Guarantees (unit-tested):
 *  - every option has a UNIQUE visible (normalized) label;
 *  - exactly ONE option is correct;
 *  - distractors never collide with the answer's recorded alternatives;
 *  - questions do not repeat until the whole pool has been seen, and the
 *    first question of a new cycle is never the last question answered;
 *  - a question can only be answered once (rapid-click guard);
 *  - small pools degrade to fewer options instead of producing ambiguity;
 *  - empty pools produce an explicit error state, never a broken question.
 *
 * Pure module: no DOM, no storage, RNG injectable for deterministic tests.
 */

import { normalizeLabel } from "../utils/normalize.9471d62c.js";

const DEFAULT_OPTION_COUNT = 4;

function seededFallbackShuffle(copy, random) {
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function shuffleWith(items, random = Math.random) {
  return seededFallbackShuffle([...items], random);
}

function reservedLabels(item, fromKey, toKey) {
  const reserved = new Set();
  const answer = normalizeLabel(item[toKey]);
  if (answer) reserved.add(answer);
  // Alternatives recorded on either side would make a distractor ambiguous.
  const toAlternatives =
    toKey === "indonesia"
      ? item.indonesianAlternatives ?? []
      : item.batakAlternatives ?? [];
  for (const alternative of toAlternatives) {
    const normalized = normalizeLabel(alternative);
    if (normalized) reserved.add(normalized);
  }
  const prompt = normalizeLabel(item[fromKey]);
  if (prompt) reserved.add(prompt);
  return reserved;
}

/**
 * Build one question for `item` out of `pool`.
 * Returns null when no usable distractor exists.
 */
export function makeQuestion(
  item,
  pool,
  { from = "batak", to = "indonesia", optionCount = DEFAULT_OPTION_COUNT, random = Math.random } = {},
) {
  if (!item || !Array.isArray(pool) || pool.length === 0) {
    return null;
  }

  const reserved = reservedLabels(item, from, to);
  const seenLabels = new Set(reserved);

  const distractors = [];
  for (const candidate of pool) {
    if (candidate.id === item.id) continue;
    const label = normalizeLabel(candidate[to]);
    if (!label || seenLabels.has(label)) continue;
    seenLabels.add(label);
    distractors.push(candidate);
    if (distractors.length >= optionCount - 1) break;
  }

  if (distractors.length === 0 && pool.length > 1) {
    // Pool exists but every other candidate collides visually: refuse to
    // present an impossible-looking single-option question.
    return null;
  }

  const options = shuffleWith([item, ...distractors], random).map((candidate) => ({
    id: candidate.id,
    label: candidate[to],
    isCorrect: candidate.id === item.id,
  }));

  const correctCount = options.filter((option) => option.isCorrect).length;
  if (correctCount !== 1) {
    return null;
  }

  return {
    prompt: item[from],
    sourceFlag: item.sourceType || item.sourceFlag || null,
    quality: item.quality || null,
    reviewStatus: item.reviewStatus || null,
    itemId: item.id,
    options,
  };
}

/**
 * Cycle-safe question queue: shuffles the pool; when exhausted it reshuffles
 * while ensuring the first question of the new cycle differs from the last
 * one served (when the pool allows it).
 */
export class QuestionQueue {
  constructor(pool, { random = Math.random, lastServedId = null, initialIds = null } = {}) {
    this.pool = Array.isArray(pool) ? [...pool] : [];
    this.random = random;
    this.lastServedId = lastServedId;
    if (Array.isArray(initialIds)) {
      const poolIds = new Set(this.pool.map((item) => item.id));
      this.currentCycle = initialIds.filter((id) => poolIds.has(id));
    } else {
      this.currentCycle = [];
    }
  }

  refill() {
    let order = shuffleWith(this.pool, this.random);
    if (this.pool.length > 1 && this.lastServedId) {
      const lastIndex = order.findIndex((item) => item.id === this.lastServedId);
      if (lastIndex === 0) {
        const swapIndex = 1 + Math.floor(this.random() * (order.length - 1));
        [order[0], order[swapIndex]] = [order[swapIndex], order[0]];
      }
    }
    this.currentCycle = order.map((item) => item.id);
  }

  next() {
    if (this.pool.length === 0) return null;
    if (this.currentCycle.length === 0) this.refill();
    const id = this.currentCycle.shift();
    this.lastServedId = id;
    return this.pool.find((item) => item.id === id) ?? null;
  }
}

/**
 * Stateful quiz runner used by the games page.
 */
export function createQuizRunner({
  pool,
  from,
  to,
  optionCount = DEFAULT_OPTION_COUNT,
  random = Math.random,
  initialIds = null,
} = {}) {
  const queue = new QuestionQueue(pool, { random, initialIds });
  let current = null;
  let locked = false;

  function nextQuestion() {
    const item = queue.next();
    if (!item) {
      current = null;
      return { error: "empty-pool" };
    }
    const question = makeQuestion(item, pool, { from, to, optionCount, random });
    if (!question) {
      // Colliding pool for this item: skip to the next usable item instead of
      // showing a broken question.
      return nextQuestionGuarded();
    }
    current = question;
    locked = false;
    return { question };
  }

  function nextQuestionGuarded(depth = 0) {
    if (depth >= Math.max(1, pool.length)) {
      current = null;
      return { error: "no-usable-items" };
    }
    const item = queue.next();
    if (!item) {
      current = null;
      return { error: "empty-pool" };
    }
    const question = makeQuestion(item, pool, { from, to, optionCount, random });
    if (!question) return nextQuestionGuarded(depth + 1);
    current = question;
    locked = false;
    return { question };
  }

  function answer(optionId) {
    if (!current || locked) {
      return { accepted: false, reason: "locked-or-empty" };
    }
    locked = true;
    const option = current.options.find((candidate) => candidate.id === optionId);
    const isCorrect = Boolean(option?.isCorrect);
    return {
      accepted: true,
      isCorrect,
      correctOptionId: current.options.find((candidate) => candidate.isCorrect)?.id ?? null,
      itemId: current.itemId,
    };
  }

  return {
    nextQuestion,
    answer,
    getCurrent: () => current,
    isLocked: () => locked,
    getPoolSize: () => (Array.isArray(pool) ? pool.length : 0),
  };
}
