# Human Linguistic Review Handoff — Batak Toba Play

**Purpose:** Enable qualified reviewer to record decisions without inventing data.

## What corpus-derived/beta means
All 367 words + 80 sentences are `corpus-derived`/`beta-unreviewed` (statistical co-occurrence, not truth). `confidence` ≠ correctness.

## What to verify (per item)
- Batak text vs Indonesian meaning + alternatives `indonesianAlternatives`/`batakAlternatives`
- Type (word/phrase/sentence) correctness
- Theme/difficulty plausibility
- Known warnings: `medium_confidence`, duplicate labels

## Allowed decisions (`overrides.json`)
- `approve` → `human-reviewed` + `reviewer`, `reviewedAt` ISO, optional `approvedMeaning`/`approvedAlternatives`/`themes`/`difficulty`/`usageNote`
- `reject` → excluded before publish
- `revise` → stays candidate, note saved

## How alternatives work
Duplicates merged: `panangko→pencuri` with `batakAlternatives` etc. Approval can correct `approvedAlternatives`.

## How evidence recorded
Edit `data/reviewed/overrides.json` per `data/reviewed/README.md`:
```json
{"itemId":"word-f31f...","decision":"approve","reviewer":"Nama (afiliasi)","reviewedAt":"2026-08-30T00:00:00Z","reviewStatus":"human-reviewed"}
```
No PII beyond reviewer name.

## Workflow without auto-publish
1. `npm run review:validate` → must PASS
2. `npm run review:preview` → shows `items that would change`, `lessons eligible`, `sitemap delta` (no file written)
3. `npm run content:publish` (needs DB) → `npm run build && npm run verify:release`

Nothing auto-publishes; draft `6` stays until `human-reviewed` + `pool>=8`.
