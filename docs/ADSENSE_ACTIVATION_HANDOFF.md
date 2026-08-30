# AdSense Activation Handoff — Batak Toba Play

## Component readiness (code) — READY
`ads.js` disabled by default, validates `ca-pub-16digits`, consent-gated, `ALLOWED_PLACEMENTS`, single load, CLS reserve, no `Ruang iklan`, `ads.txt` generator rejects placeholder.

## Before activation (external)
- [ ] Final domain stable (see SEARCH_CONSOLE)
- [ ] Substantive reviewed content (≥1 published lesson with human-reviewed core, topic pool ≥8 substantive)
- [ ] `privacy` final + consent (CMP if required by law)
- [ ] Valid Publisher ID `ca-pub-XXXXXXXXXXXXXXXX` → set `SITE_CONFIG.adsensePublisherId` + `tools/site.config.json`
- [ ] `npm run build:ads-txt` → `ads.txt` (not `ads.txt.example`) + commit + deploy `dist/ads.txt`
- [ ] Placement audit (homepage after hero, article mid, after lesson/summary, footer — never between question/options, grid, mistake review, pre-roll, sticky covering content, button-faking)
- [ ] Internal `npm run verify:release` green
- [ ] Apply via AdSense site review (external, Google)

**Dry-run validation:** `node -e "require('./assets/js/ads.js')"` fails without ID; `tools/generate-ads-txt.mjs` must exit 0 only with valid ID.

Do not activate ads today; component stays OFF.
