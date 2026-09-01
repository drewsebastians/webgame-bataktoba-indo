#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const args = process.argv.slice(2);
const fileArg = args.find(a => !a.startsWith("--"));
const apply = args.includes("--apply");

if (!fileArg) { console.error("Usage: npm run source:import -- <staging.json> [--apply]"); process.exit(1); }
const filePath = join(process.cwd(), fileArg);
const data = JSON.parse(readFileSync(filePath, "utf8"));

// Validate source exists in registry and license
const registry = JSON.parse(readFileSync(join(root, "data/sources/source-registry.json"), "utf8"));
const srcEntry = registry.sources.find(s => s.sourceId === data.sourceId);
if (!srcEntry) { console.error(`sourceId ${data.sourceId} not in source-registry.json`); process.exit(1); }
if (data.licenseStatus !== "APPROVED_FOR_INGESTION") {
  console.error(`licenseStatus ${data.licenseStatus} not approved — import blocked (needs APPROVED_FOR_INGESTION)`);
  process.exit(1);
}
if (srcEntry.licenseStatus !== "APPROVED_FOR_INGESTION") {
  console.error(`registry licenseStatus for ${data.sourceId} is ${srcEntry.licenseStatus} — import blocked`);
  process.exit(1);
}

// Validate records
if (!Array.isArray(data.records)) { console.error("records must be array"); process.exit(1); }
for (const [i, r] of data.records.entries()) {
  if (!r.externalRecordId || !r.batak || !r.indonesian || !r.sourceReference) { console.error(`record ${i} missing required`); process.exit(1); }
}

// Check duplicates and conflicts vs published
const published = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
function norm(s){ return String(s).toLowerCase().normalize("NFC").trim(); }
const pubPairs = new Set(published.items.map(p => norm(p.batak) + "\x1f" + norm(p.indonesia)));
const pubBatak = new Map(published.items.map(p => [norm(p.batak), p]));
const pubIndo = new Map(published.items.map(p => [norm(p.indonesia), p]));

for (const r of data.records) {
  const key = norm(r.batak) + "\x1f" + norm(r.indonesian);
  if (pubPairs.has(key)) { console.error(`duplicate exact ${r.batak}→${r.indonesian}`); process.exit(1); }
  const batakExists = pubBatak.has(norm(r.batak));
  const indoExists = pubIndo.has(norm(r.indonesian));
  if (batakExists && indoExists) {
    // Both sides exist but as different pair — potential conflict
    // For now, allow but warn; will need human review
  }
  // Deterministic stable ID
  const id = "word-" + createHash("sha256").update(norm(r.batak) + "\x1f" + norm(r.indonesian)).digest("hex").slice(0,10);
  r._stableId = id;
  if (published.items.find(p => p.id === id)) { console.error(`stable ID collision ${id}`); process.exit(1); }
}

console.log(`source:import preview for ${data.sourceId}: ${data.records.length} records validated, license OK, stable IDs deterministic`);

if (!apply) {
  console.log("Dry-run only. Re-run with --apply to stage for candidate (still needs source-evidence, not auto-published).");
  process.exit(0);
}

// Apply: stage for candidate (not yet published, not human-reviewed)
const stagingDir = join(root, "data/sources/staging");
mkdirSync(stagingDir, { recursive: true });
const dest = join(root, `data/sources/ingested/${data.sourceId}.json`);
mkdirSync(join(root, "data/sources/ingested"), { recursive: true });
writeFileSync(dest, JSON.stringify(data, null, 2));
console.log(`Applied ${data.records.length} records to ${dest} (candidate, not human-reviewed, not auto-published)`);

// Also append to candidates as new items (still candidate, not published)
const candidatesPath = join(root, "data/candidates/word-pairs.json");
let cand = { items: [] };
try { cand = JSON.parse(readFileSync(candidatesPath, "utf8")); } catch {}
const newItems = data.records.map(r => ({
  id: r._stableId,
  schemaVersion: 2,
  type: "word",
  batak: norm(r.batak),
  indonesia: norm(r.indonesian),
  indonesianAlternatives: [],
  batakAlternatives: [],
  themes: [],
  difficulty: null,
  sourceType: "contributor-proposed",
  quality: "corpus-derived",
  confidenceScore: null,
  confidenceLabel: "contributor-proposed",
  cooccurrenceCount: 0,
  source: data.sourceId,
  sourceReference: r.sourceReference,
  externalRecordId: r.externalRecordId,
  reviewStatus: "candidate",
  publicationStatus: "candidate"
}));
cand.items = [...cand.items, ...newItems];
writeFileSync(candidatesPath, JSON.stringify(cand, null, 2));
console.log(`Staged ${newItems.length} candidate items (still need human review via review:import)`);
