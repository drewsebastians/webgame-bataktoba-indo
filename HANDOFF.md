# Resume handoff — 2026-11-04

## Latest checkpoint — 2026-11-04 04:58:22 UTC

- PUBLIC Webgame main HEAD is `51854a627da65de1a8cf5f60805d7a1280a9953e` after PR [#76](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/76). The available GitHub connector returns commit SHA and diff but not the commit tree SHA; shell Git transport cannot resolve `github.com`. No earlier tree SHA is reused. Current public checkpoint copies summarize private progress generically; Git history is unchanged.
- PR #76 exact-head Verify [#41773526587](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41773526587) passed 229 unit tests, 48 browser tests, 0 skipped, E2E smoke, performance budget, synthetic-fixture isolation, committed-dist drift, and 12 Lighthouse profiles. Accessibility scored 100/100 throughout; mobile performance was 97–99 and desktop 100.
- Verify uploaded `verified-public-site-dist-41773526587` (SHA-256 `be32af07211ce5813b6b4cb1dbd6a9cd1256ed4e20f4959f38d68cb66e10dedb`, expires 2026-11-18). Release checks found 0 published items, words, genuine phrases, or sentences and 0 warnings; synthetic markers are absent from public `dist/`.
- Cloudflare's PR check reported build success for PR head `aafdb368f1d915d01f8ab91da68112a6979b40bc` (build `f6b48884-904e-40f8-883a-f91978cea796`). This is branch-head provider evidence, not a post-merge main artifact readback. Main post-merge status and live homepage/manifest/`sw.js`/`robots.txt` readback remain NOT_VERIFIED.
- The public catalog remains empty/noindex. No private metadata, restricted corpus, or linguistic data was transferred. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A5 remains blocked_external; A9 history review remains approval-gated.
- Next: obtain the current main tree SHA and post-merge workflow/provider status from a supported GitHub surface; read back the live site and assets; continue A3 browser engineering independently of corpus readiness.


## Previous checkpoint — 2026-11-04 03:20 UTC

- PUBLIC Webgame main HEAD/tree is `3c908495f6ef4210aae39567896e1536ba10912b` / `560ac8f9af954769f8e5b85780937d7f56d4a20c` after documentation PR [#73](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/73). The application baseline remains PR #72's verified public artifact upload; the checkpoint change does not alter app code or published data.
- Exact-head Verify [#41763953814](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41763953814) and merged-main Verify [#41764746439](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41764746439) passed 229 unit tests and 46 browser tests (0 skipped), including synthetic-fixture isolation, E2E smoke, performance budget, committed-dist drift, and 12 Lighthouse route/profile audits. Accessibility was 100/100 throughout; mobile performance 98–99 and desktop 100.
- Merged-main CI uploaded `verified-public-site-dist-41764746439` (SHA-256 `63fa40492643a02aa52baceadaba6acf9575b73c564f5ccdca03d420e27041cb`, expires 2026-11-18). Release checks keep the catalog empty/noindex with 0 published items, words, genuine phrases and sentences; synthetic data remains absent from public dist.
- GitHub's Cloudflare Workers Builds check reports technical success for this main commit [build](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/00c22d58-0ac1-4676-8afd-3c5383757e16). Direct live homepage, manifest, `sw.js` and `robots.txt` readback remains NOT_VERIFIED: available page readers could not access the site and no compatible browser surface was available. A5 remains blocked_external.
- No Engine source-level metadata, restricted corpus, or language records entered this PUBLIC repository. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A9 historical Git review remains approval-gated.
- Next: continue A3 responsive browser UX, game/lesson flow, accessibility, PWA/offline, privacy/security and synthetic-only browser coverage while data collection continues separately. Retry direct live readback when a supported browser/network surface becomes available; keep the empty/noindex state.
## Previous checkpoint — 2026-11-03 16:06 UTC

- Webgame remains PUBLIC at main HEAD/tree `110ba77958250ed172c90f452c5bc1a2ac3baae7` / `28d58056166366f797099190646245b2f55663b8`. PR [#69](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/69) adds polite, atomic status live regions to dynamic offline/update banners and browser coverage for offline/reconnect across home, flashcards, dictionary and progress routes. Production published content remains unchanged and empty.
- Main Verify [#41669449187](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41669449187) passed: 229 unit tests, 46 browser tests, 0 skipped; smoke, performance budget, 12 Lighthouse mobile/desktop profiles, and committed-dist drift all passed. Accessibility was 100/100 on all 12 profiles; mobile performance was 97–100, desktop 100. Build cache version is `btp-3c56ddfc5809`.
- Site check: 0 published learning items (0 words, 0 genuine phrases, 0 sentences), 0 warnings; synthetic test fixture markers absent from public dist. No private/restricted linguistic data was added.
- Production deployment for this commit is NOT_VERIFIED from available provider/network evidence. The available live reader returned inaccessible for the homepage, service-worker script, and manifest; served artifact identity remains unverified. A5 stays blocked_external.
- Private data collection remains isolated; no Engine source metadata, restricted rows, or corpus content was copied into this public repository. DATA_READY=NO and PUBLICATION_READY=NO.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A3 remains active; A9 historical Git review remains approval-gated.
- Next: continue the highest-priority desktop/mobile browser UX and PWA work under A3; retry current production readback through a supported surface; preserve the empty/noindex catalog and synthetic-only test boundary.

## Latest checkpoint — 2026-11-03 09:47 UTC

- Webgame main HEAD/tree is cf5ee8f0e3c908c36df6216e9f6297f7e995532a / ac2c7fae66cb5bd6e14ab454c6c460d1f18671f4 after checkpoint-only PR [#67](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/67). The current feature baseline is PR [#66](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/66) at 094e666eb6b7656b0c43c3ef106a907be7b8d41d / b6775c3627e1a811c2af1f3d24323dae4c462f8c; it adds a due-first daily-practice CTA using public published items and local review state. The empty catalog displays no CTA; fixtures remain test-only.
- Main Verify [41613072560](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41613072560) passed 228 unit tests, 45 browser tests (0 skipped), smoke, performance budget, dist drift and 12 Lighthouse profiles. Accessibility was 100/100 throughout, mobile performance 97–100 and desktop 100. The site check reported 0 published items, words, genuine phrases, sentences and warnings; synthetic markers were absent from dist.
- Cloudflare Workers Builds main check [f512dbda-ef5b-428d-9498-38681af76f52](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/f512dbda-ef5b-428d-9498-38681af76f52) succeeded for the current main checkpoint. This confirms provider build/deployment success; direct live Home/Games/manifest/bundle readback remains UNVERIFIED and A5 remains open.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A3 continues; A5 direct readback remains open; A9 historical Git changes remain approval-gated.
- Next: continue 5–10 minute browser UX, accessibility, PWA and synthetic flow improvements under A3. Preserve empty/noindex production content and source separation. Retry direct production readback through a supported browser/network surface.

## Previous checkpoint — 2026-11-03 09:30 UTC

- Webgame is PUBLIC at main/tree 094e666eb6b7656b0c43c3ef106a907be7b8d41d / b6775c3627e1a811c2af1f3d24323dae4c462f8c. PR [#66](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/66) adds a due-first daily-practice action to Progress using only published public items and local review state; the empty catalog still shows no due CTA, and synthetic fixtures remain isolated in tests.
- Main Verify [41608443134](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41608443134) passed 228 unit tests and 45 browser tests (0 skipped), E2E smoke, performance budget, committed-dist drift and 12 Lighthouse route/profile checks. Accessibility was 100/100 throughout; mobile performance was 97–100 and desktop performance 100.
- Site check reported 0 published items, 0 words, 0 genuine phrases, 0 sentences and 0 warnings. Synthetic test markers were absent from public dist. Cloudflare Workers Builds [57813fc9-f60d-4b00-8e88-ecf45ff8f0d7](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/57813fc9-f60d-4b00-8e88-ecf45ff8f0d7) succeeded for commit 094e666eb6b7656b0c43c3ef106a907be7b8d41d. This confirms provider build/deployment success; direct live Home/Games/manifest/bundle readback remains UNVERIFIED, so A5 stays open.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A3 continues; A5 needs direct live readback; A9 remains approval-gated.
- Next: continue short-session UX, accessibility, PWA and synthetic-flow improvements under A3; attempt direct production readback through an available supported browser surface; preserve noindex/empty catalog until publication rights and quality gates pass.

## Previous checkpoint — 2026-11-03 08:26 UTC

- Webgame is PUBLIC at main/tree 7f31d0b366a77c87b492219f6eaac302da0da1be / 1dcff325642f3eabedc8dc83df6b17d6a60ce030. PR [#64](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/64) fixes Matching Pairs timer behavior: elapsed time updates while idle, toggling preserves keyboard focus, and switching mode or completing/resetting a board clears the interval and resets elapsed time as specified.
- Exact-head Verify [41599334104](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41599334104) and merged-main Verify [41600453685](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41600453685) succeeded. Main CI reported 228 unit tests and 44 browser tests passed, performance budget and smoke checks passed, and the committed build matched generated output. Lighthouse passed 12 mobile/desktop route checks: accessibility 100/100 throughout, mobile performance 97–100/100, desktop 100/100.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Cloudflare Workers Builds check [07da192a-2696-4864-a76b-0b278ea4e966](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/07da192a-2696-4864-a76b-0b278ea4e966) succeeded for main commit 7f31d0b366a77c87b492219f6eaac302da0da1be. This verifies technical build/deployment success. Direct live Home/Games/manifest/bundle readback is still unavailable, so served artifact identity remains UNVERIFIED and A5 remains open.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A3 remains active; A5 awaits direct production readback; A9 remains approval-gated.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Previous checkpoint — 2026-11-03 07:02 UTC

- The verified implementation/test baseline is PUBLIC Webgame main/tree 3f014dab861fd8ec80b863d2bdbe90738c4b3857 / ef84f9a8f76894b505d7b11c33021e9108c93792. PR [#62](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/62) adds a synthetic keyboard regression: Enter activates onboarding skip, focus moves to “Buka Games”, and Enter opens Games with the 10-question preference.
- Exact-head Verify [41592447568](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41592447568) and merged-main Verify [41593264058](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41593264058) passed. Main verified 228/228 unit tests, 44/44 browser tests with 0 skipped, release checks and dist-drift. Lighthouse accessibility scored 100/100 in all 12 route/profile checks; mobile performance was 98–100 and desktop 100. Performance budgets passed.
- Cloudflare Workers Builds production check [21b65c3c-dde3-4248-bb56-5e1ae23e8fad](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/21b65c3c-dde3-4248-bb56-5e1ae23e8fad) succeeded for main commit 3f014dab861fd8ec80b863d2bdbe90738c4b3857 (version 7c853194-46ff-4fea-8d87-5690c7c79d60). This is technical build/deployment evidence; direct Home/Games/manifest/bundle readback remains unavailable and served artifact identity remains UNVERIFIED.
- The public catalog is still empty/noindex: main Verify reported 0 published learning items, 0 words, 0 genuine phrases, 0 sentences and 0 warnings. PR #62 changed test code only; no corpus records or synthetic fixtures entered production output.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A5 live readback and A9 history-rewrite decision remain open; Engine acquisition remains gated on approved private storage and source-specific processing scope.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Previous checkpoint — 2026-11-03 01:37 UTC

- Webgame remains PUBLIC at main/tree cd9cc8ee8f38b99f18689b7b5af2edd91d03f431 / 6985914176031d0b14062e989d22e7376644d53b. PR [#60](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/60) keeps Home useful when onboarding is skipped and the browser reloads before a lesson; the persisted card explains the default 10-question session and links to Games.
- PR #60 exact-head Verify [41558847216](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41558847216) passed full checks, synthetic browser flow, axe, Lighthouse and committed-dist drift. Merged-main Verify [41559521523](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41559521523) passed on cd9cc8ee8f38b99f18689b7b5af2edd91d03f431. Local check, 228/228 unit tests, syntax checks, build and performance budget passed (JS 183,149/196,608 bytes; CSS 15,766/49,152). Local Playwright did not report a result; exact-head CI browser checks passed.
- Cloudflare Workers Builds production check [9eb0c864-d355-4b89-9601-10c0ab95ff17](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/9eb0c864-d355-4b89-9601-10c0ab95ff17) succeeded for merged main commit cd9cc8ee8f38b99f18689b7b5af2edd91d03f431. Direct live readback of Home, Games, manifest and the versioned bundle remained inaccessible through the available web and browser surfaces; served artifact identity remains UNVERIFIED.
- The PUBLIC catalog remains empty/noindex. PR #60 added no learning content, private records or test fixtures to production assets. Issue #2 remains closed. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.


## Previous checkpoint — 2026-11-03 01:00 UTC

- Webgame remains PUBLIC at main/tree 63f952f5f8fce3e82238f9bc6bb06dbda62eb8c4 / 41700e8faaa78105ae0e3511dd78e7806dcfab22. PR [#58](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/58) fixed the repeated onboarding prompt after a preference is saved and the home page is reloaded; the preference card and selected session size persist locally.
- PR #58 exact-head Verify [41555237413](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41555237413) passed the full release workflow, including unit tests, smoke, browser/axe, Lighthouse and committed-dist drift. Merged-main Verify [41555884624](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41555884624) passed on 63f952f5f8fce3e82238f9bc6bb06dbda62eb8c4. Local checks/governance, 228/228 unit tests, build and performance budget passed (JS 182,961/196,608 bytes; CSS 15,766/49,152); the local Playwright runner stalled before reporting a test result, while exact-head CI completed successfully.
- Cloudflare Workers Builds check [eee79225-1ab3-44bc-ad9a-d3d7ca5d97ae](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/eee79225-1ab3-44bc-ad9a-d3d7ca5d97ae) reports production build success for the merged commit. Direct fetches of the live home, Games and manifest were inaccessible; served artifact identity remains UNVERIFIED.
- The published catalog remains empty/noindex. Synthetic fixtures remain test-only; PR #58 added no published learning items or private data. Web issue #2 is closed as complete. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 responsive/browser UX, lesson flow, touch/keyboard navigation, PWA, accessibility, security and performance. Retry supported live artifact readback for A5. Keep historical Git-history rewrite A9 approval-gated.

## Previous checkpoint — 2026-11-02 10:21 UTC

- Webgame remains PUBLIC at main/tree bfcfe32f919e6cc995fb9db7eb5bedd97101a2d9 / 57bb3c1f1339e9bcbff07fd4c8fc3016d5a1c3ea; PR [#55](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/55) merged the progress-import hardening.
- The migration now bounds legacy IDs scanned and stored, ignores unsafe object keys, and validates imported item slugs. It adds no learner content, source data, or production fixtures.
- Exact-head Verify [41412050042](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41412050042) completed successfully. Local validation passed 226/226 unit tests, checks/governance, build and performance budget (JS 182,940/196,608 bytes; CSS 15,766/49,152). Local smoke did not reach server readiness in 20 seconds and local Playwright did not return within its runner window; CI is the browser release gate.
- Cloudflare reported successful provider build 3e1d1cb9-b3cc-419b-bfe1-3e49cde6916c for PR head 92e061e2a60913cb87ac4e333cb4658609486450. This is PR-head build evidence. The current connector did not return main push-triggered runs, and post-merge live artifact readback remains UNVERIFIED.
- Production catalog remains empty/noindex; the synthetic fixtures remain test-only and no private/restricted linguistic data was transferred. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 browser UX and isolated end-to-end coverage independently; retry read-only live home/Games/manifest/asset identity checks for A5. Keep historical Git-history rewrite A9 approval-gated.


## Previous checkpoint — 2026-11-02 07:23 UTC

- Webgame remains PUBLIC at runtime main `4b06c123fd1b409d7731771bc7cfe674381f39bb` / tree `4c44cdb14783b3422f3607ea6803f62816c3adb3`; code PR [#53](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/53) is merged.
- A3 hardening validates imported lesson slugs before accepting untrusted progress backups. The production build now rewrites module dependency paths before calculating immutable asset hashes; committed `dist/` URLs match the final served bytes. No learner content or source adapter data changed.
- Exact-head Verify [41404703403](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41404703403) and exact-main Verify [41405329501](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41405329501) both passed: 223/223 unit tests (0 skipped), check/build, E2E smoke, 41/41 Playwright tests, performance budgets and committed-dist drift. CI reports 0 published items and 0 warnings.
- Budget: JavaScript 181,987/196,608 bytes; CSS 15,766/49,152 bytes. Twelve Lighthouse route/profile audits passed; accessibility was 100 throughout; mobile performance was 97/99/98/99/99/100 and desktop 100 on all six routes.
- Cloudflare Workers bot reported build `1d23f48b-ffe9-4651-8998-1f19da996034` successful for PR head `9775e1e50d1e0dcd29589841e600c67ea27c55cc`. This is provider build evidence. Live artifact readback remains UNVERIFIED; the available network fetch could not access the candidate Pages/Workers hostnames.
- Production learning catalog stays empty/noindex. Synthetic fixtures are isolated to tests; the merged tree adds no synthetic, private or restricted linguistic content. Data/publication/learning gates remain separate from engineering success.
- Readiness: ENGINEERING_READY=YES for the merged A3 hardening and exact-main CI; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

### Resume actions

1. Continue the highest unblocked browser engineering slice; keep production content empty/noindex and all automated linguistic fixtures test-only.
2. Keep A5 live readback UNVERIFIED until a directly accessible production host and served artifact are inspected; retain the successful provider build as technical evidence only.
3. Continue private Data Engine source discovery and rights assessment independently. Do not transfer private/restricted linguistic data into this public repository.
4. Re-fetch both repository refs, visibility, Issues, PRs, Actions and private run pointer before the next batch; use exact expected SHAs and leave historical public Git history unchanged.


## Latest checkpoint — 2026-11-02 05:17 UTC

- At checkpoint start, Webgame is PUBLIC at main/tree 99d5b2069a358c80dbd83648efb6f0182fc3b4dc / f11b1ecd6f9782c2bba149674bdd773f7363441a; PR #51 is merged. Its feature head and its documentation-refreshed head passed exact-head Verify [41390699539](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41390699539) and [41391402350](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41391402350). Exact-main Verify [41391810426](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41391810426) also passed on the main SHA above.
- The homepage “Latihan Harian” CTA now opens games/?practice=daily; Games consumes the parameter and starts the existing due-first queue. The synthetic browser test seeds one due fixture and verifies it appears first. Verified runs passed 221/221 Node tests (0 skipped), smoke, performance budget, 41/41 Playwright tests, committed-dist drift and 12 Lighthouse audits. Accessibility was 100/100 on every audit; mobile Performance was 98/98/98/99/99/100, desktop was 100 on all six routes.
- Cloudflare Workers Builds reported a successful production build 384bacaa-f4ca-4be0-a83a-03387d19f2d2 for PR #51 head 3a2cd29081101e646a5b78335220683d86de4f75. This confirms a provider build, while direct live Pages readback remains UNVERIFIED because this environment cannot resolve the Pages host.
- Production catalog remains empty/noindex: 0 learning items, words, genuine phrases and sentences. Synthetic fixtures are test-only; no private/restricted linguistic data entered public source or dist. Issue #2 is closed.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

### Resume actions

1. Run exact-head verification for this documentation-only checkpoint PR and merge only if it passes with base 99d5b2069a358c80dbd83648efb6f0182fc3b4dc unchanged.
2. Verify the resulting main SHA/tree and provider build after the docs merge. Keep live Pages readback unverified until the artifact is fetched and checked from a network that resolves the host.
3. Continue A3 responsive UX, lesson/game flow, PWA/offline, accessibility, privacy and security work with synthetic-only fixtures.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Latest checkpoint — 2026-11-02 04:54 UTC

- At checkpoint start, Webgame is **PUBLIC** at main/tree `ca1ec4ad2d0fd28c04109ff1fb587ad3a69c376d` / `c1e4657a57a7868dbd0bb5b3c9d4d1e8faeacbe6`. PR [#50](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/50) is merged; exact-main Verify [41387329437](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41387329437) passed.
- PR [#51](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/51) fixes the homepage daily-practice route: the CTA opens `games/?practice=daily`, Games consumes the query and starts the existing due-first queue, and an isolated synthetic browser test checks the due item. Feature head `c69f6ac272417fe4c583f2d6da7894c89a0acf92` passed exact-head Verify [41390699539](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41390699539): 221/221 Node tests (0 skipped), E2E smoke, performance budget, 41/41 Playwright tests, committed-dist drift, and 12 Lighthouse audits. Accessibility was 100/100 on all audits; mobile Performance was 98/98/98/99/99/100 and desktop was 100 on all six routes.
- This PR includes a checkpoint-only documentation refresh. Its resulting exact head must pass Verify before PR #51 is merged against the unchanged base.
- Cloudflare Workers Builds reported successful build `817a713d-4ac7-4193-ab38-f5b394116313` for PR #50 head `a0a604b60093ab608a1c9a98952c6563d189cb9e`. This is provider-build evidence for that checkpoint; direct live Pages readback remains **UNVERIFIED** because this environment cannot resolve the Pages hostname.
- Production catalog remains empty/noindex (0 learning items, words, genuine phrases and sentences). Synthetic fixtures remain test-only; no private/restricted linguistic data is in the public tree or build artifacts. Issue #2 is closed.
- Readiness: `ENGINEERING_READY=YES`; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.

### Resume actions

1. Wait for exact-head Verify on the documentation-refreshed PR #51 branch; merge only if it passes and the base is still `ca1ec4ad2d0fd28c04109ff1fb587ad3a69c376d`.
2. After merge, verify the new main SHA/tree, exact-main Actions result, and Cloudflare production build; keep live readback unverified until the served artifact is inspected from a resolvable network.
3. Continue A3 responsive UX, lesson/game flow, PWA/offline, accessibility, privacy and security work with synthetic-only fixtures.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Latest checkpoint — 2026-11-02 03:52 UTC

- Webgame remains **PUBLIC** at main/tree `58d45ce5ed7bbb45fd601a0b7189712883ea1a07` / `43e33e64cf5e35f3df40e2492a00054250f50fc7`. PR [#49](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/49) merged as `58d45ce5ed7bbb45fd601a0b7189712883ea1a07`; it makes the local 5/10/20-question onboarding preference apply to Games and migrates v1 local preferences.
- Exact-head Verify [41383644095](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41383644095) and exact-main Verify [41384190761](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41384190761) passed. Main evidence: 221 unit tests (0 skipped), E2E smoke, performance budget, 40 browser tests, committed-dist drift, and 12 Lighthouse route/profile audits. Accessibility scored 100/100 on all audits; mobile Performance scored 98/98/98/99/99/100 and desktop scored 100 on home, angka, games, flashcards, dictionary and progress.
- Cloudflare Workers Builds reported a successful production build `5f510877-edb8-4856-9ee7-7060e68085bd`. This verifies the provider build. Direct live readback is still **UNVERIFIED**: the web connector could not open Pages, and both Node and PowerShell fetches failed because the current environment could not resolve the Pages hostname.
- Production catalog remains empty (0 learning items, words, genuine phrases and sentences); empty topic pages remain noindex. Synthetic browser fixtures are absent from public dist, and no private linguistic data was transferred.
- Readiness: `ENGINEERING_READY=YES`; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.
- Issue [#2](https://github.com/drewsebastians/webgame-bataktoba-indo/issues/2) is closed. No public PR is open at this checkpoint.

### Resume actions

1. Retry a read-only live fetch of the home page, Games, manifest and versioned JS bundle when a network path can resolve `pages.dev`; keep direct readback unverified until served asset identity and public-data isolation are confirmed.
2. Continue A3 responsive UX, game/lesson flow, offline browser, privacy and security engineering with synthetic-only fixtures.
3. Keep the public catalog empty/noindex until item-level rights, provenance, quality and publication gates pass; continue the private data track independently.
4. Do not rewrite public Git history; A9 remains blocked pending explicit approval.


## Previous checkpoint — 2026-11-02 01:26 UTC

- Application main is at `3ff59a4e55213b6031a488d2721301cc3afc4d23` / tree `788eeb94f8a36288d36a7c41eee061dfd3aeb6a4`. PR [#47](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/47) merged the progress-import safety and Windows Lighthouse runner fix. Exact-head Verify [41371579464](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41371579464) and exact-main Verify [41372157370](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41372157370) passed.
- Verification: 221/221 unit tests, E2E smoke, 39/39 Playwright tests, performance budgets (180,368/196,608 JavaScript bytes; 15,766/49,152 CSS bytes), committed-dist drift, and 12 Lighthouse route/profile audits. Accessibility was 100/100 on all audits. Mobile performance: home 98, angka 98, games 98, flashcards 99, dictionary 99, progress 100; desktop 100 on all six routes.
- The progress export/import now shares a 1 MiB cap; imports validate date/mode/count fields and retain only safe session-summary fields. The Lighthouse runner resolves Windows npx paths with Windows path rules and runs without a shell.
- Cloudflare Workers Builds reported successful production build `d70773e9-3943-414c-a941-4d7614dda7f2` for this main commit. This is provider build evidence; direct live Pages readback remains **UNVERIFIED**.
- The public catalog remains empty: 0 published items, words, genuine phrases, and sentences. Pages with no eligible content remain noindex/empty; synthetic fixtures stay isolated from public artifacts. No private linguistic data was transferred.
- Readiness: `ENGINEERING_READY=YES`; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.

### Resume actions

1. Continue responsive browser UX, game/lesson flow, PWA/offline behavior, privacy and security work independently of corpus readiness.
2. Preserve empty/noindex production data and synthetic-only automated coverage.
3. Keep Cloudflare provider build and direct live-page readback as separate checks; retain **UNVERIFIED** until the served artifact is read directly.
4. Keep public and private repositories separated; transfer no source record without an explicit, verified publication gate.


## Previous checkpoint — 2026-11-01 16:41 UTC

- Webgame is PUBLIC at checkpoint code main/tree `efbe05226272d364ca3626ebebe4749523e6ec0b` / `fddeb9720ec43d736085fc3f9f91700d537979b6`; PR [#45](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/45) is merged and Issue [#2](https://github.com/drewsebastians/webgame-bataktoba-indo/issues/2) is closed.
- Exact-PR Verify [41322006701](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41322006701) and exact-main Verify [41322447587](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41322447587) succeeded. Main run: 216 unit tests, 38/38 Playwright tests, smoke, JS/CSS budgets, 12 Lighthouse audits, and committed-dist drift passed. Budgets: 178,856/196,608 JS bytes and 15,766/49,152 CSS bytes.
- Lighthouse Accessibility scored 100/100 across all 12 route/profile audits. Mobile Performance: home 99, angka 98, games 98, flashcards 99, dictionary 99, progress 100; desktop: 100 on all six routes.
- Cloudflare Workers Builds reported successful production build `21a991ee-46bd-4a20-a4e7-004700e04edb`. This verifies provider build status. Direct live-page readback remains UNVERIFIED because the available browser/web surfaces could not inspect the served artifact.
- Current public published catalog remains empty: 0 learning items, words, genuine phrases and sentences. Public source/dist contain no synthetic fixtures or private corpus. Topic pages remain noindex/empty until rights, provenance and quality gates pass.
- Historical exposure audit is corrected in [the public audit](docs/PUBLIC_REPOSITORY_DATA_EXPOSURE_AUDIT_2026-10-31.md): corpus-derived JSON exports were already present in the 2026-07-04 root commit; successful GitHub Pages run 28711125732 uploaded repository root at commit 042681827af650b6f983ffff0a6eefc39115039, so old artifact exposure is possible. Current tree is contained; history and legacy artifact retention were not rewritten or directly verified.

## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES | Main Verify 41322447587 passed unit, smoke, browser/axe, budgets, 12 Lighthouse audits and committed-dist drift. |
| DATA_READY | NO | Published catalog has 0 learning items, words, genuine phrases and sentences. |
| PUBLICATION_READY | NO | No record-level publication permission or public scope authorization. |
| LEARNING_READY | NO | No real content is published; synthetic tests do not establish learning readiness. |
| MONETIZATION_READY | DEFERRED | Separate future decision; not current work. |

## Next

- Continue A3 UX/PWA/accessibility/security work; the latest Lighthouse floor is 98 mobile and 100 desktop.
- Preserve empty/noindex public content and synthetic-only coverage.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Keep direct live readback marked UNVERIFIED.
- Do not rewrite public Git history without explicit owner approval; A9 tracks that decision.

## Previous checkpoint (superseded: 2026-11-01 14:31 UTC)

### Archived checkpoint — 2026-11-01 14:31 UTC

1. Webgame is PUBLIC at main `00f8ab0049cbff8585cd554438166f4531f04c39` / tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`; PR #43 merged and Issue #2 closed.
2. PR [#43](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/43) merged as `00f8ab0049cbff8585cd554438166f4531f04c39` (tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`); Issue #2 is closed. Exact-PR Verify [41313831063](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41313831063) and exact-main Verify [41315341826](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826) both passed. The merged-main run passed 216/216 unit tests (0 failed/skipped), E2E smoke, 37/37 Playwright/axe browser tests, JavaScript/CSS budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse report artifact: [13087012406](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826/artifacts/13087012406).
3. Accessibility is 100 across all routes/profiles. Lighthouse Performance is mobile 98/92/99/99/99/100 and desktop 100/99/100/100/100/100. JavaScript/CSS budgets are 178,590/196,608 and 15,766/49,152 bytes.
4. Cloudflare Workers Builds check [124874167176](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/124874167176) succeeded for production build `bf5b6270-f706-4df7-a3a8-9112aff78a1f`, version `a070d6b6-7be0-4117-b44a-01acd875d5d3`.
5. Production remains empty/noindex: site check reports 0 published learning items (0 words, 0 genuine phrases, 0 sentences) and 0 warnings. Synthetic data remains isolated to browser tests; no private/restricted language data entered public source or dist. Direct live-page readback remains UNVERIFIED.
6. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

## Next

1. Continue measured route payload/CLS work on A3; maintain isolated synthetic game testing.
2. Re-fetch current refs and exact check runs before merge/deploy.
3. Keep published content empty/noindex until rights and quality gates pass.
4. Retry direct live readback when a usable provider/browser surface is available.
5. Keep website and private data collection moving independently, with no private-content transfer.

## Archived handoff records (preserved; superseded by the current instructions above)

## Current checkpoint

1. Webgame is PUBLIC at base main `3c5d3946c3ef3dd0eea756fbc8235f047ce39c76` / tree `5f2c37f38e3232967827f52b8da93e91e1937eca`. PR #39 (`3eeea62d35ad22914e3ab7cbfeaebb381293c421`) is open and checks are pending.
2. PR #39 changes Lighthouse diagnostics to print metrics and the top three measured opportunities below 95 Performance; unit tests cover scores 90, 93, 94.9, the threshold, and invalid input. The previous flashcards and dictionary mobile scores were below the old <90-only diagnostic condition.
3. Base main Verify [41296159704](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41296159704) passed 215/215 unit tests, E2E smoke, 36/36 Playwright tests, budgets, 12 Lighthouse audits and committed-dist drift. Accessibility scored 100 across route/profile audits. Mobile Performance was 98/94/98/90/93/100 and desktop 100/99/100/100/100/100 for home/angka/games/flashcards/dictionary/progress.
4. Exact-main Workers Build succeeded for base main (build `3f906f04-f715-44c1-8e11-476bf5ed5235`, version `31d30c5e-8144-4fdb-907c-50f651e7df5a`). Direct Pages readback remains unverified; do not claim independent inspection of the running artifact.
5. Public learning content remains empty/noindex: 0 items, words, genuine phrases, sentences and warnings. Synthetic fixtures are test-only; no restricted content was transferred; Git history remains unchanged.
6. Keep engineering, data, publication, learning and monetization readiness as separate gates, each with its own evidence.

## Next

1. Await PR #39 exact-head Verify and Workers Build results; inspect diagnostic metrics/opportunities for the low-scoring mobile routes.
2. Implement and measure a focused improvement only where the report shows a concrete opportunity; rerun relevant checks and compare scores.
3. Retry direct Pages readback when an accessible targetable provider/browser surface is available; keep production status UNVERIFIED until readback.
4. Keep synthetic fixtures isolated; verify source rights and provenance before any production publication.
5. Re-fetch current refs and checkpoints before each new batch.


## Archived handoff records (preserved; superseded by the current instructions above)

## Current checkpoint

1. Webgame is PUBLIC at main `84c05624f959f235d16a790d3c479e74f68b9564` / tree `e67bd8ecbc0651afb37899a801f3b25195d35028`. PRs #35, #36 and #37 are merged; PR #37 corrected the README's CI step order.
2. Exact-main Verify run [41295166507](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41295166507) passed 215/215 unit tests (0 failed, 0 skipped), E2E smoke, 36/36 Playwright tests, budgets, 12 Lighthouse audits and committed-dist drift; artifact [13078943622](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41295166507/artifacts/13078943622).
3. Accessibility scored 100 across all route/profile audits; mobile Performance was 98/92/98/90/93/100 and desktop 100/99/100/100/100/100 for home/angka/games/flashcards/dictionary/progress. JS/CSS budgets were 178,003/196,608 and 15,698/49,152 bytes.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
5. Public content remains empty/noindex: 0 items, words, genuine phrases, sentences or warnings. Synthetic fixtures are test-only; no private/restricted content moved to public; Git history remains unchanged.
<!-- Cross-repository details omitted. -->
7. Readiness: ENGINEERING_READY=YES for exact-main browser CI; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

## Next

1. Continue A3 responsive browser work and investigate mobile flashcards/dictionary performance.
2. Retry live Pages readback when an accessible targetable provider/browser surface is available; keep production status UNVERIFIED until readback.
3. Keep public data empty/noindex and synthetic fixtures isolated.
<!-- Cross-repository details omitted. -->

## Archived handoff records (preserved; superseded by the current instructions above)


## Archived handoff records (preserved verbatim; superseded by the current instructions above)

# Resume handoff — 2026-10-31 16:25 UTC

<!-- Cross-repository details omitted. -->
2. The last verified application-code checkpoint was webgame merge commit `94b7f6a21edec58811e6eddcceaea4a595802064` / tree `70b14cf98552972d869feb431d64b4d4bc9fc07a`. PR #13 is merged; Issue #2 remains open.
3. Verify #73 / 41218051252 passed on that merge commit, with full verification and committed-dist drift. PR Verify #71 provides exact counts: 202/202 unit (0 skipped), 35/35 browser, smoke, performance budget, 12 Lighthouse audits and drift; latest main artifact is `13048927117`.
4. Cloudflare Workers Builds reported successful deployment for the merge commit (build `2a722185-13a7-4c6d-aa94-2241745ba4aa`). Direct Pages readback remains unverified: the web reader could not open the configured hostname and execution-environment DNS lookup failed.
5. Production still has 0 items, words, genuine phrases and sentences. Synthetic fixtures are test-only. No restricted/private data was added; historical Git objects remain unrevised.
6. Next: continue Issue #2's synthetic lesson-to-dictionary journey, touch/keyboard/mobile coverage and fail-closed adapter tests. Develop independently of corpus readiness and preserve noindex/empty states.

## Historical handoff archive

10. A3 performance gate is implemented on `codex/2026-10-31-browser-performance-checkpoint-a3`: it checks production JS/CSS sizes after build and has threshold unit coverage. Baseline is 129,845 JS bytes across 14 files and 15,217 CSS bytes in 1 file; limits and exact meanings are in `docs/PERFORMANCE_BUDGET.md`. PR #5 is open at head `2e367604b28beaf9e64890909d50aeef583b8960`; Verify run #46 (`41194897354`, job `124518995179`) passed 196/196 unit, E2E smoke, 33/33 browser, asset budget, release prerequisite, and dist drift checks. The Lighthouse prerequisite is not a Lighthouse score audit. Merge after the checkpoint update passes, then verify Cloudflare build and retry direct Pages readback.

11. A3 is merged: public main is `ffe009e9de10a1ddd144bb0a5d51be746f81b5cc` (tree `0735930506c111d4690fbddef886246452a65837`). Verify run #48 `41195989468` passed 196 unit tests, E2E smoke, 33 browser tests, budget, release prerequisites and dist drift. Cloudflare production build `de67c3c7-609a-437e-8e76-f4d7ccd26705` succeeded (version `cb3c2fd0-8648-4a89-b6bf-e7d766c69553`). Live readback through the web connector failed for home, games, robots.txt and manifest; do not claim the running site was independently inspected. Next: full Lighthouse score and live readback, then continue PWA/security/accessibility work.

## Resume checkpoint — 2026-10-31 12:03 UTC

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
2. Public main is `ce3338f0ac03fd56601db29c361bb8927b6ca247` / tree `4fb92b1df1cfcf31c07ee9932a524e2e43e7f580`. PR #7 merged. Verify run #52 / 41199134008 passed 200/200 unit (0 skipped), 33/33 browser, E2E smoke, asset budget, Lighthouse, and dist drift. Site check remains at zero published words/phrases/sentences.
3. Main Lighthouse scores: mobile 99 Performance / 100 Accessibility; desktop 100 / 100. Reports are artifact ID `13041633182`, `lighthouse-reports-41199134008`. Cloudflare Workers Builds production check passed for build `14592e21-73bd-40cc-b629-99fc4b58c422`. Direct live readback of home, games, robots and manifest remains inaccessible through the available web connector; do not describe the live artifact as independently verified.
4. Public content remains empty and noindex. Historical corpus objects remain in old Git commits; no history rewrite was performed. No private/restricted or synthetic language content was transferred to public.
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->


## Current resume checkpoint — 2026-10-31 12:51:22 UTC

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
2. Public webgame remains PUBLIC at main `d5dc0a44786b4b12c20a4586a88dfa85406a68f5` / tree `26b3d94de0742ecca8759bd0ebe0a5caf4a465ff`; PR #9 merged. Issue #2 remains open.
3. Main Verify [#56 / 41202127852](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41202127852) passed 201/201 unit tests (0 skipped), 33/33 browser tests, six-route mobile/desktop Lighthouse, and dist drift. Site data check remains at 0 items, 0 words, 0 genuine phrases and 0 sentences.
4. Lighthouse Performance scores: home 98/100 mobile, 100 desktop; angka 92/99; games 98/100; flashcards 88/100; dictionary 92/100; progress 87/78. Accessibility was 100 on all audits. Artifact `13043018067`; desktop progress is the next performance inspection.
5. Cloudflare Workers Builds reports production build `aefb2216-8994-4e29-931d-4966a308b4aa` successful. Direct live-page readback was not accessible via the available web connector; do not claim independent production readback.
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->
8. Next public work: inspect the progress desktop report; continue PWA/offline, privacy/security, responsive and accessibility tasks; retry live readback. Continue private work independently without moving source details or language data to public.

## Current resume checkpoint — 2026-10-31 13:41 UTC

1. Public main remains `1af06840fbe0098f2737720a8ab0d5c8b0412bfc` / `4e7a754b97e4111c3fef3cd43b661588d11bce7a`. PR #11 code/dist head `2c412b1f940e1548cb34f0e54a359d9740531a08` passed Verify #60: 201/201 unit tests (0 skipped), 34/34 browser tests, E2E smoke, performance budget, 12 Lighthouse audits, and dist drift. Current docs commit will be validated by its own CI run.
2. Lighthouse artifact `13043638906`, `lighthouse-reports-41206008614`: home 98/100 mobile/desktop; angka 94/99; games 98/100; flashcards 89/100; dictionary 92/100; progress 89/78. Accessibility was 100 across routes/profiles. Desktop progress remains 78; these are lab measurements.
3. Cloudflare Workers Builds reported PR candidate build `67dbfb92-aa03-4567-aa85-46477b82ba28` / version `12feb4c9-2b57-48da-a646-46aa7c01a382` successful. The live Pages artifact has not been independently read back.
4. Public content remains empty/noindex: zero items, words, genuine phrases and sentences. No private or synthetic language data is in dist. Historical public Git objects remain; no history rewrite.
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->
