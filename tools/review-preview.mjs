#!/usr/bin/env node
import { loadReviewedOverrides, loadTopics, loadLessons, loadPublishedWords, MIN_LESSON } from "./lib/review-lib.mjs";

const overrides = loadReviewedOverrides().overrides || [];
const topics = loadTopics().topics;
const lessons = loadLessons();
const words = loadPublishedWords().items;

// Simulate apply (in-memory)
const wordMap = new Map(words.map((w) => [w.id, { ...w }]));
let changed = 0, textChanged = 0;
for (const o of overrides) {
  const w = wordMap.get(o.itemId);
  if (!w) continue;
  if (o.decision === "approve") {
    if (w.reviewStatus !== "human-reviewed") changed++;
    if (o.approvedMeaning && o.approvedMeaning !== w.indonesia) textChanged++;
    w.reviewStatus = "human-reviewed";
    w.reviewedBy = o.reviewer;
  }
}

const wouldPublish = [];
for (const t of topics) {
  const human = t.itemIds.filter((id) => wordMap.get(id)?.reviewStatus === "human-reviewed").length;
  const wouldLesson = t.poolItems + (overrides.filter((o) => o.decision === "approve").length > 0 ? 1 : 0); // simplified
  if (t.poolItems < MIN_LESSON && t.poolItems + 1 >= MIN_LESSON) wouldPublish.push(t.slug);
}

console.log("review:preview (dry-run, no files overwritten)");
console.log(`- overrides: ${overrides.length}`);
console.log(`- items that would change status: ${changed}`);
console.log(`- items whose public text would change: ${textChanged}`);
console.log(`- lessons that would become eligible (approx): ${wouldPublish.join(", ") || "none"}`);
console.log(`- topics crossing threshold (approx): ${wouldPublish.join(", ") || "none"}`);
console.log(`- lessons currently published: ${lessons.counts.publishedLessons} → after approx ${lessons.counts.publishedLessons + (wouldPublish.length ? 1 : 0)}`);
console.log(`- sitemap delta: ${wouldPublish.length ? "+" + wouldPublish.length + " URLs" : "none"}`);
console.log(`- structured-data delta: LearningResource ${wouldPublish.length ? "would appear for " + wouldPublish.join(", ") : "none"}`);
const dq = words.length;
console.log(`- data-quality: ${dq} words would remain, no draft leakage if validation passed`);
if (overrides.length === 0) console.log("- No overrides yet — preview shows current production truth.");
