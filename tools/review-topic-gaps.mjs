#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { topicGapReport } from "./lib/review-lib.mjs";

const report = topicGapReport();
const outDir = join(fileURLToPath(new URL("../", import.meta.url)), "../artifacts/review");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "topic-gaps.json"), JSON.stringify({ generatedAt: new Date().toISOString(), topics: report }, null, 2));
console.log("review:topic-gaps:");
for (const t of ["angka", "keluarga", "sapaan", "makanan", "waktu", "alam"]) {
  const r = report.find((x) => x.slug === t);
  if (!r) continue;
  console.log(`- ${t}: pool ${r.poolItems} need ${r.reviewIdsNeeded} miniQuiz ${r.miniQuizEligible} lesson ${r.lessonAvailable} indexable ${r.indexable} blockers ${r.contentBlockers.join(";") || "none"}`);
}
