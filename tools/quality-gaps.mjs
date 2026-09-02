#!/usr/bin/env node
import { loadPublishedWords, loadTopics } from "./lib/review-lib.mjs";

const words = loadPublishedWords().items;
const topics = loadTopics().topics;

console.log("quality:gaps");

// Lessons needing items
const lessons = JSON.parse(readFileSync(join(process.cwd(), "data/published/lessons.json"), "utf8"));
const topicsData = JSON.parse(readFileSync("data/published/topics.json", "utf8")).topics;

console.log("\n--- Lesson Gaps ---");
for (const lesson of lessons.published) {
  const need = 8 - lesson.counts.poolItems;
  if (need > 0) {
    console.log(`- ${lesson.slug}: need ${need} more items (has ${lesson.counts.poolItems}/8)`);
  }
}
for (const t of JSON.parse(readFileSync("data/published/lessons.json", "utf8")).published) {
  const topic = t.slug;
  const topicMeta = topics.find(t => t.slug === topic);
  const need = Math.max(0, 8 - (topicMeta?.poolItems || 0));
  if (need > 0) {
    console.log(`- ${topic}: need ${need} more items (has ${topicMeta.poolItems}/8)`);
  }
}

// Draft lessons
const draftLessons = JSON.parse(readFileSync("data/published/lessons.json", "utf8")).draft;
console.log("\n--- Draft Lessons ---");
for (const d of draftLessons) {
  console.log(`- ${d.slug}: ${d.counts.poolItems}/${8} items`);
}

// Topic gaps
console.log("\n--- Topic Gaps ---");
for (const t of topics) {
  if (t.poolItems < 8) {
    console.log(`- ${t.slug}: ${t.poolItems}/8 (need ${8 - t.poolItems} more)`);
  }
}

// Items with insufficient evidence
import { loadPublishedWords } from "./lib/review-lib.mjs";
const words = loadPublishedWords().items;
const insufficient = words.filter(w => w.reviewStatus === "evidence-insufficient");
console.log(`\n--- Evidence Insufficient Items: ${insufficient.length} ---`);
for (const w of insufficient.slice(0, 10)) {
  console.log(`- ${w.id}: ${w.batak} -> ${w.indonesia} (confidence: ${w.confidenceScore})`);
}
if (insufficient.length > 10) console.log(`... and ${insufficient.length - 10} more`);

// Conflicted items
const conflicted = words.filter(w => w.reviewStatus === "conflicted");
console.log(`\n--- Conflicted Items: ${conflicted.length} ---`);

// Stale overrides
const overrides = JSON.parse(readFileSync("data/reviewed/overrides.json", "utf8")).overrides || [];
const stale = overrides.filter(o => !words.find(w => w.id === o.itemId));
console.log(`\nStale overrides (unknown IDs): ${stale.length}`);