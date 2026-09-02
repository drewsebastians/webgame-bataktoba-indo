# Corpus Licensing Status — Batak Toba Play

**Current possession:**
- `bible_batak_indo_v1.db` 16 MB (31k verses, Batak+Indo) — **UNKNOWN — REQUIRES LEGAL/OWNER CONFIRMATION** (likely Bible translation, copyrighted).
- `bible_alignment_export_v1.db` 40KB export — same provenance.
- `master_alignment_bible_only.db` 1.6GB — NOT FOUND locally.
- `batak_alignment_canonical.sqlite` 1.69 GB (SHA 3a34a54ddbe2) — **DOWNLOADED** from upstream release `canonical-archive-2026-07-03` at `drewsebastians/batak-indo-alignment-engine`. Same provenance as above.

**Upstream alignment engine manifest:** `data/sources/alignment-engine-manifest.json` pins upstream `fb999a9`, `licenseStatus: REQUIRES_LEGAL_REVIEW`, `publicationAllowed: false`.

**Known owner:** Not documented in repo; `data/input/bible_batak_indo_v1.db:README.md` (if exists) should state publisher.
- **License:** Unknown
- **Commercial use:** Unknown → treat as **BLOCKED**
- **Redistribution:** Unknown → **do not redistribute** bulk verses; only counts/provenance/hashes in artifacts (copyright-safe).
- **Derived data:** `word-...` 591 derived pairs (canonical) are **corpus-derived**; attribution `batak_alignment_canonical.sqlite lexicon_pairs (btk->ind)` but not a license.

**Required decision:** Owner confirmation of `approved use` + `redistribution` + `derivative` + `attribution` + `commercial` before claiming `SOURCE_ACCEPTANCE_POLICY: APPROVED_FOR_INGESTION`. Until then, status `REQUIRES_LEGAL_REVIEW`.

**Licensing hard gate enforced:** `tools/content-publish.mjs` and `tools/build-from-canonical.mjs` (unless `--internal`) block on `REQUIRES_LEGAL_REVIEW` / `publicationAllowed: false`.

**Attribution obligations:** If approved, must cite `sourceRepository` + `sourceFiles` + `verse_key` provenance. Current metadata includes `sourceSha256: 3a34a54ddbe2`, `sourceFiles: ["batak_alignment_canonical.sqlite"]`.

**Do not infer permission.**