/**
 * Lesson engine (pure). Builds a full learning plan for a PUBLISHED lesson:
 * intro -> recognition -> recall -> mistake review -> summary.
 * Synthetic fixtures for this module live only under tests/fixtures/.
 */

import { normalizeLabel } from "../utils/normalize.js";

/** Deterministic next-published-lesson recommendation. */
export function recommendNext(registry, currentSlug) {
  const published = registry?.published ?? [];
  return published.find((lesson) => lesson.slug !== currentSlug)?.slug ?? null;
}

/**
 * Build the ordered step list for a lesson.
 * items: lesson pool items (already resolved objects).
 * distractorPool: larger pool used to build recognition options.
 */
export function buildLessonPlan(lesson, items, distractorPool, makeQuestionFn, { random = Math.random } = {}) {
  const steps = [{ type: "intro", title: lesson.title, objective: lesson.description }];
  const recognition = [];
  for (const item of items) {
    const question = makeQuestionFn(item, distractorPool.length >= 4 ? distractorPool : items, {
      random,
      from: "batak",
      to: "indonesia",
    });
    if (question && question.options.length >= 2) recognition.push(question);
  }
  steps.push({ type: "recognition", questions: recognition });

  const recall = items
    .filter((item) => normalizeLabel(item.batak) && normalizeLabel(item.indonesia))
    .map((item) => ({ itemId: item.id, prompt: item.batak, expected: item.indonesia }));
  steps.push({ type: "recall", prompts: recall });

  steps.push({ type: "mistake-review", itemIds: [] }); // filled at runtime
  steps.push({ type: "summary" });
  return steps;
}

/** Aggregate mistakes across phases into review ids (unique, ordered). */
export function collectMistakes(mistakeLog) {
  const seen = new Set();
  const ordered = [];
  for (const id of mistakeLog) {
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push(id);
    }
  }
  return ordered;
}
