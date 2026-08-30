# First Lesson Unlock Plan — Batak Toba Play

**Safest candidate (low cultural risk, clear provenance):** `angka` (Angka Batak Toba).

## Why angka
- Smallest gap to threshold: `pool 5 / 8 need 3` (vs keluarga 0 need 8, sapaan 0 need 8)
- Review rollup currently `corpus-derived-beta`, provenance Bible corpus co-occurrence (high/medium confidence)
- Beginner-friendly, low cultural sensitivity vs kinship/adat
- Supplements available in `data/candidates/lesson-drafts.json:angka` 8 drafts (`sada, dua, opat, lima, walu, sampulu, saratus, saribu`) — but **not** used for unlock; need corpus items, not drafts.

## Exact IDs (current published pool for angka)
`word-0880cf2284`, `word-141862f84e`, `word-3991eb4b1f`, `word-92add2f91e`, `word-cda58024a5` (5)

**Minimum review batch:** 3 additional `human-reviewed` words that are angka-themed (e.g., from `data/candidates/word-pairs.json` angka candidates not yet in published, or correction of existing 5).

## What reviewer must verify
For each of 3: Batak numeral vs Indonesian (`sada→satu` etc. if candidate), alternatives, no duplicate visible label, usage note optional.

## What would become public
- `data/published/lessons.json` `angka` `published` with `8` `itemIds` + `reviewRollup` maybe `mixed`/`human-reviewed` if 3 approved
- `data/published/topics.json` `angka` `poolItems 8` + `pageStatus public-indexable` + `sitemap` `+1` with `<lastmod>` + `LearningResource` with `dateModified` from `site.config`
- Topic page `learn/angka/` would gain mini-quiz eligibility (≥4 already) and lesson link, correction still.

## Tests after approval
`npm run review:validate && npm run review:preview && npm run content:publish (DB) && npm run verify:release`

*Do not make linguistic judgments here; reviewer decides.*
