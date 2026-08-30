import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../../", import.meta.url)));

export function loadJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

export function loadTopics() {
  return loadJson("data/published/topics.json");
}
export function loadLessons() {
  return loadJson("data/published/lessons.json");
}
export function loadPublishedWords() {
  return loadJson("data/published/word-pairs.json");
}
export function loadCandidates() {
  try {
    return loadJson("data/candidates/word-pairs.json");
  } catch {
    return { items: [] };
  }
}
export function loadLessonDrafts() {
  try {
    return loadJson("data/candidates/lesson-drafts.json");
  } catch {
    return { supplements: [] };
  }
}
export function loadReviewedOverrides() {
  const p = join(root, "data/reviewed/overrides.json");
  if (!existsSync(p)) return { overrides: [] };
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return { overrides: [] };
  }
}

export const MIN_LESSON = 8;

export function lessonGapReport() {
  const topics = loadTopics().topics;
  const lessons = loadLessons();
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  const report = [];
  for (const [slug, def] of Object.entries(loadJson("content/lessons.json").lessons)) {
    const topic = bySlug.get(slug);
    const pool = topic ? topic.poolItems : 0;
    const need = Math.max(0, MIN_LESSON - pool);
    const draftSup = loadLessonDrafts().supplements.filter((s) => s.lessonSlug === slug).length;
    report.push({
      lessonId: `lesson-${slug}`,
      slug,
      title: def.title,
      candidateItemCount: pool + draftSup,
      validItemIds: topic ? topic.itemIds : [],
      humanReviewed: 0,
      corpusDerived: pool,
      blocked: need,
      duplicate: 0,
      threshold: MIN_LESSON,
      stillRequired: need,
      unlockItemIds: need > 0 ? (topic ? topic.itemIds.slice(0, need) : []) : [],
      reviewRollup: topic ? topic.reviewRollup : "corpus-derived-beta",
      technicalBlockers: pool >= MIN_LESSON ? [] : ["pool < threshold"],
      contentBlockers: need > 0 ? [`need ${need} reviewed items`] : [],
    });
  }
  report.sort((a, b) => a.stillRequired - b.stillRequired);
  return report;
}

export function topicGapReport() {
  const topics = loadTopics().topics;
  return topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    poolItems: t.poolItems,
    humanReviewed: 0,
    miniQuizEligible: t.poolItems >= 4,
    lessonAvailable: t.poolItems >= MIN_LESSON,
    indexable: t.pageStatus === "public-indexable",
    sitemap: t.pageStatus === "public-indexable",
    blueprintComponents: {
      intro: true,
      actualList: t.poolItems > 0,
      table: t.poolItems > 0,
      status: true,
      miniQuiz: t.poolItems >= 4,
      lessonLink: t.poolItems >= MIN_LESSON,
      dictionary: true,
      correction: true,
      source: true,
      modifiedDate: true,
    },
    reviewIdsNeeded: Math.max(0, MIN_LESSON - t.poolItems),
    contentBlockers: t.poolItems < MIN_LESSON ? [`need ${MIN_LESSON - t.poolItems} items`] : [],
    externalBlockers: t.reviewRollup === "human-reviewed" ? [] : ["human review"],
  }));
}

export function validateReviewed(overrides) {
  const errors = [];
  const seen = new Set();
  const publishedIds = new Set(loadPublishedWords().items.map((i) => i.id));
  const candidateIds = new Set(loadCandidates().items.map((i) => i.id));
  const allIds = new Set([...publishedIds, ...candidateIds]);
  for (const [idx, o] of overrides.entries()) {
    if (!o.itemId) errors.push(`[${idx}] missing itemId`);
    else if (!allIds.has(o.itemId)) errors.push(`[${idx}] unknown itemId ${o.itemId}`);
    if (!o.decision || !["approve", "reject", "revise"].includes(o.decision)) errors.push(`[${idx}] invalid decision`);
    if (o.decision === "approve" && o.reviewStatus === "human-reviewed") {
      if (!o.reviewer) errors.push(`[${idx}] human-reviewed without reviewer`);
      if (!o.reviewedAt) errors.push(`[${idx}] human-reviewed without reviewedAt`);
    }
    if (o.decision === "approve" && !o.reviewer) errors.push(`[${idx}] approve without reviewer`);
    if (o.reviewedAt && isNaN(Date.parse(o.reviewedAt))) errors.push(`[${idx}] invalid reviewedAt`);
    if (o.itemId && seen.has(o.itemId)) errors.push(`[${idx}] duplicate itemId ${o.itemId}`);
    if (o.itemId) seen.add(o.itemId);
    if (o.approvedAlternatives && !Array.isArray(o.approvedAlternatives)) errors.push(`[${idx}] approvedAlternatives must be array`);
    if (o.difficulty !== undefined && o.difficulty !== null && ![1, 2, 3].includes(Number(o.difficulty))) errors.push(`[${idx}] invalid difficulty`);
  }
  return errors;
}
