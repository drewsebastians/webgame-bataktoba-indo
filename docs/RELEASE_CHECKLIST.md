# Release Checklist — Batak Toba Play

**Required at every release.** This checklist satisfies the Lighthouse/manual operational gate that is not fully automatable in CI without credentials.

## Automated CI Gates (via `npm run verify:release`)
- [ ] `npm ci`
- [ ] `npm run check` — site + governance (links, schema, SEO, sitemap, metadata, no human-review deps)
- [ ] `npm run build` — deterministic dist artifact
- [ ] `npm run test` — unit/data tests (193 tests)
- [ ] `npm run e2e` — smoke test against built dist
- [ ] `npm run test:browser` — Playwright + axe (33 specs, 0 serious/critical)
- [ ] `npm run lighthouse:check` — release gate deterministic (dist/_headers/checklist)
- [ ] `git diff --exit-code -- dist` — drift gate (committed dist in sync)

## Deployment Verification (post-CI)
- [ ] Cloudflare Pages deploys `dist/` (not repo root) — verify in Pages dashboard
- [ ] Production URL serves expected content (homepage, games, dictionary, learn, trust pages)
- [ ] Response headers: CSP strict, `X-Frame-Options: DENY`, cache policies correct
- [ ] `robots.txt` and `sitemap.xml` accessible at production origin
- [ ] Service worker registers, cache version matches build hash

## Owner/External Checks (require credentials/access)
- [ ] **Custom domain** (if configured): DNS resolves, HTTPS valid, canonical tags match
- [ ] **Search Console**: property verified, sitemap submitted, indexable pages discovered
- [ ] **Analytics provider** (if activated): events fire correctly, no PII, consent gate works
- [ ] **AdSense** (if activated): ads load on allowed placements, `ads.txt` valid, no blank placeholders
- [ ] **CMP** (if legally required): consent UI functional, blocks third-party without consent

## Optional Monetization/Audio Gates
- [ ] Licensed audio manifest valid, files present, playback works (if listening mode enabled)
- [ ] AdSense account in good standing, no policy violations

## Release Tagging
- [ ] `git tag -a vX.Y.Z -m "release"` and push tag

**Note:** Test counts (unit/browser) are verified by CI — not hardcoded here. CI failure on count mismatch is the gate.

*If any manual item is not yet demonstrated for this release, mark the operational readiness as `OPERATIONAL_NOT_YET_PROVEN` in the traceability doc.*