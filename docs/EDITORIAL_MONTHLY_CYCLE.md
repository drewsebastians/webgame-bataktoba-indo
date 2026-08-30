# Editorial Monthly Cycle — Batak Toba Play

**Blueprint §24.1.** This cycle is valid even while analytics is OFF (privacy-safe).

## Monthly (30 days)
1. **Dictionary no-result review** — While analytics provider absent, collect no-result counts via `dictionary_no_result` event *only when provider+consent present*; until then, manually sample `dictionary` search box logs locally (never send raw query). Export aggregated no-result buckets via `artifacts/review/no-result-aggregate.json` (no PII).
2. **Corrections** — `git log --grep=correction` + GitHub issues `correction_opened` events (when active) → triage in `data/reviewed/overrides.json` candidate.
3. **Problematic items** — `data/reports/data-quality-report.json` → list `needs-revision` confidence low / duplicates → flag for reviewer.
4. **Review queue** — `npm run review:queue` → `artifacts/review/review-queue.json` (20 prioritized, smallest gap first `angka` needs 3).
5. **Lesson promotion** — `npm run review:lesson-gaps` → if `pool >=8` && `humanReviewed` rollup passes → `content:publish` preview → `review:preview` sitemap/structured-data delta → approve.
6. **Topic promotion** — `npm run review:topic-gaps` → `indexable` only when `pool>=8` && substantive material (not just count) → update `site.config lastModified` + `sitemap`.
7. **Archive doubtful** — `reject` decision in `overrides.json` → excluded before `published`.

Live analytics OFF → steps 1-2 use manual/aggregated mock until provider present (see HUMAN_LINGUISTIC_REVIEW_HANDOFF).
