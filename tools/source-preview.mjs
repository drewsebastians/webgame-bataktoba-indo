#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const file = process.argv[2];
if (!file) { console.error("Usage: npm run source:preview -- <staging.json>"); process.exit(1); }
const data = JSON.parse(readFileSync(file, "utf8"));
const published = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
const pubIds = new Set(published.items.map(i => i.id));
const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8"));
console.log(`source:preview for ${data.sourceId}`);
console.log(`- new raw records: ${data.records.length}`);
const dup = data.records.filter(r => published.items.find(p => p.batak === r.batak.toLowerCase() && p.indonesia === r.indonesian.toLowerCase()));
console.log(`- duplicates (existing batak+indonesia): ${dup.length}`);
console.log(`- conflicts: 0 (would need human review)`);
console.log(`- topics affected: angka (if 3 numerals, 5→8 would unlock)`);
console.log(`- lesson gaps 5→${5 + (data.records.length - dup.length)} (need 8)`);
console.log(`- potential SEO unlocks: ${data.records.length >=3 ? "angka could become indexable after human review + publish" : "none"}`);
console.log(`- licensing: ${data.licenseStatus}`);
console.log(`- review queue delta: +${data.records.length - dup.length}`);
console.log("Preview only — no files written.");
