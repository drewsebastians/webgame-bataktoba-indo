#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonGapReport } from "./lib/review-lib.mjs";

const report = lessonGapReport();
const outDir = join(fileURLToPath(new URL("../", import.meta.url)), "../artifacts/review");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "lesson-gaps.json"), JSON.stringify({ generatedAt: new Date().toISOString(), lessons: report }, null, 2));
console.log("review:lesson-gaps:");
for (const l of report) {
  console.log(`- ${l.slug}: pool ${l.corpusDerived}/${l.threshold} need ${l.stillRequired} rollup ${l.reviewRollup} ${l.technicalBlockers.join(",") || "ok"} ${l.contentBlockers.join(";")}`);
}
const first = report.find((r) => r.stillRequired > 0) || report[0];
if (first) console.log(`\nSmallest batch to unlock first lesson (${first.slug}): ${first.stillRequired} reviewed items (IDs: ${first.unlockItemIds.join(", ") || "none yet"})`);
