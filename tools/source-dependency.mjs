#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(fileURLToPath(new URL("../", import.meta.url)));
const sourceId = process.argv[2] || "bible-batak-indo-v1";
const words = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8")).items;
const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8")).topics;
const lessons = JSON.parse(readFileSync(join(root, "data/published/lessons.json"), "utf8"));
console.log(`source-dependency for ${sourceId}:`);
const affected = words.filter(w => (w.source || "").includes(sourceId) || w.sourceType === "corpus-derived");
console.log(`- items: ${affected.length} (e.g., ${affected.slice(0,2).map(i=>i.id).join(", ")})`);
for (const t of topics) {
  const uses = t.itemIds.filter(id => affected.some(a=>a.id===id));
  if (uses.length) console.log(`- topic ${t.slug}: ${uses.length} items`);
}
for (const l of lessons.published) {
  const uses = l.itemIds.filter(id => affected.some(a=>a.id===id));
  if (uses.length) console.log(`- lesson ${l.slug}: ${uses.length} items`);
}
console.log("- stable IDs would be archived in id-map.json, not deleted");
