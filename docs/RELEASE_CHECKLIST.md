# Release Checklist — Batak Toba Play

**Required at every release per Blueprint §24.2.** This checklist satisfies the Lighthouse/manual operational gate that is not fully automatable in CI without credentials.

## Automated (via `npm run verify`)
- [ ] `npm ci`
- [ ] `npm run verify` (check + build + unit + e2e + browser + axe + drift) — must be green
- [ ] `npm run build` twice → `git diff --exit-code -- dist` clean (idempotent)
- [ ] `node tools/lighthouse-check.mjs` — PASS
- [ ] `npm run test` count matches `BLUEPRINT_COMPLIANCE_MATRIX.md` (now 154)
- [ ] `npx playwright test` count matches matrix (now 32)
- [ ] No `dist` leakage (`tests/data/artifact.test`)

## Manual / Operational (requires human/credentials)
- [ ] **Lighthouse** (lab): `npm run build && python -m http.server 4178 --directory dist` then `npx lighthouse http://127.0.0.1:4178/ --view` — record Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95, PWA installable
- [ ] **260px / 320px reflow**: visually verify no horizontal scroll at 320 CSS px, 200% zoom, reduced-motion
- [ ] **Broken links**: `npm run check` covers internal; externally verify `github.com/drewsebastians/webgame-bataktoba-indo/issues/new` reachable
- [ ] **Data report**: inspect `data/reports/data-quality-report.json` stageCounts vs published
- [ ] **Service worker**: change `dist/sw.js` `CACHE_VERSION` bump seen in network, old cache purged, update notification appears
- [ ] **Privacy**: `privacy/index.html` matches `progress.js`, `analytics.js` (default OFF), `ads.js` (OFF)
- [ ] **Ad placement**: if AdSense later enabled, verify `ALLOWED_PLACEMENTS`, `ads.txt`, no auto-refresh, reserved size, no placeholder
- [ ] **Domain**: `wrangler.toml` `pages_build_output_dir = dist` and Cloudflare Pages deploys `dist/` (not repo root)
- [ ] **Release tag**: `git tag -a vX.Y.Z -m "release"` and push tag

*If any manual item is not yet demonstrated for this release, mark the operational readiness as `OPERATIONAL_NOT_YET_PROVEN` in the traceability doc.*
