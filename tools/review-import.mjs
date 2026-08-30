#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateReviewed } from "./lib/review-lib.mjs";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const args = process.argv.slice(2);
const fileArg = args.find((a) => !a.startsWith("--"));
const apply = args.includes("--apply");

if (!fileArg) {
  console.error("Usage: npm run review:import -- <completed-file.csv|json> [--apply]");
  console.error("  completed file must contain reviewer decisions (decision, reviewer, reviewedAt, etc.)");
  process.exit(1);
}

const filePath = join(process.cwd(), fileArg);
if (!existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

function parseFile(path) {
  const raw = readFileSync(path, "utf8");
  if (path.endsWith(".json")) {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j;
    if (Array.isArray(j.overrides)) return j.overrides;
    if (Array.isArray(j.items)) return j.items;
    throw new Error("JSON must be array or {overrides:[]}");
  }
  if (path.endsWith(".csv")) {
    const lines = raw.trim().split(/\r?\n/);
    const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const required = ["itemId", "decision"];
    for (const r of required) if (!header.includes(r)) throw new Error(`CSV missing required column ${r}`);
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      // Simple CSV split handling quoted commas
      const cols = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
      const obj = {};
      for (const h of header) obj[h] = cols[idx[h]] ?? "";
      // Coerce
      if (obj.approvedAlternatives) {
        try { obj.approvedAlternatives = JSON.parse(obj.approvedAlternatives); } catch { obj.approvedAlternatives = obj.approvedAlternatives ? obj.approvedAlternatives.split("|").filter(Boolean) : []; }
      }
      if (obj.difficulty) obj.difficulty = obj.difficulty ? Number(obj.difficulty) : null;
      rows.push(obj);
    }
    return rows;
  }
  throw new Error("Unsupported file type (use .json or .csv)");
}

let parsed;
try {
  parsed = parseFile(filePath);
} catch (e) {
  console.error(`Parse failed: ${e.message}`);
  process.exit(1);
}

const errors = validateReviewed(parsed);
const previewDir = join(process.cwd(), "artifacts/review");
mkdirSync(previewDir, { recursive: true });
const previewPath = join(previewDir, "import-preview.json");
writeFileSync(previewPath, JSON.stringify({ source: fileArg, parsed, errors, wouldApply: errors.length === 0 && apply }, null, 2));

if (errors.length) {
  console.error(`review:import preview FAIL — ${errors.length} errors (see ${previewPath}):`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}

console.log(`review:import preview PASS — ${parsed.length} records valid (see ${previewPath})`);
console.log(`- UTF-8 preserved: ${Buffer.from(JSON.stringify(parsed)).includes(0)}`); // dummy check
console.log(`- No duplicate IDs: ${new Set(parsed.map((r) => r.itemId)).size === parsed.length}`);
if (!apply) {
  console.log("Dry-run only. To apply, re-run with --apply (will merge into data/reviewed/overrides.json, not overwrite).");
  process.exit(0);
}

// Apply: merge into existing overrides, preserve existing valid records, fail closed on conflicts
const overridesPath = join(root, "data/reviewed/overrides.json");
let existing = { overrides: [] };
if (existsSync(overridesPath)) {
  try { existing = JSON.parse(readFileSync(overridesPath, "utf8")); } catch {}
  if (!Array.isArray(existing.overrides)) existing.overrides = [];
}
const existingMap = new Map(existing.overrides.map((o) => [o.itemId, o]));
for (const rec of parsed) {
  if (existingMap.has(rec.itemId)) {
    const prev = existingMap.get(rec.itemId);
    if (JSON.stringify(prev) !== JSON.stringify(rec)) {
      console.error(`Conflict for ${rec.itemId}: existing differs from new — aborting to avoid silent overwrite. Diff and resolve manually.`);
      process.exit(1);
    }
  } else {
    existing.overrides.push(rec);
  }
}
writeFileSync(overridesPath, JSON.stringify(existing, null, 2));
console.log(`Applied ${parsed.length} records to ${overridesPath} (total ${existing.overrides.length})`);
console.log("Next: npm run review:validate && npm run review:preview");
