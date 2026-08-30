#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPublishedWords, loadTopics, loadLessonDrafts, MIN_LESSON } from "./lib/review-lib.mjs";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const topics = loadTopics().topics;
const words = loadPublishedWords().items;
const drafts = loadLessonDrafts().supplements;

// Prioritize: items needed to unlock first lesson (smallest gap) → high-value topics → frequent → uncertain
const gaps = topics.map((t) => ({ slug: t.slug, need: Math.max(0, MIN_LESSON - t.poolItems), pool: t.poolItems })).sort((a, b) => a.need - b.need);

const prioritySlug = gaps[0]?.slug || "angka";
const topicItems = new Map(topics.map((t) => [t.slug, t.itemIds]));

const queue = [];

// 1. Items needed for first lesson (from published pool + drafts that could be reviewed)
const firstNeed = gaps.find((g) => g.need > 0);
if (firstNeed) {
  // Add draft supplements for that lesson as top priority (they are editorial drafts needing review)
  for (const d of drafts.filter((s) => s.lessonSlug === firstNeed.slug).slice(0, 3)) {
    queue.push({
      itemId: `draft-${d.lessonSlug}-${d.batak}`,
      batak: d.batak,
      indonesia: d.indonesia,
      alternatives: [],
      source: "editorial-draft",
      reviewStatus: "needs-review",
      topicMemberships: [firstNeed.slug],
      candidateLessons: [firstNeed.slug],
      publicationImpact: `would reduce gap for ${firstNeed.slug} by ~1 (needs ${firstNeed.need})`,
      warnings: ["draft: needs human review before publish"],
      reviewerFields: { decision: null, reviewer: null, reviewedAt: null },
    });
  }
}

// 2. High-value topic items (published corpus-derived that could be human-reviewed)
for (const t of topics.slice(0, 3)) {
  for (const id of t.itemIds.slice(0, 2)) {
    const w = words.find((x) => x.id === id);
    if (!w) continue;
    queue.push({
      itemId: w.id,
      batak: w.batak,
      indonesia: w.indonesia,
      alternatives: [...(w.indonesianAlternatives || []), ...(w.batakAlternatives || [])],
      source: w.sourceType,
      reviewStatus: w.reviewStatus,
      topicMemberships: w.themes || [t.slug],
      candidateLessons: [t.slug],
      publicationImpact: `human-review would improve ${t.slug} rollup`,
      warnings: w.confidenceLabel === "medium_confidence" ? ["medium confidence"] : [],
      reviewerFields: { decision: null, reviewer: null, reviewedAt: null },
    });
  }
}

// 3. Remaining general (sample)
for (const w of words.slice(0, 10)) {
  if (queue.find((q) => q.itemId === w.id)) continue;
  queue.push({
    itemId: w.id,
    batak: w.batak,
    indonesia: w.indonesia,
    alternatives: w.indonesianAlternatives || [],
    source: w.sourceType,
    reviewStatus: w.reviewStatus,
    topicMemberships: w.themes || [],
    candidateLessons: [],
    publicationImpact: "general review",
    warnings: [],
    reviewerFields: { decision: null, reviewer: null, reviewedAt: null },
  });
  if (queue.length >= 20) break;
}

const outDir = join(root, "artifacts/review");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "review-queue.json"), JSON.stringify({ generatedAt: new Date().toISOString(), queue }, null, 2));
writeFileSync(join(outDir, "review-queue.csv"), ["itemId,batak,indonesia,source,reviewStatus,topics,impact", ...queue.map((r) => `"${r.itemId}","${r.batak}","${r.indonesia}","${r.source}","${r.reviewStatus}","${r.topicMemberships.join("|")}","${r.publicationImpact}"`)].join("\n"));
writeFileSync(join(outDir, "topic-gap-summary.json"), JSON.stringify({ gaps }, null, 2));
writeFileSync(join(outDir, "REVIEW_GUIDE.md"), `# Review Guide\n\nGenerated ${new Date().toISOString()}\n\n- Do not pre-fill approvals.\n- For each row, verify Batak/Indonesia against trusted source.\n- Record decision=approve/reject/revise, reviewer, reviewedAt (ISO), optional corrections.\n- Run \`npm run review:validate\` before preview.\n- Preview: \`npm run review:preview\` (no file overwritten).\n- Publish: \`npm run content:publish\` (requires validation).\n\nPriority: unlock ${prioritySlug} first (needs ${firstNeed?.need || 0}).\n`);
console.log(`review-queue: wrote ${queue.length} items to artifacts/review/review-queue.json`);
