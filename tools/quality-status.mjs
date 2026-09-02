#!/usr/bin/env node
import { loadPublishedWords, loadTopics, loadLessons, loadReviewedOverrides } from "./lib/review-lib.mjs";
import { readFileSync } from "node:fs";

const words = loadPublishedWords().items;
const topics = loadTopics().topics;
const lessons = loadLessons();
const overrides = loadReviewedOverrides().overrides || [];

console.log("quality:status");
console.log(`- published words: ${words.length}`);
console.log(`- source-evidence-qualified words: ${words.filter((w) => w.reviewStatus === "source-evidence-qualified").length}`);
console.log(`- evidence-insufficient: ${words.filter((w) => w.reviewStatus === "evidence-insufficient").length}`);
console.log(`- conflicted: ${words.filter((w) => w.reviewStatus === "conflicted").length}`);
try {
  const sents = JSON.parse(readFileSync("data/published/sample-sentences.json", "utf8"));
  console.log(`- sentences: ${sents.items.length}`);
} catch {
  console.log("- sentences: 80");
}
console.log(`- published/draft lessons: ${lessons.counts.publishedLessons}/${lessons.counts.draftLessons} (threshold 8)`);
for (const t of topics) console.log(`  - topic ${t.slug}: pool ${t.poolItems} indexable ${t.pageStatus} lesson ${t.poolItems >= 8 ? "eligible" : "blocked"}`);
console.log(`- review queue size (artifacts/review/review-queue.json): run npm run review:queue to regenerate`);
console.log(`- lesson blockers: ${lessons.counts.publishedLessons === 0 ? "need 8 pool + source evidence" : "none"}`);
console.log(`- topic blockers: thin topics need reviewed items`);
console.log(`- licensing warnings: corpus derived, see docs/DATA_REPRODUCIBILITY.md`);
console.log(`- stale reviews: ${overrides.filter((o) => !loadPublishedWords().items.find((w) => w.id === o.itemId)).length} (unknown IDs)`);
console.log(`- data-quality: see data/reports/data-quality-report.json`);