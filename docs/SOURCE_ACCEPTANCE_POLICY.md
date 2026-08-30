# Source Acceptance Policy — Batak Toba Play

Every future source requires in `data/sources/source-registry.json`:

- `sourceId` (kebab, e.g., `kbbi-batak-toba-2024`)
- `name`, `owner/publisher`, `url` or bibliographic ref
- `license` (SPDX), `licenseStatus` (`APPROVED_FOR_INGESTION` | `APPROVED_METADATA_ONLY` | `REQUIRES_PERMISSION` | `REQUIRES_LEGAL_REVIEW` | `REJECTED`)
- `retrievalDate` (ISO), `language` (`bbc`), `dialectScope`
- `format` (raw `pdf/db/csv/json` + staging `json`), `allowedReuse` (`verbatim`/`derivative`), `redistribution`, `attribution`, `commercialUse`, `knownLimitations`, `checksum` (`sha256`), `version`

No source enters `tools/build-learning-data.py` ingestion without `APPROVED_FOR_INGESTION`. `REQUIRES_LEGAL_REVIEW` blocks preview. `REJECTED` never ingested.
