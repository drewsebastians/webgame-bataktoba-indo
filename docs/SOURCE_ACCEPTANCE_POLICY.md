# Source Acceptance Policy — Batak Toba Play

Every future source requires in `data/sources/source-registry.json`:

- `sourceId` (kebab, e.g., `kbbi-batak-toba-2024`)
- `name`, `owner/publisher`, `url` or bibliographic ref
- `license` (SPDX), `licenseStatus` (`APPROVED_FOR_INGESTION` | `APPROVED_METADATA_ONLY` | `REQUIRES_PERMISSION` | `REQUIRES_LEGAL_REVIEW` | `REJECTED`)
- `retrievalDate` (ISO), `language` (`bbc`), `dialectScope`
- `format` (raw `pdf/db/csv/json` + staging `json`), `allowedReuse` (`verbatim`/`derivative`), `redistribution`, `attribution`, `commercialUse`, `knownLimitations`, `checksum` (`sha256`), `version`

No source enters `tools/build-from-canonical.mjs` ingestion without `APPROVED_FOR_INGESTION`. `REQUIRES_LEGAL_REVIEW` blocks preview. `REJECTED` never ingested.

## Governance: source-evidence-qualified (v2)

Publication lifecycle: `raw` → `candidate` → `source-evidence-qualified` → `published`

No human review stage exists. Qualification is fully automated via `tools/quality-gate.mjs` with tier-based thresholds calibrated from the full canonical corpus (1.69GB, SHA 3a34a54ddbe2):

- **Words**: high_confidence (silver ≥0.85) auto-qualify; medium_confidence (bronze/review ≥0.70) qualify with min 2 distinct source tables
- **Phrases**: high_confidence ≥0.75; medium_confidence ≥0.60; must have ≥2 tokens per side
- **Sentences**: high_confidence ≥0.70; medium_confidence ≥0.55; min 5 cooccurrence

Conflict detection: competing translations within 0.15 margin (words) / 0.20 (phrases) → `source-evidence-conflicted` (not blocked, tracked).

Licensing hard gate: `REQUIRES_LEGAL_REVIEW` / `publicationAllowed: false` blocks `content:publish` and `build-from-canonical` (unless `--internal`).