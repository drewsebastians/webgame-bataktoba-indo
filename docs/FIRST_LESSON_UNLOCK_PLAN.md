# First Lesson Unlock Plan — Batak Toba Play

**Safest candidate (low cultural risk, clear provenance):** `angka` (Angka Batak Toba).

## Why angka
- Smallest gap to threshold: `pool 5 / 8 need 3` (vs keluarga 0 need 8, sapaan 0 need 8)
- Review rollup currently `corpus-derived-beta`, provenance Bible corpus co-occurrence (high/medium confidence)
- Beginner-friendly, low cultural sensitivity vs kinship/adat
- Supplements available in `data/candidates/lesson-drafts.json:angka` 8 drafts (`sada, dua, opat, lima, walu, sampulu, saratus, saribu`) — but **not** used for unlock; need corpus items, not drafts.

## Recalculated Evidence (2026-08-30, `data/candidates/word-pairs.json` vs `data/published/word-pairs.json`)
- Published words: 367
- Candidates words: 367
- Candidate-but-not-published: **0** (every candidate is already published; `notPublished = []`)
- `angka` current published IDs (5): `word-0880cf2284`, `word-141862f84e`, `word-3991eb4b1f`, `word-92add2f91e`, `word-cda58024a5`
- Additional source-backed candidate IDs that could raise 5→8: **0** (no genuinely additional, non-duplicate, source-backed candidate exists)
- Draft supplements (`lesson-drafts.json:angka` 8) are `editorial-draft` without corpus provenance — explicitly excluded per safety rules
- Duplicate visible labels: checked via `check-site` (0 duplicates)
- Provenance for every candidate: `sourceType corpus-derived`, `confidenceLabel high/medium`

## Outcome B — First Lesson Cannot Be Unlocked By Review Alone
`5 remains 5` after reviewing only the existing five. **At least 3 genuinely additional, non-duplicate, source-backed candidate items must be acquired first.**

**External/source work required:**
- Re-run `tools/build-learning-data.py` with a relaxed proper-name/stopword filter that preserves additional angka candidates, OR curate new angka items with documented provenance (e.g., from a separate angka wordlist with `sourceReference`), OR import from an approved external angka list with licensing.
- The existing `review:queue` `artifacts/review/review-queue.json` already prioritizes drafts, but drafts cannot unlock without source; new candidates must be added to `data/candidates/word-pairs.json` (or `data/reviewed/overrides.json` with `approvedMeaning` + `sourceType human-curated` + `reviewStatus human-reviewed`) before publication.

## Exact IDs (current published pool for angka)
`word-0880cf2284`, `word-141862f84e`, `word-3991eb4b1f`, `word-92add2f91e`, `word-cda58024a5` (5)

**Minimum review batch *if* 3 additional source-backed items existed:** 3 `human-reviewed` words that are angka-themed, each requiring `itemId`, `decision approve`, `reviewer`, `reviewedAt`, optional `approvedMeaning`/`alternatives`/`difficulty`.

## What reviewer would verify (when batch exists)
For each of 3: Batak numeral vs Indonesian (`sada→satu` etc. if candidate), alternatives, no duplicate visible label, usage note optional — without pre-filled approval.

## What would become public (when batch exists)
- `data/published/lessons.json` `angka` `published` with `8` `itemIds` + `reviewRollup` maybe `mixed`/`human-reviewed` if 3 approved
- `data/published/topics.json` `angka` `poolItems 8` + `pageStatus public-indexable` + `sitemap` `+1` with `<lastmod>` + `LearningResource` with `dateModified` from `site.config`
- Topic page `learn/angka/` would gain mini-quiz eligibility (≥4 already) and lesson link, correction still.

## Tests after approval
`npm run review:validate && npm run review:preview && npm run content:publish (DB) && npm run verify:release`

*Do not make linguistic judgments here; reviewer decides. This update corrects the prior plan that implied 3 additional candidates already existed.*

