#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const file = process.argv[2];
if (!file) { console.error("Usage: npm run source:preview -- <staging.json>"); process.exit(1); }
const data = JSON.parse(readFileSync(file, "utf8"));
const published = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8"));
const keywords = JSON.parse(readFileSync(join(root, "content/themes/keywords.json"), "utf8")).themes;
function normalize(s) { return String(s).toLowerCase().normalize("NFC").trim(); }
console.log(`source:preview for ${data.sourceId}`);
console.log(`- new raw records: ${data.records.length}`);
const dup = data.records.filter(r => published.items.find(p => normalize(p.batak) === normalize(r.batak) && normalize(p.indonesia) === normalize(r.indonesian)));
console.log(`- duplicates (existing batak+indonesia): ${dup.length}`);
const dupNorm = data.records.filter(r => published.items.find(p => normalize(p.batak) === normalize(r.batak) || normalize(p.indonesia) === normalize(r.indonesian)));
console.log(`- normalized duplicates (batak or indonesia alone): ${dupNorm.length - dup.length}`);
const conflicts = data.records.filter(r => {
  const nb = normalize(r.batak), ni = normalize(r.indonesian);
  return published.items.some(p => (normalize(p.batak) === nb && normalize(p.indonesia) !== ni) || (normalize(p.indonesia) === ni && normalize(p.batak) !== nb));
});
console.log(`- conflicts (same Batak→different Indonesian or vice versa): ${conflicts.length} (needs evidence review)`);
const affected = new Map();
for (const rec of data.records) {
  const nb = normalize(rec.batak), ni = normalize(rec.indonesian);
  for (const [theme, kws] of Object.entries(keywords)) {
    const batakKws = new Set((kws.batak || []).map(normalize));
    const indoKws = new Set((kws.indonesia || []).map(normalize));
    if (batakKws.has(nb) || indoKws.has(ni)) {
      affected.set(theme, (affected.get(theme) || 0) + 1);
    }
  }
}
console.log(`- topics affected: ${[...affected.entries()].map(([k,v]) => `${k}+${v}`).join(", ") || "none (no keyword match)"}`);
for (const [theme, add] of affected) {
  const t = topics.topics.find(x => x.slug === theme);
  if (t) console.log(`  - ${theme}: pool ${t.poolItems}→${t.poolItems + add} need ${Math.max(0, 8 - (t.poolItems + add))}`);
}
const totalNewCandidates = data.records.length - dup.length;
console.log(`- new candidate IDs (non-duplicate): ${totalNewCandidates}`);
console.log(`- potential SEO unlocks: ${[...affected].some(([_, add]) => {
  const t = topics.topics.find(x => x.slug === _.split("+")[0]); return false;
}) ? "check per topic above" : "none until human review + publish"}`);
console.log(`- licensing: ${data.licenseStatus} ${data.licenseStatus !== "APPROVED_FOR_INGESTION" ? "(would block import)" : ""}`);
console.log(`- review queue delta: +${totalNewCandidates} (still need source-evidence, not auto-published)`);
console.log("Preview only — no files written.");
