# Source Revocation Safety — Batak Toba Play

**Blueprint:** A future source may become unusable (license revoked, error found).

## Traceability
Every published item stores `source` + `sourceType` + stable ID. `data/sources/source-registry.json` maps `sourceId` to items.

**Tool:** `node tools/source-dependency.mjs <sourceId>` (to be created) will report:
- which `word-…` items derive from `sourceId`
- which `topics` use them (`topics.json` `itemIds`)
- which `lessons` use them
- which `dist` pages would need withdraw
- which stable IDs become archived (never reused)

**Safety:** No destructive auto-revocation. Steps:
1. Mark source `licenseStatus: REJECTED` in registry
2. `npm run review:preview` shows items that would be withdrawn
3. Human approves via `overrides.json` `reject` decisions for those IDs
4. `content:publish` (DB) regenerates without them, `sitemap` demotes, `stable IDs` archived in `id-map.json` (retained forever, not deleted)

Synthetic test only; no automatic deletion.
