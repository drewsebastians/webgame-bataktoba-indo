#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const file = process.argv[2];
if (!file) { console.error("Usage: npm run source:validate -- <staging.json>"); process.exit(1); }
const data = JSON.parse(readFileSync(file, "utf8"));
if (!data.sourceId) { console.error("missing sourceId"); process.exit(1); }
if (!["APPROVED_FOR_INGESTION","APPROVED_METADATA_ONLY","REQUIRES_PERMISSION","REQUIRES_LEGAL_REVIEW","REJECTED"].includes(data.licenseStatus)) { console.error("invalid licenseStatus"); process.exit(1); }
if (!Array.isArray(data.records)) { console.error("records must be array"); process.exit(1); }
for (const [i,r] of data.records.entries()) {
  if (!r.externalRecordId || !r.batak || !r.indonesian || !r.sourceReference) { console.error(`record ${i} missing required`); process.exit(1); }
  if (typeof r.batak !== "string" || typeof r.indonesian !== "string") { console.error(`record ${i} batak/indonesian must be string`); process.exit(1); }
}
console.log(`source:validate PASS — ${data.records.length} records, sourceId ${data.sourceId}, license ${data.licenseStatus}`);
