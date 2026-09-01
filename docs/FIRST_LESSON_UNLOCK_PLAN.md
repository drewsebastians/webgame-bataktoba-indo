# First Lesson Unlock Plan — Batak Toba Play (Source-Evidence Model v2)

**Governance:** Human review removed 2026-09-01. Publication requires `source-evidence-qualified` deterministic gates, not `human-reviewed`.

**Safest candidate:** `angka` (Angka Batak Toba) — still preferred low-risk.

## Why angka
- Smallest gap: `pool 5 / 8 need 3` (vs keluarga 0, sapaan 0)
- Current rollup `corpus-derived-beta`, provenance `alignment-engine` high/medium confidence
- Supplements `lesson-drafts.json:angka` 8 `editorial-draft` not evidence (not used)

## Recalculated Evidence (2026-09-01, alignment-engine `fb999a9`)
- Published words 367, candidates 367, notPublished 0
- `angka` IDs (5): `word-0880cf2284` (ualu→delapan), `word-141862f84e` (sia→sembilan), `word-3991eb4b1f` (pitu→tujuh), `word-92add2f91e` (tolu→tiga), `word-cda58024a5` (onom→enam)
- Additional source-backed candidates in current DB snapshot: **0** (see `artifacts/source-expansion/angka-evidence-candidates.json`)
- Drafts excluded per safety.

## Path Forward (No Human Review)
`5 remains 5` until **3 genuinely additional source-evidence-qualified items** are ingested from `drewsebastians/batak-indo-alignment-engine` pinned `fb999a9` or approved external source.

**Next:** `npm run corpus:inspect` → `source:validate` → `source:preview` → `source:import --apply` (adds to candidate) → automated qualification (evidence gates) → `content:publish` (DB-independent) → `angka` 5→8 → `topics.json` `public-indexable` → `sitemap` +1 → `LearningResource`.

**When batch exists:** No `reviewer`/`reviewedAt` needed; items become `source-evidence-qualified` via deterministic `qualityPolicyVersion` (see `SOURCE_EVIDENCE_PUBLICATION_POLICY`), then published if `published` + threshold.

**Tests after:** `npm run verify:release` (no `review:validate` for human).

*Source-evidence-qualified, not human-verified; see `GOVERNANCE_DECISION_NO_HUMAN_REVIEW.md`.*
