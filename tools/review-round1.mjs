#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPublishedWords, loadTopics, loadLessonDrafts } from "./lib/review-lib.mjs";

const root = join(fileURLToPath(new URL("../", import.meta.url)));

const topics = loadTopics().topics;
const words = loadPublishedWords().items;
const drafts = loadLessonDrafts().supplements;
const angkaTopic = topics.find((t) => t.slug === "angka");
const angkaIds = angkaTopic?.itemIds || [];

const roundDir = join(root, "artifacts/review/round-1");
mkdirSync(roundDir, { recursive: true });

const rows = [];
for (const id of angkaIds) {
  const w = words.find((x) => x.id === id);
  if (!w) continue;
  rows.push({
    itemId: w.id,
    currentBatak: w.batak,
    currentIndonesian: w.indonesia,
    existingAlternatives: [...(w.indonesianAlternatives || []), ...(w.batakAlternatives || [])],
    source: w.sourceType,
    provenance: `${w.sourceType} ${w.confidenceLabel || ""} cooccurrence ${w.cooccurrenceCount || ""}`.trim(),
    currentReviewStatus: w.reviewStatus,
    currentPublicationStatus: "published",
    candidateLessons: ["angka"],
    candidateTopics: w.themes?.length ? w.themes : ["angka"],
    whatUnlocks: "human-review of this item improves angka rollup but alone does not reach 8 (need 3 additional source-backed items per FIRST_LESSON_UNLOCK_PLAN)",
    knownWarnings: w.confidenceLabel === "medium_confidence" ? ["medium confidence"] : [],
    reviewerFields: {
      decision: "",
      reviewStatus: "",
      reviewer: "",
      reviewedAt: "",
      correctedBatak: "",
      correctedIndonesian: "",
      approvedAlternatives: "",
      difficulty: "",
      reviewNote: "",
      uncertainFlag: "",
    },
  });
}

// Also include a few draft supplements as separate review items (to show they are not source-backed for unlock)
for (const d of drafts.filter((s) => s.lessonSlug === "angka").slice(0, 3)) {
  rows.push({
    itemId: `draft-${d.lessonSlug}-${d.batak}`,
    currentBatak: d.batak,
    currentIndonesian: d.indonesia,
    existingAlternatives: [],
    source: d.sourceType,
    provenance: "editorial-draft (no corpus provenance)",
    currentReviewStatus: d.reviewStatus,
    currentPublicationStatus: "draft",
    candidateLessons: [d.lessonSlug],
    candidateTopics: [d.lessonSlug],
    whatUnlocks: "draft review alone does NOT unlock lesson (needs source-backed candidates)",
    knownWarnings: ["draft: needs source verification"],
    reviewerFields: {
      decision: "",
      reviewStatus: "",
      reviewer: "",
      reviewedAt: "",
      correctedBatak: "",
      correctedIndonesian: "",
      approvedAlternatives: "",
      difficulty: "",
      reviewNote: "",
      uncertainFlag: "",
    },
  });
}

const csvHeader = "itemId,currentBatak,currentIndonesian,existingAlternatives,source,provenance,currentReviewStatus,candidateLessons,whatUnlocks,decision,reviewStatus,reviewer,reviewedAt,correctedBatak,correctedIndonesian";
const csvRows = rows.map((r) =>
  [
    r.itemId,
    r.currentBatak,
    r.currentIndonesian,
    `"${r.existingAlternatives.join("|")}"`,
    r.source,
    `"${r.provenance}"`,
    r.currentReviewStatus,
    r.candidateLessons.join("|"),
    `"${r.whatUnlocks}"`,
    "", "", "", "", "", "",
  ]
    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
    .join(","),
);

writeFileSync(join(roundDir, "round-1-review.json"), JSON.stringify({ generatedAt: new Date().toISOString(), baseline: "267e4a6", lesson: "angka", pool: "5/8 need 3 additional source-backed", rows }, null, 2));
writeFileSync(join(roundDir, "round-1-review.csv"), [csvHeader, ...csvRows].join("\n"));
writeFileSync(join(roundDir, "round-1-provenance.json"), JSON.stringify({ topics: topics.find((t) => t.slug === "angka"), publishedWords: rows.filter((r) => !r.itemId.startsWith("draft-")).length, drafts: drafts.filter((s) => s.lessonSlug === "angka").length, note: "All rows derived from repository; no linguistic judgments pre-filled." }, null, 2));
writeFileSync(
  join(roundDir, "round-1-impact-preview.json"),
  JSON.stringify({ lesson: "angka", currentPool: 5, threshold: 8, need: 3, additionalCandidatesInRepo: 0, outcome: "CANNOT UNLOCK BY REVIEW ALONE — need 3 additional source-backed candidates (see FIRST_LESSON_UNLOCK_PLAN)" }, null, 2),
);
writeFileSync(
  join(roundDir, "ROUND_1_REVIEW_GUIDE.md"),
  "# Round 1 Review Guide — angka (5/8)\n\nGenerated " +
    new Date().toISOString() +
    " baseline 267e4a6.\n\n**You are asked to verify** Batak text vs Indonesian meaning for each row, using a trusted source (speaker, dictionary, text). Do NOT use AI.\n\n- **corpus-derived/beta** means statistical co-occurrence, not truth. Verify each.\n- You may **approve** (human-reviewed), **reject** (exclude), **revise** (needs note), or flag **uncertain**.\n- Approval does **not** auto-publish lesson; 5 reviewed → still 5 (<8). Need 3 *additional* source-backed items (currently 0 in repo) per unlock plan.\n- Handle alternatives: if panangko→pencuri also means maling, add to approvedAlternatives as JSON array.\n- Flag uncertain / dialect / context concerns in reviewNote.\n- Required for human-reviewed: reviewer (name/affiliation) and reviewedAt (ISO).\n- Publication impact noted per row; no linguistic suggestion is pre-filled.\n\n**Steps:** fill round-1-review.csv → save UTF-8 → npm run review:import -- artifacts/review/round-1/round-1-review.csv (preview) → with --apply after validation.\n\nWorkload: 5 published + 3 draft rows (small, focused).\n",
);

console.log(`review:round-1: wrote ${rows.length} rows to ${roundDir} (5 published + 3 draft)`);
console.log("Impact: 0 additional source-backed candidates in repo → cannot unlock 5→8 by review alone (see FIRST_LESSON_UNLOCK_PLAN).");
