# Reviewer-Originated Primary Data Policy — Batak Toba Play

**Difference from corpus-derived:** Reviewer directly supplies missing lexical entry (not reviewing corpus candidate).

**Submission must contain:**
- `batak`, `indonesian`, optional `alternatives`, optional `context/usageNote`, `dialectNote`
- `contributorId` (reviewer), `date` (ISO), `permissionToPublish` (boolean), `licenseDeclaration` (e.g., `CC-BY-4.0` or `explicit permission`), `confidence`/`uncertainFlag`

**Statuses:** `CONTRIBUTOR_PROPOSED` → `HUMAN_REVIEWED` (if same contributor is qualified reviewer or second reviewer approves) → `PUBLISHED` → `REJECTED`

**Requirements:**
- Explicit `permissionToPublish` + `licenseDeclaration`; conversational approval **not** a license.
- No pre-fill of linguistic judgments by tooling.
- Staged via `data/sources/staging/reviewer-<id>.json` with `sourceId: reviewer-<id>` and `licenseStatus: APPROVED_FOR_INGESTION` only after `permissionToPublish` true.
- Enters `candidate` with `sourceType: contributor-proposed`, then same `human-reviewed` + `stable ID` + `topic` + `lesson` pipeline.

This pathway is fastest for `angka` 3 numerals if qualified speaker supplies them.
