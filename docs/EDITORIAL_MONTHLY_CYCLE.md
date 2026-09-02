# Editorial Monthly Cycle — Batak Toba Play

**Governance: source-evidence-qualified v2** — No human review stage. Publication lifecycle: `raw` → `candidate` → `source-evidence-qualified` → `published`.

Automated quality gate: `tools/quality-gate.mjs` with tier-based thresholds calibrated from full canonical corpus (1.69GB, SHA 3a34a54ddbe2).

## Monthly (30 days)

1. **Dictionary no-result review** — Export aggregated no-result buckets via `artifacts/review/no-result-aggregate.json` (no PII). When analytics provider + consent active, auto-collect `dictionary_no_result` events.
2. **Corrections** — `git log --grep=correction` + GitHub issues `correction_opened` events → triage in `data/reviewed/overrides.json` candidate (legacy human override path, not primary gate).
3. **Quality gaps** — `npm run quality:gaps` → `artifacts/reports/quality-gaps.json` → topics with `poolItems < 8` flagged for expansion.
4. **Conflict tracking** — `npm run quality:conflicts` → `artifacts/reports/quality-conflicts.json` → competing translations within margin tracked as `source-evidence-conflicted` (not blocked).
5. **Source expansion** — If new staging sources with `APPROVED_FOR_INGESTION` → `node tools/build-from-canonical.mjs --internal` → validate quality gate results → `npm run build` → `npm run verify:release`.
6. **Licensing hard gate** — `REQUIRES_LEGAL_REVIEW` / `publicationAllowed: false` blocks `content:publish` and `build-from-canonical` (unless `--internal`). Resolve via `docs/CORPUS_LICENSING_STATUS.md`.
7. **Topic indexability** — `npm run review:topic-gaps` → `public-indexable` only when `poolItems >= 8` → update `site.config lastModified` + `sitemap.xml`.
8. **Determinism check** — `npm run verify:drift` → zero diff in `dist/` → fast-forward push.

**No human review queue.** `npm run review:queue` retained for legacy migration only (synthetic fixtures). The primary gate is `source-evidence-qualified` from `tools/quality-gate.mjs`.