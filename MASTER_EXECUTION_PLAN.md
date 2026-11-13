## Latest execution checkpoint — 2026-11-13 07:56 UTC (PR #190 merged; A3 continues)

- Webgame is PUBLIC. Current main HEAD is `50bb4549eb98d7b79c7ba69055f704e8c7e9de42` after PR #190. The GitHub connector returns commit SHA but not the associated tree object SHA, so this checkpoint records the verified head only.
- PR [#190](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/190) adds 44px touch-target assertions to the isolated synthetic 320px due-flashcard review. It measures mobile navigation, deck/topic filters, shuffle, card flip, and review/navigation controls. It changes tests only; the published catalog and production behavior are unchanged.
- Exact-head Verify [#43380226941](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43380226941) passed 241/241 unit tests and 84/84 Playwright tests (0 skipped), build/smoke/performance/dist-drift/artifact checks, and 12 Lighthouse audits. Accessibility scored 100 on all routes; mobile performance ranged 97–100 and desktop was 100.
- Cloudflare PR preview build `4e5195f1-d45b-485f-a694-0796e54d2ef5` succeeded for PR head `ffbc8e5b`. A Cloudflare production build for merged main `50bb4549` is not verified. A direct live readback was attempted but browser access was unavailable; do not claim the served production artifact was inspected.
- Production catalog remains empty/noindex; synthetic fixture data remains isolated from public artifacts; no private Engine source metadata or learner data was copied here. Issue #2's synthetic-adapter acceptance is closed; A3 responsive accessibility and browser engineering remain active. A5 remains `blocked_external`; A1/A9/A12 stay approval-gated with no Git-history rewrite.
- Readiness: `ENGINEERING_READY=YES` for the validated browser test batch; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.
- Next: continue independent responsive desktop/mobile UX, keyboard/touch, PWA/offline, privacy/security and game-flow work. Select the next measured browser gap, preserve isolated synthetic fixtures and noindex empty states, and verify production only when provider/live evidence is available.

## Latest checkpoint — 2026-11-13 06:19 UTC (PR #188 post-merge verified)

- PUBLIC main is de9722a394f529150b93cefed609fca24c329417 / tree 642109b391acef7b3f75880a3dfb66a7610dd5f2. PR #188 merged from expected head 3a4e27eeb2d19b910e7c8026dc65bceee11702e2. It adds a synthetic-only browser regression for focused-card 1/2/3 rating keys, local progress/scheduling semantics, and focus as the next card appears; no runtime or published data changed.
- Exact-head Verify #43376001221 and post-main Verify #43377158957 passed: 241/241 unit tests, 84/84 browser tests, 0 skipped; build, site/governance, smoke, performance budget, committed-dist drift and artifact upload passed. All 12 Lighthouse route/device audits passed: Accessibility 100; mobile Performance 97–99; desktop Performance 100. Exact-head Workers preview and production-main Workers build succeeded.
- Cloudflare merged-main build 3b0e8833-339c-487d-96fb-0acae2f0447d / version 28b4dddd-feea-492f-ba95-cd66135d43dd succeeded. This confirms provider build/deployment status only. Direct live-page readback was attempted and the available web reader cannot access the host; A5 remains blocked_external and served content NOT_VERIFIED.
- Public catalog remains empty/noindex (0 published items); synthetic test data and private Engine records are absent from production artifacts. A1/A9/A12 remain blocked_approval; no Git history was rewritten. Webgame issue #2 is closed; the live Data Engine issue #2 remains its separate work queue.
- Readiness: ENGINEERING_READY=YES for the keyboard-rating regression and release pipeline; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue A3 desktop/mobile browser work independently of the corpus.

## Latest checkpoint — 2026-11-13 05:45 UTC (PR #186 post-merge verified)

- PUBLIC GitHub main is 44eb4c5d02b551a2f509afa90e01e9745e390e6e / tree fb8c4dcfc9bfe972cf3adf4586fcb28dabb23412. PR #186 merged from expected head e0a5b51dbc6ce092ba7468a58a77fe92e20bca5d after exact-head Verify #43371041780 passed. Post-main Verify #43372080816 also passed. No open Webgame PRs remain at this checkpoint; issue #2 is closed.
- PR #185's flashcard keyboard interaction keeps Space/rating/arrow shortcuts within the focused card, declares ARIA shortcuts and gives focus-aware instructions. Its isolated synthetic browser regression passed in exact-head and post-main CI. No learner data or fixture was added to the published catalog.
- Cloudflare Workers reported successful merged-main production build 762a5b23-6aa1-4cca-b838-86855f273940, version 52c3f077-3682-473d-801a-88ccc497cdc7. This verifies provider build/deployment status. Direct live-page readback was attempted through the available web reader and is inaccessible, so A5 remains blocked_external and live delivery is NOT_VERIFIED.
- The production catalog remains empty/noindex (0 published items); synthetic test fixtures and private Alignment Engine data are absent from the public build. A1/A9/A12 history and exposure decisions remain blocked_approval; preserve Git history and continue prospective artifact containment. Do not edit PROGRESS_LOG.md while its approval gate remains unresolved.
- Readiness: ENGINEERING_READY=YES for the tested keyboard-accessibility slice; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue A3 desktop/mobile browser UX, testing, PWA, accessibility, privacy and security independently of the private-data blockers.

## Active checkpoint — A3 flashcard keyboard scope (2026-11-13; post-merge verified)

PR #185 merged from expected head `72b9b817340265ec2b62f5d7448f5a0da257afb2`; PUBLIC main is `91772a49aaeaa2d7ca468242dd468e8d72717fd4` / tree `f6ed3c23fa0796b146eff5b5ba8d2491e469bab7`. The feature scopes number/arrow/space shortcuts to the focused flashcard, declares `aria-keyshortcuts`, updates focus instructions, and has synthetic browser coverage. No learning data changed.

Exact-head Verify #43368222846 and post-main Verify #43369390245 passed 241 unit tests, 83 browser tests, build, e2e smoke, performance, Lighthouse and committed-dist drift. Cloudflare merged-main build #131701535446 succeeded (`a4ea855f-5818-4bcb-a200-927bf80e1c7e`). Live Pages readback remains NOT_VERIFIED because the web reader could not access the host and the desktop browser connection was unavailable. Preserve A5's blocker and empty/noindex catalog. Continue keyboard/PWA/accessibility work independently of corpus readiness.

## Current execution checkpoint — A3 responsive navigation (2026-11-13)

- PR #183 merged from expected head `1de408e4cc34d979af831aca6c9ca7db660ae4b4`; PUBLIC main `b95afbe2c3f02d12baf34653264ffee1d975c716` / tree `b71a9681d142f048bf362aa7fbdb410ccb68d1ad`.
- Exact Verify #43354679799 and post-main Verify #43355754075 succeeded. Latest merged-main evidence: 241 unit tests, 82 browser tests, build, smoke, performance budget, axe, 12 Lighthouse profiles and committed-dist drift all passed. Cloudflare provider build `8cfb70e5-9fb6-48f2-8889-95a15f890605` succeeded.
- Responsive navigation now closes on outside interaction and Escape, restores focus, and resets at desktop width. Catalog is still empty/noindex; synthetic fixtures and private Engine material are absent from public `dist`.
- `ENGINEERING_READY=YES`; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`. Production live readback remains NOT_VERIFIED, so A5 stays blocked_external.
- Resume A3 responsive/accessibility/PWA/security tasks without waiting for corpus completion; keep A5 live-readback and the private data track independent.

## Current execution checkpoint — 2026-11-13

- A3/C1 revocation-safe adapter merged as PR #181 from expected head `4a36b17e92ee988f0657da717c70ba51427e8e53`; PUBLIC `main` is `2711f14dcc4b0187f18a9270e332583e0db8adf7` / tree `b5e7a8b33b95ce8791eec3f37c48ac76acee15bc`.
- Exact-head Verify #43346625392, post-main Verify #43347364976, and Cloudflare production build `da3b97f8-069a-441d-adc5-226a6837fbbb` succeeded. Full verify passed (241 unit, 81 browser; build, performance budget, smoke, governance, drift); 12 Lighthouse profiles passed.
- The adapter prunes revoked item/source/evidence descendants and fails closed on unknown rights. It remains source/test-only and is excluded from production assets pending independently authorized integration.
- Catalog remains empty/noindex, with no synthetic fixtures or Engine data in dist. `ENGINEERING_READY=YES` for this safety slice; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`. Direct live Pages readback remains NOT_VERIFIED and A5 remains `blocked_external`.
- Next: continue independent A3/C1 engineering and retry direct live readback only through an available supported reader; keep publication gates closed.

## Latest checkpoint — 2026-11-12 UTC / 2026-11-12 WIB (PR #177 merged; post-main verified)

- PR #177 merged from expected head 039f499e206115a9f0b3b5ab0e2bfa7a4505731c; PUBLIC main is 69175e03b1aade0fe83c3181a017f69332251252 / tree 1ed0fc469808bda76072192dd088515b6dcb24b2.
- Exact-head Verify #43178037133 passed; post-main Verify #43178728951 passed. Cloudflare Workers Builds for the merged main also passed as check #131049554319. This verifies technical provider build/deployment status only.
- The adapter now explicitly maps all six current public topic slugs, rejects unknown upstream slugs, and blocks topic-less public release. Synthetic-only tests enforce map parity and the publication gate. Local verification passed 237 unit, 80 browser, E2E smoke, performance, drift, governance and build checks; all 12 Lighthouse profiles passed with accessibility 100 throughout (mobile performance 95–99; desktop 99–100).
- Production catalog remains empty/noindex with 0 learning items; test fixtures and internal/source material are absent from dist, and no Engine data was transferred.
- Direct live Pages readback remains NOT_VERIFIED: the web reader cannot access the Pages host, and the available browser session does not expose Chrome or IAB. A5 remains blocked_external. ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 UX/accessibility/PWA work and C1 synthetic adapter compatibility independently. Retry direct live readback only through an available supported surface; keep real-content publication gates closed.

## Latest checkpoint — 2026-11-12 UTC / 2026-11-12 WIB (PR #175 merged; post-main verified)

- PR [#175](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/175) merged at PUBLIC `main` `9e9fbe98b6f2fa0a7ee33632c5f77b839ed30458` / tree `1e649fd3ad5de97fb3de0fa26b28dd30de7b5ccf`, from exact expected PR head `351fbe7669d1078ac6f0bee39e0e3db5aea831fa`.
- Exact-head Verify [#43169061877](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43169061877) and post-main Verify [#43169933728](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43169933728) passed. Post-main: 235 unit tests, E2E smoke, 80 browser tests, performance budget, drift gate, and 12 Lighthouse profiles.
- Lighthouse post-main scores: mobile performance 97/97/97/99/99/100, desktop 100 across six routes, accessibility 100 on all 12 profiles. Cloudflare Workers Builds check [#131020695666](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/131020695666) succeeded.
- Direct live readback remains unavailable: web reader reports the Pages host inaccessible and the available CUA session has no browser surface. Provider build success is verified; served root/robots/manifest/service worker/lesson route remain NOT_VERIFIED. Keep A5 blocked_external.
- Empty production catalog/noindex remains in force (0 published items, 0 warnings); synthetic fixture and private Engine content are absent from the artifact. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with isolated synthetic UX/accessibility work; do not publish learning content without verified rights, provenance and quality gates.

## Latest checkpoint — 2026-11-12 UTC / 2026-11-12 WIB (A3 progress-reset privacy and browser-runner stability)

- Re-verified PUBLIC `main` at `838e09c586441f399ee54d42017836c78fccebc2` / tree `396325b6138bc2caec2f896e40765c60300f0ac5`; branch `codex/a3-browser-navigation-20261112` starts from that exact commit. Implementation commit: `545ded234809126f3046cbac49024910b4499848`.
- Reset now removes the legacy `batakTobaGameProgress` storage key as well as corrupt backups after writing an empty v3 state. Unit and browser regressions verify deletion and no resurrection after reload. Playwright now caps concurrency at four workers to avoid timeout failures under ten-worker contention.
- Local verification passed: `npm run verify:core` (site/governance, build, 235 unit tests, performance budget, E2E smoke and 80/80 browser tests at four workers); `npm run verify:drift` passed after the build artifact commit; `npm run lighthouse:check` passed all 12 mobile/desktop profiles. Accessibility was 100/100 throughout; mobile performance ranged 96–99 and desktop performance was 100.
- Public catalog remains empty/noindex (0 published items and 0 warnings); fixture markers and private Engine content are absent from `dist`. Cloudflare Workers Builds check for current pre-change main passed (`9ed16a91-b4ed-4f87-8c9e-a80514eed97d`), but the new branch is not deployed and direct live content remains NOT_VERIFIED; A5 is `blocked_external`.
- Readiness: ENGINEERING_READY=YES locally; exact-head CI and merge pending. DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. No `PROGRESS_LOG.md` edit, history rewrite, or private Engine transfer; A1/A9 approval gates remain intact.
- Next: publish the branch as a PR, require exact-head Actions to pass before merge, then record the merged main SHA/tree and post-merge production evidence.

## Latest checkpoint — 2026-11-12 UTC / 2026-11-12 WIB (PR #173 merged; PWA cache privacy hardening)

- Re-verified PUBLIC `main`: `296b88f03cb238b1e7ecfb57fdf408eb4c102f61` / tree `46642799f77caa23de7f00ef354885d6e1873d03`. PR [#173](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/173) merged with this main SHA.
- The service worker avoids persisting query-bearing navigation responses and responses marked `private` or `no-store`, removes exact older cached copies, and evicts private/no-store runtime responses. The cache namespace is bumped; generated `dist/sw.js` is synchronized. Lighthouse route IDs use an allowlist for deterministic restartability.
- Exact-head Verify [#43140475505](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43140475505) and post-main Verify [#43143336157](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43143336157) succeeded. Local checks passed: site/governance, build, 234 unit tests, performance budgets (JS 194,964/196,608 bytes; CSS 16,342/49,152), E2E smoke, dist drift, 80/80 browser tests on the four-worker rerun, and all 12 Lighthouse profiles (a11y 100 throughout; mobile perf 91–99; desktop 99–100). One timeout in the initial ten-worker browser run was cleared by the full rerun.
- Cloudflare Workers Builds reports production build `6f57a635-b7d4-4f52-95c2-d4b61179fcf6` and version `5b2e9fa1-f024-45df-8abe-2e1399bba1a1` successful. Direct live readback of `/`, `/robots.txt`, `/manifest.webmanifest`, `/sw.js` and `/learn/angka/` was attempted at the Pages host, but the available reader could not access those URLs; served production content remains NOT_VERIFIED and A5 stays `blocked_external`.
- Public catalog remains empty/noindex: 0 published learning records and 0 warnings; synthetic markers and private Engine data are absent from `dist`. ENGINEERING_READY=YES for this engineering change; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. No history rewrite or `PROGRESS_LOG.md` change; A1/A9 approval gates remain intact.
- Next: continue A3 independently and retry live readback through a supported direct browser/network path. Provider build success is technical deployment evidence, not direct live-content verification.

## Latest checkpoint — 2026-11-11 UTC / 2026-11-12 WIB (PR #171 merged; dictionary filter accessibility)

- PUBLIC `main` is `505a95856f35acfe40a9caed7b6253aaeecfad95` / tree `50671a8d23561ecd02a42019fa1d4682905eb863`. PR [#171](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/171) gives dictionary filters a 44px touch target and adds an isolated synthetic browser test for touch, keyboard focus, selection and 320px overflow.
- Local validation on exact feature head `e72e39d6087f1b3d1dd7d4d8ce2f375a2f8ebbba` passed: `npm run check` (0 published items/words/phrases/sentences, 0 warnings), 232 unit tests, performance budgets (JavaScript 194,964/196,608 bytes; CSS 16,342/49,152), E2E smoke and 79 browser tests. Dist drift check passed; synthetic fixture markers are absent from public `dist/`.
- Exact-head GitHub Verify run [#43053452315](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43053452315) failed before application tests at Playwright browser system-dependency installation: Ubuntu mirror DNS resolution failed. The retry failed at the same setup step; the full verification steps were skipped. This is an infrastructure failure, not a test pass. The available post-merge status/workflow query returned no run evidence.
- The public catalog remains empty and noindex; no restricted Engine data or synthetic learning records were published. Post-merge Cloudflare production build and direct live readback of root, robots, manifest, service worker and a lesson route are NOT_VERIFIED. Keep ENGINEERING_READY=YES for this UI change; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- A3 continues with independent responsive, keyboard/touch, privacy/security and PWA work. A5 remains blocked until provider deployment and direct served-page evidence are available. No Git history rewrite or `PROGRESS_LOG.md` change was made; the separate A1/A9 approval gates remain intact.


## Latest checkpoint — 2026-11-11 14:00 UTC / 2026-11-11 21:00 WIB (PR #169 merged; 320px mobile navigation targets)

- PUBLIC main: `9a54ea2d3240bb24208e985c2d69aa4e8d246086` / tree `852964270ed699dd9425159131eca86cf93509e2`. PR [#169](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/169) raises mobile navigation targets to at least 44px and adds the 320px touch-viewport check across primary routes.
- Post-main Verify [#43031642857](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43031642857) on this exact main SHA passed: 232/232 unit tests, 78/78 Playwright tests (0 skipped), E2E smoke, fixture/publication gates, performance budget (194,964 / 196,608 JavaScript bytes), and committed-dist drift.
- All 12 Lighthouse route/profile checks passed. Accessibility was 100/100 in every profile; mobile performance was 97, 97, 97, 99, 99 and 100; desktop performance was 100 in all six routes. Verified artifact [#13860224540](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43031642857/artifacts/13860224540) is 121,455 bytes (SHA-256 `7e72e8d366dc808a7741e47b888ced70a2048d9d04d99405321afc8e619e9f0b`). Lighthouse reports are artifact [#13860814389](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43031642857/artifacts/13860814389).
- Cloudflare Workers Builds check reports production build `a6a847b8-098d-4f23-88f6-549f0c31eacb` successful for this main SHA. This is provider build success only: direct readback of root, robots.txt, manifest, service worker and a lesson route remains NOT_VERIFIED; the available live reader cannot access the Pages host.
- CI found 0 published learning items, words, phrases or sentences and 0 warnings; synthetic fixture markers are absent from public dist. The catalog remains empty/noindex and no private Engine records were transferred.
- Readiness: ENGINEERING_READY=YES for this mobile navigation checkpoint; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A1/A9 remain approval-gated; no history rewrite or `PROGRESS_LOG.md` change was made.
- Next: continue A3 on remaining responsive, keyboard/touch, privacy/security and PWA states with isolated synthetic fixtures. Keep A5 blocked_external until the live Pages artifact can be read directly.

---

## Latest checkpoint — 2026-11-10 10:31:34 UTC / 2026-11-10 17:31 WIB (PR #167 merged; keyboard-accessible mobile navigation)

- PUBLIC main: `8e7621ba187228c4da3bd5182315b279c4ec5ff0` / tree `0af84b5cd6b180d8fc857f417e99f0f94a7cc1b5`. PR [#167](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/167) adds shared Escape-to-close navigation handling for the main, dictionary, flashcards and progress entrypoints; aria-expanded stays synchronized and focus returns to the menu toggle. The responsive browser test exercises this keyboard flow on all eight primary routes.
- Exact PR Verify [#42797899806](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42797899806) and post-main Verify [#42798608420](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42798608420) passed: 232/232 unit tests, 77/77 Playwright tests (0 skipped), E2E smoke, performance budget, fixture-isolation/publication checks and committed-dist drift.
- All 12 Lighthouse route/profile checks passed. Accessibility was 100 throughout; mobile performance was 97–100 and desktop 100. The verified post-main dist artifact [#13754854136](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42798608420/artifacts/13754854136) is 121,457 bytes (SHA-256 `d5c1a74d587db23fe4ff1a297f4a671f0c9275bd3e42b2b9d8f62efdaa51d1c5`).
- Cloudflare Workers Builds reports production build `5f74bbd9-49d7-43a9-bbc8-4278b4772e9c` successful for this main commit. This is provider technical success only: direct live-page readback remains NOT_VERIFIED; A5 stays blocked_external.
- The site check found 0 published items/words/phrases/sentences and 0 warnings; test-fixture markers are absent from public dist. No private Engine data moved to the public repository. Readiness: ENGINEERING_READY=YES for this navigation/browser checkpoint; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- A3 remains active for further responsive, keyboard/touch, privacy/security and PWA work. A1/A9 remain approval-gated: historical corpus-derived Git objects stay untouched; no history rewrite or `PROGRESS_LOG.md` edit.
- Next: continue A3 from the current main, preserve empty/noindex publication, and retry A5 only through a supported direct live-readback surface.

---

## Latest checkpoint — 2026-11-10 08:39:28 UTC / 2026-11-10 15:39 WIB (PR #165 merged; first-visit core-route offline accessibility)

- PUBLIC main: b173698833b0ded49108a99b0120914c4ca3d677 / tree 44d249b022db146706a1c355be4299eb230fd6c8. PR #165 adds first-visit offline fallback coverage and serious/critical Axe scans for /flashcards/, /progres/, /learn/sapaan/, and /learn/keluarga/.
- Exact-head Verify #42779964755 and post-main Verify #42782076001 passed 232 unit tests and 77 Playwright browser tests, with 0 failures/skips. Site governance, fixture isolation, build, smoke, committed-dist drift and performance budgets passed; the site check found 0 published learning items, words, phrases or sentences and 0 warnings.
- All 12 Lighthouse profiles passed: accessibility 100/100 throughout, mobile performance 97–100/100 and desktop performance 100/100. Main artifact #13745298538 is 121,155 bytes; Lighthouse reports #13745533655 are 1,304,129 bytes.
- Cloudflare Workers Builds succeeded for main (build 99d7fdb7-3d62-4408-81a7-8d37a039285b). This confirms provider build status only. Direct live root, manifest, robots and critical-route readback remains NOT_VERIFIED; A5 stays blocked_external.
- Production learning data remains empty/noindex and synthetic fixtures are absent from the public artifact. No private Engine content was transferred. Historical Git objects remain unchanged; no history rewrite or PROGRESS_LOG.md edit.
- Readiness: ENGINEERING_READY=YES for the tested browser/offline flows; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 across remaining keyboard/touch, responsive, privacy/security and PWA states with isolated fixtures. Keep A5 blocked until a supported live readback can verify the served pages.

---

## Latest checkpoint — 2026-11-10 07:48 UTC / 14:48 WIB (A3 first-visit lesson offline accessibility merged; post-main checks passed)

- PUBLIC main: `53809ffc97013924dd2977dacccd4d78b594ed33` / tree `4a6de6b6452b7a37f409c53f66913db39a72d970`. PR [#163](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/163) adds a real-service-worker browser check and serious/critical Axe scan for the first-visit offline fallback on `/learn/angka/`, complementing the dictionary and games fallback scans.
- Exact-head Verify [#42776384728](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42776384728) and post-main Verify [#42777162766](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42777162766) passed 232 unit tests and 76 browser tests, with 0 failures/skips; smoke, site governance, fixture isolation, committed-dist drift and performance-budget checks passed. The site check reported 0 published learning items, words, phrases or sentences.
- All 12 Lighthouse profiles passed: accessibility 100/100 throughout; mobile performance 96–99/100; desktop 100/100. Mobile scores: home 97, angka 97, games 96, flashcards 99, dictionary 99, progress 99. Verified main artifact [#13744995217](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42777162766/artifacts/13744995217) is 121,155 bytes (SHA-256 `e11704e1e5c9cfeaae7fa6a3f7169cd70d964e5f7a3201768ed1e46f24097e38`); Lighthouse reports [#13743914093](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42777162766/artifacts/13743914093) are 1,291,071 bytes.
- Cloudflare Workers Builds main check succeeded for this commit (build `c437a2d0-d069-459f-b61d-86704b803655`). This confirms provider build status; direct live root/manifest/robots/critical-route readback remains NOT_VERIFIED and A5 remains `blocked_external`.
- Production data remains empty/noindex and synthetic fixtures are absent from the artifact. No private Engine data was transferred. Historical Git objects remain unchanged; no history rewrite or `PROGRESS_LOG.md` edit.
- Readiness: ENGINEERING_READY=YES for tested offline fallback/browser flows; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 through remaining service-worker routes, responsive keyboard/touch interaction states, privacy/security and PWA coverage using isolated synthetic fixtures. Keep published catalog empty/noindex. Retry A5 only through a supported live browser/network readback; do not infer live content from CI artifacts or provider builds.

## Latest checkpoint — 2026-11-10 07:21 UTC / 14:21 WIB (A3 offline fallback accessibility merged; main verification passed)

- PUBLIC main: `35e900dcb1963e8afc830d31a751a978afca97e9` / tree `3e5279b5c40b184d77c54a6b70dfe7fc6e4ecaa2`. PR [#160](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/160) added Axe coverage for the first-visit offline dictionary fallback; [#161](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/161) added the corresponding `/games/` fallback scan. Exact-head Verify [#42772243676](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42772243676) and post-main Verify [#42772826748](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42772826748) passed.
- Post-main run passed 232 unit tests and 75 Playwright browser tests, with 0 failures and 0 skips; smoke, site governance, fixture-isolation, committed-dist drift, and performance-budget gates passed. The site check reported 0 published items, words, genuine phrases, or sentences.
- All 12 Lighthouse profiles passed: accessibility 100/100 throughout; mobile performance 97–100/100; desktop 100/100. Mobile scores: home 97, angka 97, games 97, flashcards 99, dictionary 99, progress 100. Verified site artifact [#13743285138](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42772826748/artifacts/13743285138) is 121,155 bytes (SHA-256 `090f3c3869a93418a20e53f4588686db603b5632508311dd42bd24dda57ffaf1`); Lighthouse report artifact [#13742557992](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42772826748/artifacts/13742557992) is 1,291,565 bytes.
- Cloudflare Workers Builds main check completed successfully for this commit (build `c597270e-9eda-41e9-a382-209464daa53c`). This is provider build evidence. Direct live root, manifest, robots, and critical-route readback remain NOT_VERIFIED; A5 remains `blocked_external`.
- Published data remains empty/noindex and synthetic fixtures are absent from the public artifact. No private Engine data was transferred. Historical Git objects remain unchanged; no history rewrite or `PROGRESS_LOG.md` edit.
- Readiness: ENGINEERING_READY=YES for these tested offline fallback and browser flows; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 through remaining interactive states and responsive keyboard/touch, offline, privacy/security coverage using isolated synthetic fixtures. Keep the published catalog empty/noindex. Retry A5 only when a supported client can read the live deployment; do not infer live content from a build or CI artifact.

## Latest checkpoint — 2026-11-10 05:48 UTC / 12:48 WIB (PR #156 merged and post-main Verify passed)

- PUBLIC main: 79c9283b7bec42f1c986143de0faf87e9e94bb7d / tree ba9ec9bd51bb5f2e0afac9b66a59d90ad991c189. PR [#155](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/155) added synthetic Axe scans after quiz wrong-answer feedback, quiz summary and mistake-review summary. PR [#156](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/156) added Axe scans for the Memory game board and keyboard-selected card, with focus/pressed-state assertions.
- Exact-head Verify #42759824285 and post-main Verify #42760997193 passed for PR #155. Exact-head Verify [#42762034672](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42762034672) and post-main Verify [#42763579131](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42763579131) passed for PR #156. The latest browser suite has 75 passed and 0 skipped; unit, build, smoke, governance, fixture-isolation, dist-drift and release checks passed.
- All 12 Lighthouse profiles passed: accessibility 100/100 throughout, mobile performance 97–100/100, desktop performance 100/100. Verified main artifact [#13739355819](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42763579131/artifacts/13739355819) is 121,155 bytes.
- Site and governance checks report 0 published items, words, genuine phrases and sentences. Synthetic fixtures are absent from public output. The catalog remains empty/noindex and no private Engine content has moved to this repository.
- Main production deployment and live root/manifest/critical-route readback remain NOT_VERIFIED; A5 stays blocked_external. A CI artifact is not live deployment proof.
- Readiness: ENGINEERING_READY=YES for the checked browser flows; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Historical Git objects remain unchanged; no history rewrite or PROGRESS_LOG edit.
- Next: continue A3 across remaining game states and responsive keyboard/touch, offline, privacy and security work. Keep production data empty/noindex until separate publication gates pass.

## Latest checkpoint — 2026-11-10 04:49 UTC / 11:49 WIB (A3 lesson feedback/review accessibility merged and verified)

- PUBLIC Webgame main is bb6037fdd8d417f93f3532ae4ac81921e6735ee8 / tree 162ce5660496a2abc995276c0e252a5c0c3d8f59. PR [#153](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/153) adds serious/critical Axe scans after synthetic wrong/correct lesson feedback, during mistake review, and at lesson summary.
- Exact-head Verify [#42756530178](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42756530178) and post-merge main Verify [#42757505048](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42757505048) passed 232 unit tests and 74 Playwright tests, 0 failures/skips. Smoke, governance, fixture isolation, dist drift and performance budgets passed.
- All 12 Lighthouse profiles passed: accessibility 100 throughout; mobile performance 96–99; desktop performance 100. Verified public-site artifact [#13736890072](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42757505048/artifacts/13736890072) is 121,155 bytes (archive SHA-256 c53d4620d939bec9ffc6a7601867edd2431e9d0e217a1c68ec499adea766c08b).
- Site and governance checks confirm 0 published learning items, words, genuine phrases or sentences; synthetic fixtures remain isolated. Published catalog remains empty/noindex and no Engine/private material was transferred.
- Cloudflare PR build 40d4548f-f93a-4ce7-83fa-e2ab43e6b603 succeeded for PR head 72eddd80. This is provider build evidence only. Main production deployment and live root/critical-route readback remain NOT_VERIFIED; A5 stays blocked_external.
- A1/A9 remain approval-gated. No history rewrite or PROGRESS_LOG.md edit was made. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue independent synthetic lesson/game work for accessibility, responsive keyboard/touch, PWA/offline and security; preserve empty/noindex production data.

## Latest checkpoint — 2026-11-10 04:11 UTC / 11:11 WIB (A3 flashcard accessibility states; PR #151 merged)

- PUBLIC Webgame remains PUBLIC. Main is 127658d6204261d81424ede7464ac7633b923166 / tree 10f54ee4b19b495f1679cc59da4eb2d01e27a925. PR [#151](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/151) adds serious/critical axe checks after a keyboard flip and after a correct rating advances an isolated synthetic flashcard.
- Exact-head Verify [#42752976771](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42752976771) and post-merge main Verify [#42753671717](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42753671717) passed 232 unit tests and 73 Playwright tests, 0 failures and 0 skips; smoke, governance, fixture-isolation, dist-drift, and performance-budget checks passed.
- All 12 Lighthouse profiles passed. Accessibility was 100/100 throughout; mobile performance ranged 97–99 and desktop was 100. Verified production artifact [#13735165426](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42753671717/artifacts/13735165426) is 121,155 bytes with SHA-256 ed0009e1e0c1342198f5adaed9103fdf033fb092ba7792d46dca4f597eadd302. Cloudflare production build b3365297-54ea-42a0-97d7-c7589bf682bc succeeded (version 2cbdefb8-52c8-43e4-b9b8-4a3e237ba3d4). This verifies provider build/artifact only; live-page content remains NOT_VERIFIED.
- The production catalog is still empty/noindex: 0 published learning items, 0 words, 0 genuine phrases and 0 sentences; CI confirms synthetic fixtures are absent from public artifacts. No private Engine material was transferred. Historical corpus-like objects remain in public Git history; current tree/artifact are contained. A1 and A9 remain approval-gated, and PROGRESS_LOG.md remains untouched.
- Readiness: ENGINEERING_READY=YES for tested browser flows; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A5 remains blocked_external pending live root/critical-route readback.
- Next A3 step: extend isolated accessibility checks through lesson feedback, mistake-review and summary states while preserving keyboard/touch coverage. Continue independently of corpus readiness.

---

# Master execution plan

## Latest checkpoint — 2026-11-10 03:14 UTC / 10:14 WIB (A3 PR #149 merged; post-merge verification and read-only history audit complete)

- PUBLIC main is `affa89e9df360cfebf03f3c8b02c0318c38cced6` / tree `b507580b220f2c686565dc99e7d12f6605e5d42d`. PR [#149](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/149) adds axe coverage after keyboard answer feedback appears in the active quiz, using an isolated synthetic fixture. Exact-head Verify [#42746142303](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42746142303) and post-merge main Verify [#42746750005](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42746750005) passed: 232 unit tests, 73 Playwright tests, 0 failures/skips, smoke, governance, fixture isolation and dist drift. All 12 Lighthouse profiles passed: accessibility 100 throughout; mobile performance 95–100; desktop 100.
- Main artifact `verified-public-site-dist-42746750005` (#13731647228) is 121,155 bytes, SHA-256 `a43d4adc3170fee28dbd573a1e37b234dd5a2620a8d20131bc445408fccef88f`; CI confirms synthetic markers are absent and 0 published learning items. Cloudflare Workers Builds production build `8c1743cd-de8d-4168-80d2-5df9caf4225f` succeeded (version `f1715455-b3bf-4540-9e8f-8819d3608b6a`). This verifies the CI artifact and provider build, not live-page content.
- Read-only GitHub tree audit found source-derived JSON under historical public snapshots, including `data/raw`, `data/candidates`, and `data/legacy` before containment commit [ed7c3ae](https://github.com/drewsebastians/webgame-bataktoba-indo/commit/ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea). Current main and production artifact exclude those source directories; artifact tests enforce this. Historical commits remain reachable. No historical corpus blobs were opened and no history rewrite was performed.
- The production identifier map remains included for legacy local-progress migration. Published payloads remain empty/noindex. The available reader cannot access live root or critical routes, so A5 remains `blocked_external` and live-content verification remains NOT_VERIFIED.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A1 remains gated for any history rewrite. Continue independent A3 browser accessibility, keyboard/touch, privacy/security, offline and performance work.
## Previous checkpoint — 2026-11-10 01:03 UTC / 2026-11-10 08:03 WIB (A3 PR #145 merged; post-merge verification complete)

- PUBLIC Webgame code main is 69ae2f750b1b5a3eefd28ea1e497ea716bbdc310 / tree e0ee16cdfe48a038f7b20b63738db4402a16af7a; PR #145 adds a synthetic-only regression for two due daily-review items. It checks 320px touch flow, saved spaced-repetition ratings, focus on the continuation control, and focus on the next prompt.
- Exact-head Verify #42727978561 and post-merge main Verify #42728657641 passed: 232/232 unit tests, 73/73 Playwright tests, 0 failures and 0 skips; full build, smoke, performance, fixture-isolation and dist-drift gates passed. All 12 Lighthouse profiles passed with accessibility 100; mobile performance was 97–99 and desktop 100.
- Main-run artifact verified-public-site-dist-42728657641 (artifact #13724310484) is 121,155 bytes, SHA-256 cec66996a6f459f2bddc329db8baf737063ce570f2e260bbb4cf7629f852d2a5. Synthetic fixture markers are absent from the public dist. Cloudflare Workers Builds check #129540944378 succeeded for build 28767e3a-3f8b-4ed3-a201-b99f51271bb5, version c1705694-4a7d-49ec-9c9f-bdebb73914cb. This verifies provider build success; direct live-page readback remains NOT_VERIFIED.
- Published learning data remains empty/noindex. No synthetic or private Engine linguistic data was added to the site. The Alignment Engine remains PRIVATE and no private artifacts were transferred.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue A3 with browser accessibility, keyboard/touch, PWA/offline, privacy, security and performance. A5 remains blocked_external: the web reader could not access the Pages root or critical routes, and the available browser inventory had no user browser tab. Retry live readback through a supported network/browser path; do not treat the provider build as live-content verification. Keep A1/A9/A12 approval gates closed and preserve empty/noindex production state.

## Previous checkpoint — 2026-11-09 04:02 UTC / 11:02 WIB (PR #143 merged; post-merge validation complete)

- PUBLIC Webgame main is 2a726809df97295214257dd8771fb7cf370f7ede / tree 46cbec83ce3b7871ad7ff9fb2450c6569f4c0ec1; PR #143 merged. Exact-head Verify #42556253864 and post-merge Verify [#42556776418](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42556776418) passed 232 unit + 73 Playwright tests (0 skipped), all 12 Lighthouse profiles, and the artifact-integrity gates. Lighthouse accessibility was 100 across profiles; mobile performance was 97–100 and desktop 100. Cloudflare production build [cb0dcca1-9ecb-40f0-81c1-4948ed28cc79](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/cb0dcca1-9ecb-40f0-81c1-4948ed28cc79) succeeded; Actions artifact #13648310452 is 121,155 bytes. Live root/key-route readback remains NOT_VERIFIED. Published learning data remains empty/noindex.
- Exact-head Verify #42556253864 also passed before merge. The previous offline-reconnect assertion race is covered by waiting for `navigator.onLine` before the test revisits the route.
- No synthetic or private linguistic data appears in the production artifact. Production continues to show empty learning data and noindex states while the corpus remains unpublished.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Next: continue A3 mobile accessibility/keyboard/touch, PWA/offline, privacy and security work. Verify live page readback when provider access returns; do not equate successful provider build with live content inspection.


## Previous checkpoint — 2026-11-09 02:11:09 UTC / 2026-11-09 09:11 WIB (A3 responsive reflow coverage / PR validation pending)

- PUBLIC main is `4346a3e31b2bacad677dc2614f886701bb683928` / tree `b0975b2dc029ff877a39c6d9e02cc5861bc59b50`. Docs-only PR #141 merged at this checkpoint. Its post-merge Verify [#42546542052](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42546542052) passed 232 unit + 72 Playwright tests (0 skipped), build/smoke/governance/performance/isolation/dist-drift checks, and 12 Lighthouse profiles (accessibility 100 throughout; mobile performance 97–100, desktop 100). Cloudflare production build [242f40a6-aceb-405e-8b60-b0917f8aeac4](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/242f40a6-aceb-405e-8b60-b0917f8aeac4) succeeded (version `950c3057-9119-417d-bde3-14cc00536f36`); verified site artifact [#13643697658](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42546542052/artifacts/13643697658) is 121,155 bytes (SHA-256 `88d8180c9233696c67624d1bf2ea4d1529ef02f2f428e3acd6abf73e9bb08364`).
- Direct live root/key-route readback remains NOT_VERIFIED because the supported web reader/DNS path has not returned the Pages artifact. Provider build success is recorded separately; live content is not claimed as inspected.
- The current A3 batch adds a Playwright reflow regression at 640 CSS px, the layout width a 1280 CSS px viewport presents under 200% browser zoom. It checks the main content and mobile navigation across home, games, flashcards, dictionary, progress, and the angka/sapaan/keluarga topic routes, with no injected linguistic fixtures. Exact-head validation is pending.
- Published learning data remains empty/noindex; checks confirm 0 published items and synthetic fixtures absent from public artifacts. No private Engine data is present. Readiness: ENGINEERING_READY = YES; DATA_READY = NO; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next: finish exact-head tests and fix any route that overflows or loses navigation. Then merge after all required checks pass, verify the main build/artifact, and continue A3 accessibility, PWA/offline, privacy, and security work. A5 remains blocked_external; A1/A9/A12 remain approval-gated for destructive public-history operations.


## Latest checkpoint — 2026-11-07 17:01 UTC / 2026-11-08 00:01 WIB (post-merge A3 320px flashcard review / PR #138)

- PUBLIC main is `5ac2f4ab151773f654f6a1c76aaaa6d269a83c67` / tree `9b9d7092a905a0f7a7f9d6bc425fa67e58c1d501`. [PR #138](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/138) adds a synthetic-only 320px touch flow for due flashcards, checks horizontal overflow across flipping, rating and the final empty state, and verifies spaced-repetition scheduling.
- Exact-head Verify [#42392468903](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42392468903) and post-merge main Verify [#42393448090](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42393448090) passed 232 unit tests and 71 Playwright tests (0 skipped), smoke, synthetic isolation, governance, performance budget, committed-dist drift and all 12 Lighthouse profiles. Accessibility scored 100 throughout; mobile performance was 97–100 and desktop 100.
- Cloudflare Workers Builds production build `84c7b04a-85b9-4339-bd92-8a50cbc2cf52` succeeded (version `72ccea67-68be-4aea-a9ad-87bbd14a1eb0`). Verified CI site artifact [#13583095164](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42393448090/artifacts/13583095164) is 121,155 bytes (SHA-256 `42e2f57921be583e228a76ef961b5fee8aa366b45881827456267c219a7c0530`); Lighthouse reports are [#13583055245](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42393448090/artifacts/13583055245). This confirms build and artifact success; direct live root and key-route readback remains NOT_VERIFIED.
- Published learning data remains empty/noindex (0 items, words, genuine phrases or sentences). Synthetic fixtures stay isolated to Playwright and absent from `dist`; no private-engine or restricted source content was transferred.
- Readiness: ENGINEERING_READY = YES for tested browser flows; DATA_READY = NO; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next A3 action: extend the service-worker offline suite to exercise the `/games/` route with the empty published catalog, including its uncached offline fallback and cached offline revisit. Keep fixture-bearing tests service-worker-blocked. A5 remains `blocked_external` until a supported client verifies the served routes.

## Latest checkpoint — 2026-11-07 16:02 UTC / 2026-11-07 23:02 WIB (post-merge A3 daily practice / PR #135)

- PUBLIC code checkpoint is `90feca5faec5b9f835bacf7b91e94dc3a5199be0` / tree `aea2277e0063534e722a33244aea2fdbd61670cb`. [PR #135](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/135) merged a synthetic-only 320px touch check for the due-first daily-practice route; it verifies the due item, answer scheduling and horizontal overflow.
- Exact-head Verify [#42387816938](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42387816938) and post-merge main Verify [#42388361535](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42388361535) passed 232 unit tests and 70 Playwright tests (0 skipped), smoke, synthetic isolation, governance, performance budget and committed-dist drift. All 12 Lighthouse profiles passed accessibility at 100; mobile performance was 97–99 and desktop 100.
- Cloudflare Workers Builds main build `234f407e-dfc2-4022-afd6-f1f4c23483b4` succeeded. Main CI artifact [#13580302421](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42388361535/artifacts/13580302421) is 121,155 bytes (SHA-256 `5dd81633e1247b4772aeef0f0d6d9d1696b14c51f9cbec933b36ee2b03fe0aa4`); Lighthouse reports are [#13579619441](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42388361535/artifacts/13579619441). Provider build is verified; direct live root and key-route readback remains NOT_VERIFIED.
- Published learning data remains empty/noindex (0 items, words, genuine phrases or sentences). Synthetic fixtures remain Playwright-only and absent from `dist`; no private-engine or restricted source content was transferred.
- Readiness: ENGINEERING_READY = YES for tested browser flows; DATA_READY = NO; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next A3 action: assert the 320px progress route has no horizontal overflow before navigation and the due-first touch link meets the 44px target; continue independent PWA, privacy, accessibility and performance work. A5 remains `blocked_external` until direct live route readback is possible.

## Latest checkpoint — 2026-11-07 15:23 UTC / 2026-11-07 22:23 WIB (post-merge A3 touch lesson / PR #133)

- PUBLIC code checkpoint is `721de4ea72def31794de5f1add7345196d6b5c43` / tree `876ea378e24282be51d6d5a6412b4708d67f200c`. [PR #133](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/133) adds a synthetic-only, 320px touch lesson run through recognition, typed recall, deliberate mistake review and summary, checking horizontal overflow at each transition. No runtime content or linguistic data changed.
- Exact-head Verify [#42384762032](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42384762032) and post-merge main Verify [#42385338254](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42385338254) passed 232 unit tests and 69 Playwright tests (0 skipped), smoke, synthetic isolation, performance budget and committed-dist drift. All 12 Lighthouse profiles passed accessibility at 100; mobile performance was 96–99 and desktop 100.
- Cloudflare Workers Builds technical production build `0a1dea42-26d5-47c0-a1ae-5dd53c57cffd` succeeded. Post-merge verified site artifact [#13579079405](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42385338254/artifacts/13579079405) is 121,155 bytes (SHA-256 `2f1c927d8a5abd54b2be8d2bf487bf7612480bef16029a494a474000cd901f62`); Lighthouse reports are [#13579431398](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42385338254/artifacts/13579431398). This verifies the provider build and CI artifact; direct served-root and critical-route readback remains NOT_VERIFIED, so keep A5 `blocked_external`.
- Published learning data remains empty/noindex (0 items, words, genuine phrases or sentences). The synthetic fixture is intercepted inside Playwright and absent from `dist`; no private engine records or restricted source content were transferred.
- Readiness: ENGINEERING_READY = YES for the verified desktop/mobile synthetic flows; DATA_READY = NO; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next: add a synthetic 320px touch check for the due-first daily-practice link and its first answer/scheduling; retain the existing 375px touch flashcard-review coverage. Continue PWA/privacy/performance work independently and keep live production readback unverified until a supported client can inspect the served routes.


## Latest checkpoint — 2026-11-07 14:44 UTC / 2026-11-07 21:44 WIB (post-merge A3 / PR #131)

- PUBLIC `main` is `dd9ba13f8c95b55eaa4ac62df05a02ef47c82182` / tree `1662e2f4502351d513b12001de0dad634cfe91a9`. [PR #131](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/131) adds a synthetic 320px sentence-mode browser regression covering touch and keyboard input, focus transitions, horizontal overflow, mistake review and saved progress. The same work fixes wrapping of long feedback text on narrow screens. No learning data was added.
- Exact-head Verify [#42381901408](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42381901408) and post-merge main Verify [#42382379021](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42382379021) passed. Both report 232/232 unit tests and 68/68 Playwright tests, with no skips; smoke, synthetic isolation, performance budget and committed-dist drift passed. All 12 Lighthouse profiles passed accessibility at 100/100; mobile performance ranged 97–99/100 and desktop was 100/100.
- Cloudflare Workers Builds reported production build success `a3529cb6-2e7f-4332-babb-273975b1f398`. The verified site artifact [#13577169630](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42382379021/artifacts/13577169630) is 121,155 bytes (SHA-256 `0f1275acc14365b7659e5b15d4258b0a54af6bf495c19804f183ee32f79644e1`); Lighthouse reports are [#13577428869](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42382379021/artifacts/13577428869).
- Live readback remains NOT_VERIFIED: the available reader could not access the site root, robots.txt, manifest, published-sentence endpoint or service worker. The successful build and uploaded artifact are technical evidence, not a direct production readback. Keep A5 `blocked_external`.
- Published learning data remains empty/noindex. The synthetic sentence payload is intercepted by Playwright only and is absent from the production bundle. No private engine records or restricted content were transferred.
- Readiness: ENGINEERING_READY = YES for the verified browser flows; DATA_READY = NO; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next: continue A3 with responsive keyboard/touch coverage for lesson and review transitions; keep production-data gates fail-closed and all synthetic fixtures out of `dist`.


## Latest checkpoint — 2026-11-07 13:44:34 UTC / 2026-11-07 20:44:34 WIB (post-merge synthetic sentence coverage / PR #129)

- PUBLIC application main is `9a9a9c55268889ee570a1d42a6d38ff3fa9429f6` / tree `4b1c751531d1b59e850e686d90bd44a85d43e107`. [PR #129](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/129) closes the synthetic browser-test gap for sentence mode: a five-question quiz, deliberate mistake, mistake review and progress persistence run through an explicit per-test route override. The default/published sentence dataset stays empty, and the UI remains honest about the unavailable mode. No production runtime code or linguistic data was added.
- Exact-head Verify [#42314086884](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42314086884) and post-merge main Verify [#42315007755](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42315007755) succeeded. Latest logs show 232/232 unit tests, 67/67 Playwright tests (0 skipped), smoke, synthetic isolation, performance budget, committed-dist drift, and 12 Lighthouse profiles. Accessibility is 100/100 in every profile; mobile performance is 96–99/100 and desktop performance is 100/100.
- Cloudflare technical build check succeeded for build `0b01b576-898d-47b6-ad9d-ce1da96c82de`. Main workflow uploaded verified site artifact [#13549583806](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42315007755/artifacts/13549583806) (121,147 bytes) and Lighthouse reports [#13549703818](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42315007755/artifacts/13549703818). Direct live root, robots, manifest, published-data and service-worker readback is still NOT_VERIFIED because the available readers could not access the served URLs. A5 remains blocked_external; a successful build is not treated as live artifact verification.
- Public published learning data remains empty/noindex; test-only sentences are absent from the deployed artifact. The PRIVATE Data Engine remains private and no private source records or content were transferred to PUBLIC.
- PUBLIC readiness: ENGINEERING_READY = YES for the tested browser flows; DATA_READY = NO for published learner content; PUBLICATION_READY = NO; LEARNING_READY = NO; MONETIZATION_READY = DEFERRED.
- Next: continue A3 with isolated 320px touch/keyboard sentence-mode coverage and responsive checks. Retry A5 served-artifact readback with a supported network/browser client. Keep the data adapter fail-closed and fixtures out of production.

## Latest checkpoint — 2026-11-06 22:47:38 UTC (post-merge A3 / PR #127 documentation checkpoint)

- At this checkpoint PUBLIC `main` is `b7fbb164682ed43f13db2168f24150bb99195dca` / tree `bcc33293df9228075931176126175281e4e30d4d`. It includes the keyboard-only synthetic lesson regression from [PR #126](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/126) at code commit `9f76dc3bd7d0d68fe262372a70746df6683a1ac4` and the docs-only checkpoint refresh from [PR #127](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/127). No runtime code, published content or language data changed in PR #127.
- Exact-head Verify [#42301981644](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42301981644), post-merge code Verify [#42302722763](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42302722763), and latest main Verify [#42306591061](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42306591061) succeeded. Latest-main logs report 232/232 unit tests and 66/66 Playwright tests (0 skipped), smoke, governance/data isolation, performance budget, committed-dist drift and all 12 Lighthouse profiles.
- Lighthouse accessibility scored 100/100 in all 12 profiles; mobile performance was 97–99/100 and desktop was 100/100. The latest verified public-site artifact [#13546327900](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42306591061/artifacts/13546327900) is 121,147 bytes; Lighthouse reports [#13546662795](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42306591061/artifacts/13546662795) are 1,302,024 bytes.
- CI reports 0 published learning items and no synthetic fixture markers in public dist. Cloudflare Workers Builds reported a successful technical production build for this checkpoint (build `04af8b72-d709-456c-ade2-20d5fa54991f`, version `fd6e715a-ecb7-4cef-bf37-a762ffcb8b04`). Direct live root, `robots.txt`, manifest and service-worker readback remains NOT_VERIFIED through available browser/web access, so A5 stays `blocked_external`.
- Readiness: ENGINEERING_READY=YES for the verified synthetic browser flow; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. The public catalog remains empty/noindex. No private Engine data was transferred and no public Git history was rewritten.

## Resume actions

1. Continue A3 synthetic keyboard/touch and responsive accessibility coverage across remaining game and lesson flows; keep PWA/offline, privacy, performance and fixture-isolation checks in the release suite.
2. Preserve the empty/noindex public catalog and current containment while real content rights and quality remain unverified.
3. Keep A5 blocked until a supported browser surface can read the live root, robots policy, manifest and service worker and tie the served artifact to the Cloudflare build.
4. Continue the PRIVATE data track independently; do not copy private metadata, language content or synthetic fixtures into this PUBLIC repository.

## Previous checkpoint — 2026-11-06 19:14:33 UTC (post-merge A3 touch coverage / PR #122)

- PUBLIC `main` is `e4ca2e0163a9474caa4f1bcb69846e2b7116ca11` / tree `c7a56df17e2204b7844074fb3376ffbf8935b91d`. [PR #122](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/122) adds isolated Playwright touch coverage at 320px for Matching Pairs selection/matching and Memory reveal, including horizontal-overflow checks. It changes tests only; no application bundle, public data, or linguistic content changed.
- Exact-head Verify [#42272405302](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42272405302) and post-merge main Verify [#42273286017](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42273286017) passed: 232/232 unit tests, 64/64 Playwright tests (0 skipped), smoke, governance/data isolation, performance budget, all 12 Lighthouse profiles, and committed-dist drift. Accessibility scored 100/100 in all profiles; mobile performance was 97–99/100 and desktop was 100/100.
- The verified main run uploaded public-dist artifact [#13532301213](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42273286017/artifacts/13532301213) (121,147 bytes) and Lighthouse reports [#13532741002](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42273286017/artifacts/13532741002). The production catalog remains empty/noindex, and CI's fixture/dist gates passed.
- GitHub check [Workers Builds #128083339947](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/128083339947) reports a successful Cloudflare production build for this main commit (build `4a322c21-4a02-4a3b-b471-5a5bc7516c6f`). This is a technical build result; direct live served-page and manifest readback remains NOT_VERIFIED, so A5 stays `blocked_external`.
- Readiness: ENGINEERING_READY=YES for the synthetic touch/browser slice; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Data Engine remains PRIVATE, and no private data was transferred.

## Previous checkpoint — 2026-11-06 17:44 UTC (post-merge A3 / PR #120)

- PUBLIC `main` is `23a41d304c233d751205c36b20a5c689babb88d1` / tree `9d25c824c8385108c6c468c79fb40586fd803988`. [PR #120](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/120) fixes the flashcards page entrypoint: changing topic refreshes the visible deck count, and rebuilt topic/filter/shuffle controls retain keyboard focus. The isolated fixture regression now exercises the actual `flashcards-page` bundle.
- Exact-head Verify [#42259978779](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42259978779) and post-merge main Verify [#42262685597](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42262685597) passed 232/232 unit tests and 63/63 Playwright tests (0 skipped), smoke, data/governance and synthetic-isolation checks, the performance budget, all 12 Lighthouse profiles, and committed-dist drift. Lighthouse accessibility scored 100 throughout; mobile performance ranged 97–100 and desktop scored 100. JavaScript is 195,023/196,608 bytes; CSS is 16,235/49,152 bytes.
- The main verified public-dist artifact is [#13525906624](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42262685597/artifacts/13525906624), 121,147 bytes (archive SHA-256 `51c63a5fb9d43fb10b8b534434d1399426a6df9d350f308050c4cb2a45ca8a4e`). CI confirmed 0 published learning items and no synthetic fixture markers in public dist.
- Cloudflare Workers Builds reported a successful production build for this merged main commit, build `9415fe00-d81a-4ca0-8edf-67c8085f0191`. Direct live-page/data/manifest readback is still unavailable through the current browser and web surfaces; therefore live served-artifact identity remains NOT_VERIFIED and A5 stays `blocked_external`. This is a technical deployment success, not content-learning readiness.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. The public catalog stays empty/noindex, and no private or synthetic learning content was transferred.

## Resume actions

1. Continue A3 synthetic keyboard/touch accessibility work across remaining games and lesson flows; keep responsive, PWA/offline, performance and privacy checks in the release suite.
2. Preserve current public containment and the empty/noindex catalog.
3. Retry direct live artifact readback through a supported surface; keep A5 blocked until the served artifact is inspected.
4. Continue the PRIVATE data track independently; do not copy metadata or language content into this PUBLIC repository.

## Previous checkpoint — 2026-11-06 15:39 UTC (post-merge A3 / PR #118)

- PUBLIC main `b5ec970b2f9eb9dd966a1e7dcb8797622ac2db7c` / tree `2ac18fd8855e9e3bfa96aa2368e78e8b85127c63`. [PR #118](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/118) implements accessible answer grouping and arrow-key movement with explicit activation, synthetic-only browser regression, and rebuilt hashed dist/SW.
- Exact-head [Verify #42241668236](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42241668236) passed 232 unit + 62 Playwright tests (0 skipped), release/data/isolation/smoke/performance/dist-drift gates, and 12 Lighthouse profiles (a11y 100; mobile performance 97–99; desktop 100). Dist artifact [13516426063](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42241668236/artifacts/13516426063), 121,011 bytes; public catalog 0; synthetic markers absent.
- Cloudflare branch build succeeded for `1e02c16d` / `1924a5c8-a6e9-48a0-818d-c68219c8d86a`. Merge commit has no returned Actions/combined-status record and direct live readback is inaccessible, so A5 stays blocked.
- Continue A3 synthetic keyboard/touch review. A1/A9/A12 remain approval-gated; public content stays empty/noindex. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

## Previous checkpoint — 2026-11-06 10:26 UTC (post-merge A3 / PR #116)

- PUBLIC main e5b9803b43364b370455e1f0ed65813548146bb9 / tree 7ffb3a7df6b8f32f32bdb71016dd49236a747393 after PR #116: a synthetic-only keyboard due-review regression checks wrong/difficult/correct ratings, progress, focus, queue advancement and empty state. No product data changed.
- Exact-head Verify #42200375587 and post-merge Verify #42201399171 passed 232 unit + 61 Playwright tests (0 skipped), release/data/isolation/smoke/performance/dist-drift gates and 12 Lighthouse profiles (a11y 100; mobile Performance 97–100; desktop 100).
- Verified dist artifact #13495405137 is 120,845 bytes; Lighthouse artifact #13494347357 is 1,291,462 bytes. CI confirms 0 published learning items and no synthetic fixture markers in dist.
- Cloudflare Workers Builds production check succeeded for build ec0db782-d156-43e1-ad00-b64bee5249d4. Direct Pages root, flashcards, manifest, robots and service-worker reads were inaccessible; live route contents and served-artifact identity remain NOT_VERIFIED.
- Historical corpus-shaped Git exposure remains documented; this test-only PR added no source data. No history rewrite; A9/A12 remain approval-gated. ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 synthetic keyboard/touch review of spaced-repetition and other game flows. Keep A5 blocked until direct live artifact readback succeeds.

## Previous checkpoint — 2026-11-06 07:38 UTC (post-merge A3 / PR #112)

- PUBLIC `main` is `2bd0a3be873776592dcec5d95ace24555ee19eed` / tree `7f8fac76a4402e818e7307cd3fca62eb0818dc4a` after [PR #112](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/112). Due-review flashcards now leave the current queue after a correct rating; remaining count and focus are updated, including the empty state. Regression is isolated to synthetic mobile fixtures.
- Exact-head Verify [#42179496857](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42179496857) and post-merge Verify [#42180710200](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42180710200) passed 232/232 unit and 60/60 Playwright tests (0 skipped), release/governance/data gates, build, smoke, performance budget, fixture isolation, dist drift, and 12 Lighthouse profiles. A11y 100 in all profiles; mobile performance 97–99; desktop 100.
- Post-merge artifacts: verified dist 13485810074 (120,845 bytes), Lighthouse 13485775134 (1,291,919 bytes). Public catalog is empty and synthetic markers are absent. Cloudflare production build `17935b84-700b-4b17-a68f-06d4e61ae482` succeeded; live routes could not be read due to host-resolution failure, so served artifact identity remains NOT_VERIFIED.
- ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue A3 synthetic-only keyboard/touch focus review. A5 remains blocked on supported live readback; A9/A12 remain approval-gated.

## Previous checkpoint — 2026-11-06 02:47 UTC (post-merge A3 / PR #110)

- PUBLIC `main` is `c4b07aa52d86e9a9ce755adb53609edb9bcdc219` / tree `d10cd03bd2f6674291c319bb0cd6e3d0d4f81e7f`, after docs checkpoint [PR #110](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/110). Product code remains from A3 [PR #109](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/109), which focuses the first prompt on quiz-mode, mistake-review, and due-first daily-practice entry.
- Post-merge Verify [#42150659318](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42150659318) passed 232/232 unit tests and 59/59 Playwright tests (0 skipped), release/governance/data gates, build, smoke, performance budget, fixture isolation, committed-dist drift, and 12 Lighthouse profiles. Accessibility scored 100/100 in every profile; mobile performance ranged 97–100 and desktop scored 100.
- The verified public dist artifact is [13471059701](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42150659318/artifacts/13471059701), 120,742 bytes; Lighthouse artifact [13472630074](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42150659318/artifacts/13472630074), 1,289,481 bytes. The release gate reports 0 published learning items/words/phrases/sentences and 0 warnings; synthetic fixture markers are absent from public dist.
- Cloudflare Workers Builds production check succeeded for current `main`, build `df37768e-e6a2-4056-bbfa-01a1b3e61029`. Direct reads of the homepage, manifest, and robots file were attempted via the available web reader and returned “not accessible”; live route contents and served-artifact identity remain NOT_VERIFIED.
- No private/restricted linguistic records or synthetic fixtures were published; thin-topic routes remain noindex and public Git history was not rewritten. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 keyboard/touch focus review through spaced repetition and answer/advance flows using synthetic fixtures. Keep A5 blocked pending direct live readback; keep A9/A12 historical-ref actions approval-gated.

## Previous checkpoint — 2026-11-06 02:10 UTC (post-merge A3 / PR #109)

- PUBLIC `main` is `c277d92214737c99f18c86f6caccbc4fffbaa2ac` / tree `a4092ddf83c1de3d9cf8ce0a3cd43f0fbb044779`, after [PR #109](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/109). Starting a quiz mode, mistake review, or due-first daily practice now focuses the first prompt; a daily-practice route no longer briefly mounts the previously saved mode. Browser regressions use isolated synthetic fixtures.
- Exact-head PR Verify [#42146950672](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42146950672) and post-merge Verify [#42147581255](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42147581255) passed 232/232 unit tests and 59/59 Playwright tests (0 skipped), release/governance/data gates, build, smoke, performance budget, fixture isolation, committed-dist drift, and 12 Lighthouse profiles. Accessibility scored 100/100 in all profiles; mobile performance ranged 97–100 and desktop scored 100.
- The post-merge verified public dist artifact is [13471025613](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42147581255/artifacts/13471025613), 120,742 bytes; Lighthouse artifact [13471040410](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42147581255/artifacts/13471040410), 1,290,770 bytes. The release gate reports 0 published items/words/phrases/sentences and 0 warnings; synthetic fixture markers are absent from public dist.
- Cloudflare Workers Builds reported production build success for this `main` commit, build `dd56e05c-739a-491f-8dd2-1a9e4d7a78ad`. Direct live route/asset readback and served-artifact identity remain NOT_VERIFIED; the available reader/browser surface cannot access the site host.
- No private/restricted linguistic records or synthetic fixtures were published; thin-topic routes remain noindex and public Git history was not rewritten. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with keyboard/touch focus through spaced repetition and answer/advance flows using synthetic fixtures. Keep A5 blocked pending live readback; keep A9/A12 historical-ref actions approval-gated.

## Previous checkpoint — 2026-11-06 01:28 UTC (post-merge A3 / PR #107)

- PUBLIC main is `e295415176bc975e5fa89ab444760263024b3aa0` / tree `b807e9f615652b497846f57df381465ace0b75c1`.
- PR #107 moves lesson focus through recognition prompt, typed recall, and summary; synthetic browser coverage asserts phase transitions and mistake-review focus.
- Exact-head [#42140435349](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42140435349) and post-merge [#42142771367](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42142771367) passed 232/232 unit and 58/58 Playwright tests, no skips, full build/smoke/governance/performance/fixture-isolation/dist-drift checks and 12 Lighthouse profiles. Accessibility was 100 in all profiles; mobile performance 96–100, desktop 100.
- Cloudflare production build `49333f68-771e-4b37-823e-ccfe428186b1` / version `70108076-9780-4522-bb80-fff973f53b6e` succeeded. Direct live readback and served-artifact identity remain NOT_VERIFIED; web reader and supported browser access are unavailable. The published catalog remains empty and synthetic markers are absent from public dist.
- ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue A3 with mistake-review/spaced-repetition keyboard and touch flows; A5 remains blocked pending live readback; A9/A12 history actions remain approval-gated.

## Previous checkpoint — 2026-11-05 16:16 UTC (post-merge PR #104)

- PUBLIC Webgame main is `81e9cde89197de8687e96fb7d3ebdbe805fec34f` / tree `e1bbc51b5877e58a7264a7c65dc99a9bd1cbd8b4`, after [PR #104](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/104). Starting Matching Pairs now moves keyboard focus to the first playable card. The isolated synthetic browser regression verifies keyboard entry, focus, and playable-card navigation.
- Exact-head Verify [#42057389466](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42057389466) and post-merge Verify [#42060522453](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42060522453) passed: 232/232 unit tests and 58/58 Playwright tests (0 skipped), site/governance checks, build, smoke, performance budget, synthetic/data gates, committed-dist drift, and all 12 Lighthouse profiles. Accessibility scored 100 in every profile; mobile Performance was 97–100 and desktop was 100.
- Main artifact `verified-public-site-dist-42060522453` (artifact ID 13431657237) is 120,649 bytes; Lighthouse artifact ID 13432136968 is 1,299,644 bytes. The published lesson catalog remains empty and synthetic fixture markers are absent from public dist.
- Cloudflare Workers Builds main check [#127360576746](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/127360576746) and its Cloudflare check [#127360991875](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/127360991875) succeeded for build `81da41df-5156-48f1-b812-33fbfe025bfb`, version `951100a4-4d18-4f88-914a-c6f9336c363e`. Provider deployment success is verified; direct homepage, manifest, service-worker, and robots readback remains NOT_VERIFIED because the available readers could not resolve the Pages host.
- No private/restricted records were added; thin-topic routes remain noindex; historical public refs were not rewritten. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with synthetic-only keyboard/touch review across the remaining learning flows. Keep A5 blocked until a supported live-readback surface is available; keep A9/A12 historical-ref actions approval-gated.


## Previous checkpoint — 2026-11-05 06:31 UTC

- PUBLIC Webgame main is `6e6bb40ec5f6610c7fc47a1d6ece498eb2148d15` / tree `530476e17f5e822d507a02f2fc80ef69b8c86703`, after [PR #96](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/96). Memory cards expose reveal state with `aria-pressed` and a covered-card label; first selection reveals immediately, duplicate selection is ignored, and mismatch cards hide in place after 700 ms. Focus returns only if the original target is still focused, so moving to another control before the timeout does not steal focus. Initial entry, matches, completion, New Round and board-size changes have deterministic focus behavior. Coverage uses isolated synthetic fixtures only.
- Exact-head Verify [#41979608080](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41979608080) and post-merge main Verify [#41980400093](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41980400093) passed: 232/232 unit tests, 55/55 browser tests (0 skipped), site/governance checks, build, smoke, performance budget, synthetic/data gates, committed-dist drift, and all 12 Lighthouse profiles. Accessibility was 100 in every profile; post-merge mobile Performance was 97–100 and desktop was 100.
- Main verified public artifact `verified-public-site-dist-41980400093` (artifact ID 13393004983) is 120,567 bytes; Lighthouse report artifact 13393847109 is 1,290,341 bytes. The published lesson catalog remains empty and synthetic fixture markers were absent from public dist.
- Cloudflare Workers Builds main check [#127089253525](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/127089253525) succeeded for build `935efce9-a7f4-4aae-828f-9d65d0d99a5c` (version `b7181d63-ccc9-4a09-93a1-ea157d566032`). This confirms the provider build; direct live route and asset readback remains NOT_VERIFIED because the available web reader could not access the Pages route.
- Thin-topic routes remain noindex under the product plan. No private or restricted language records were added to public artifacts; no history refs were rewritten.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with the highest unmet quiz/session/mistake-review keyboard and touch flow, using isolated synthetic fixtures. Keep publication gates closed while the real published catalog is empty; retain historical public-ref disposition as approval-gated.

## Previous checkpoint — 2026-11-05 05:00 UTC

- PUBLIC Webgame main is `dc16eba74905ecf119b89db16c3416c1f78faec3` / tree `505cbc2803e4ce708330d1f96f2b13fccb1c16df`, after [PR #94](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/94). Matching Pairs now announces selected cards with `aria-pressed`, ignores repeat selection of the same card, and restores focus after wrong/matched pairs, completion, size changes and new-round reset. Its isolated synthetic browser regression covers both wrong and successful pairs, selection state, focus order, completion and reset.
- PR exact-head Verify [#41969849993](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41969849993) and merged-main Verify [#41970641011](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41970641011) passed: 232/232 unit, 54/54 Playwright (0 skipped), site/governance checks, build, smoke, performance budget, synthetic/data gates, committed-dist drift, and all 12 Lighthouse profiles. Accessibility scored 100 in every profile; mobile Performance was 98–99 and desktop 100.
- Main artifact `verified-public-site-dist-41970641011` (artifact ID 13389740872) is 120,154 bytes; Lighthouse report artifact 13390065129 is 1,290,792 bytes. The published lesson list remains empty and synthetic fixture isolation passed; thin-topic routes remain noindex under the product plan.
- Cloudflare Workers Builds main check [#127058123382](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/127058123382) succeeded for build `25d19ff8-dc3b-4770-9110-097b09333d70`. This verifies provider build/deployment success only. Direct live route and asset readback remains NOT_VERIFIED; deployed artifact identity is not independently confirmed.
- The isolated local build and syntax checks passed; the local Playwright runner stalled before reporting a result. Exact-head and post-merge GitHub browser suites passed. No private or restricted language records were moved into public artifacts; no history refs were rewritten.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with Memory mode keyboard/assistive-state and deterministic focus review using isolated synthetic fixtures. Keep publication gates closed while the real published catalog is empty; retain historical public-ref disposition as approval-gated.


## Previous checkpoint — 2026-11-05 01:16 UTC

- PUBLIC Webgame main is `0d1b48a7e0c646dfdf23989ad54b082b463dc484` / tree `ee727ceefcb7b0d09a81e14a02b50a694cce6512`, merged from PR [#90](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/90). Flashcard Space no longer intercepts native button activation; focus returns to the current flashcard after flip or advance. Regression coverage uses isolated synthetic fixtures.
- Exact-head Verify [#41873033025](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41873033025) and post-merge main Verify [#41946847454](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41946847454) both succeeded: 232 unit tests, 53 browser tests (0 skipped), site/governance checks, build, E2E smoke, performance budget, synthetic fixture isolation and marker scan, committed-dist drift, plus 12 Lighthouse profiles. Main accessibility scored 100/100 throughout; mobile performance was 98/98/98/99/99/99 and desktop was 100/100 throughout.
- Main artifact `verified-public-site-dist-41946847454` (artifact ID 13379520720) is 120,002 bytes with SHA-256 `e61d69bd438702cf2b515ef23e8ae06ed25b57d07563068299ee2afbe3da0554`. The public-data gate reports 0 published items, words, genuine phrases, sentences, and warnings; synthetic markers are absent from dist and the catalog remains empty/noindex.
- Cloudflare Workers Builds main check [#126981587815](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/126981587815) succeeded for build `78b80c69-dde3-4487-823d-30657b204e72` (version `f16790e2-cf93-4dd1-b10d-a2a67b0b903e`). This confirms provider build success only. Direct live route and asset readback remains NOT_VERIFIED; deployed artifact identity is not independently confirmed.
- The focused local Playwright attempt could not reach loopback because local sockets are denied in this execution environment; both exact-head and merged-main GitHub browser runs passed. No private/restricted language records or synthetic fixtures were transferred into production; public Git history was not rewritten.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 keyboard/touch/accessibility review across the remaining browser learning flows, keep content empty/noindex pending rights and quality gates, and retry live readback through a supported surface. Historical public Git exposure remains approval-gated; no history rewrite was performed.

## Previous checkpoint — 2026-11-04 16:28 UTC


- PUBLIC Webgame remains PUBLIC at main HEAD/tree `130f5250f0d7777d2a2f12662a67c0782a1c069a` / `1df03fbadeacc7cccaf191d14d228acf46b99738` after PR [#88](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/88). Lesson multiple-choice quizzes now move keyboard focus to the next question prompt after “Lanjut”; Tab advances to the first answer. The browser regression uses isolated synthetic fixtures.
- Exact-head Verify run [#41861612699](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41861612699) completed successfully: 232/232 unit tests, 52/52 browser tests, build, E2E smoke, performance budget, synthetic-fixture isolation, synthetic marker scan, committed-dist drift, and 12 Lighthouse profiles passed. All profiles scored 100/100 accessibility; mobile performance was 98/98/98/99/99/99 and desktop was 100/100 throughout. The post-merge Verify run [#41866053326](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41866053326) also reports completed/success and its logs show the same checks; one check-run API projection remained queued after the run completed.
- Main data gate reports 0 published items, words, genuine phrases, sentences, and warnings. Synthetic values do not appear in public dist; the catalog remains empty/noindex. Main artifact `verified-public-site-dist-41866053326` (artifact ID 13342297440) is 119,821 bytes.
- Cloudflare Workers Builds main check [#126700673999](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/126700673999) succeeded for production build `c2323137-f0dc-4936-bac6-89f02d4e6633`. This confirms provider build success. Direct live-page readback through the configured reader remains NOT_VERIFIED; it could not access the expected Pages URL, so deployed artifact identity is not independently confirmed.
- No private Engine metadata, restricted corpus, or linguistic records were transferred. Historical public Git objects remain approval-gated; no history rewrite was performed.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue responsive keyboard/touch review across lesson, game, flashcard, and mistake-review flows using synthetic-only fixtures. Keep the public catalog empty/noindex. Retry live route and asset readback through a supported provider/browser surface.

## Previous checkpoint — 2026-11-04 12:44 UTC

- PUBLIC Webgame remains PUBLIC at main HEAD/tree `34aeb41db202c5bc9afbca9db0c3ec926754cd5d` / `87fc181cafb2d92a61277484fc04c029c93a0041` after PR [#84](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/84). It adds accessible native progress values to short quiz, mistake-review, mini-practice, and published-lesson phases, with synthetic-only browser coverage.
- Exact-head Verify [#41812445875](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41812445875) and merged-main Verify [#41828954994](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41828954994) succeeded. The main run passed 51 browser tests, build/smoke, committed-dist drift, synthetic-fixture isolation, and the public-data gate (0 learning items, 0 warnings). All 12 Lighthouse profiles passed: accessibility 100/100; mobile performance 97–100; desktop 100/100.
- Verified main `dist/` artifact `verified-public-site-dist-41828954994` was 119,725 bytes, SHA-256 `23069f7092260b129dbe988744274d3dfc81af01db28db4ea68d488bf2de5238`. It contains no synthetic fixture values; the public catalog remains empty/noindex.
- Production deployment and live site/manifest/service-worker/robots readback are NOT_VERIFIED. The expected `pages.dev` hostname derived from `wrangler.toml` returned a DNS resolution error; the connected tools do not expose Cloudflare Pages deployment status, and the actual custom domain is not identified in the repository. The GitHub artifact confirms the build only, not production serving.
- No private or restricted linguistic records were transferred. The historical public-history review stays open for owner-approved handling; no history rewrite or sensitive inventory expansion was performed.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue responsive browser learning/game engineering and synthetic-only end-to-end coverage; keep publication gates closed while real content is absent. Recheck provider/live deployment when the production URL or provider status is available.

## Previous checkpoint — 2026-11-04 07:05 UTC

- PUBLIC Webgame remains PUBLIC at main HEAD/tree `ee63d4e21568762003c72d636136d8b87d2a78c0` / `26eb36b8b89738c75aa84a7ad9efc48deb32b9e3` after PR [#79](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/79). It hardens progress item IDs at storage read/write boundaries and regenerates the five changed hashed JS bundles, HTML references and service-worker cache version. The change uses synthetic IDs only.
- Exact-head Verify [#41787423023](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41787423023) and merged-main Verify [#41788275173](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41788275173) both passed 231 unit + 48 browser tests, 0 skipped; smoke, performance budget, synthetic isolation, committed-dist drift and all 12 Lighthouse profiles passed. Accessibility was 100/100 for every profile; mobile performance 97–100 and desktop 100.
- Main artifact `verified-public-site-dist-41788275173` uploaded at 119,117 bytes (SHA-256 `107a95a12250ab367c9d533a2afcd83b498327aacba2112663b179742b6c1efd`, expires 2026-11-18). Site check found 0 published items, words, genuine phrases or sentences and 0 warnings; synthetic markers were absent from the public artifact. Catalog remains empty/noindex.
- Cloudflare Workers Builds returned technical success for the main production build `da933b84-195c-46b8-9320-3551adfcf0e0`. Direct live homepage, manifest, service-worker and robots.txt readback could not be accessed through the configured reader; production artifact identity remains NOT_VERIFIED.
- The data track remains PRIVATE with no publication-ready records. No private source metadata or linguistic data was transferred. ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- `PROGRESS_LOG.md` remains unchanged: automatic approval review rejected two attempted updates because a broad rewrite could carry forward restricted historical inventory/technical detail. No history rewrite was performed. A9 historical exposure remains approval-gated; A5 direct live readback remains externally blocked.

## Previous checkpoint — 2026-11-04 05:18:01 UTC

- PUBLIC Webgame main HEAD is `754a49b7a9ff60044f089a028ae1f6c40b3460c4` after checkpoint PR [#77](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/77). GitHub's connected API returns the commit SHA and diff but not its tree SHA; shell Git transport cannot resolve `github.com`, so no previous tree value is reused.
- Exact-head Verify [#41777307830](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41777307830) passed 229 unit tests, 48 browser tests, 0 skipped, smoke, performance budget, synthetic isolation, dist drift and 12 Lighthouse profiles. Accessibility was 100/100 throughout; mobile Performance ranged 97–99 and desktop was 100.
- Verified artifact `verified-public-site-dist-41777307830` (SHA-256 `05f2912be2463f21e07e042b3f21fb3bf7bfb82090de28b4e3bf048d0c0929b4`, expires 2026-11-18). Site check found 0 published items, words, genuine phrases or sentences and 0 warnings; synthetic markers are absent from public `dist/`.
- Cloudflare reported a successful build for PR head `45a5e85c9766131347843d1dfc3d11d0e8d7f14c` (build `fd2d5daa-87ea-4fb0-ae95-86b1fcc5b7d2`). The connected GitHub API returned no post-merge main workflow/status; live homepage/manifest/`sw.js`/`robots.txt` readback remains NOT_VERIFIED.
- The public catalog stays empty/noindex. Operational summaries now keep the repository boundary generic. `PROGRESS_LOG.md` remains unchanged pending an approved safe edit; no Git history rewrite was performed. A1 is blocked_approval, A5 is blocked_external, and A9 remains approval-gated. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: resolve the PROGRESS_LOG editing blocker, retrieve the current tree SHA and post-merge status through a supported GitHub surface, directly read back the live artifacts, and continue independent A3 browser engineering.


## Previous checkpoint — 2026-11-04 04:58:22 UTC

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

## Previous checkpoint — 2026-11-04 02:53 UTC

- PUBLIC Webgame main HEAD/tree is `30eec1764e9f146e5a2dbf54d54a4e33238d9fe9` / `eae051369b874faeb020fedbe4c917fa6019dde6` after CI artifact PR [#72](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/72). The workflow uploads the committed public `dist/` only after release verification and the committed-dist drift gate.
- Merged-main Verify [#41762006947](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41762006947) passed 229 unit tests, 46 browser tests (0 skipped), E2E smoke, performance budget, committed-dist drift, and 12 Lighthouse route/profile audits. Accessibility was 100/100 for all profiles; mobile performance 97–100 and desktop 100. JavaScript was 185,766/196,608 bytes; CSS was 15,766/49,152 bytes.
- The successful run uploaded `verified-public-site-dist-41762006947` (artifact SHA-256 `a9ebd254c70f08bc38b4ecae0d3cff43c15bc8f62da25927de9e1d206861e25d`, expires 2026-11-18). Release checks retain an empty/noindex public catalog (0 items, words, genuine phrases or sentences); synthetic fixtures remain test-only and the synthetic-isolation checks passed.
- GitHub's Cloudflare Workers Builds check reports technical success for this merge [build](https://dash.cloudflare.com/2276352cabac46c2c87ee34742cebd6b/workers/services/view/webgame-bataktoba-indo/production/builds/6fd51d49-e4b2-4433-8e0f-6a05d4066497). Direct live homepage, manifest, `sw.js`, and `robots.txt` readback remains NOT_VERIFIED: the connected reader could not access them and no compatible browser surface was available. A5 remains blocked_external.
- No Engine source-level metadata, restricted corpus, or language records were transferred to this PUBLIC repository. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A9 historical Git review remains approval-gated.
- Next: continue A3 responsive browser UX, game/lesson-flow quality, accessibility, PWA/offline, privacy/security, and synthetic-only end-to-end coverage independently of corpus readiness. Reattempt direct live readback when a supported browser/network surface becomes available; preserve the empty/noindex publication state.


## Previous checkpoint — 2026-11-03 09:47 UTC

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

### Next actions

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

## Next actions

1. Continue A3 browser engineering across responsiveness, PWA, accessibility, privacy and security. Current six-route Lighthouse baseline is 98–100 mobile, 100 desktop, and 100 accessibility.
2. Keep synthetic fixtures isolated and production datasets empty/noindex until real publication gates pass.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
4. Keep direct live readback unverified; distinguish provider build success from served-artifact inspection.
5. Preserve current history evidence and seek explicit owner authorization before any destructive history rewrite.

## Previous checkpoint (superseded: 2026-11-01 14:31 UTC)

### Archived checkpoint — 2026-11-01 14:31 UTC

- Webgame remains PUBLIC at main `00f8ab0049cbff8585cd554438166f4531f04c39` / tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`; PR #43 is merged and Issue #2 is closed. No PRs were open at the pre-checkpoint recheck.
- PR [#43](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/43) merged as `00f8ab0049cbff8585cd554438166f4531f04c39` (tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`); Issue #2 is closed. Exact-PR Verify [41313831063](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41313831063) and exact-main Verify [41315341826](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826) both passed. The merged-main run passed 216/216 unit tests (0 failed/skipped), E2E smoke, 37/37 Playwright/axe browser tests, JavaScript/CSS budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse report artifact: [13087012406](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826/artifacts/13087012406).
- Lighthouse Accessibility scored 100 across all route/profile audits; Performance was mobile 98/92/99/99/99/100 and desktop 100/99/100/100/100/100. Budgets pass at 178,590/196,608 JavaScript bytes and 15,766/49,152 CSS bytes.
- Cloudflare Workers Builds check [124874167176](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/124874167176) succeeded for production build `bf5b6270-f706-4df7-a3a8-9112aff78a1f`, version `a070d6b6-7be0-4117-b44a-01acd875d5d3`.
- Production remains empty/noindex: site check reports 0 published learning items (0 words, 0 genuine phrases, 0 sentences) and 0 warnings. Synthetic data remains isolated to browser tests; no private/restricted language data entered public source or dist. Direct live-page readback remains UNVERIFIED.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Next actions

1. Implement and measure A3 route payload/CLS improvements, prioritizing angka mobile CLS and unused JavaScript.
2. Continue exact-head unit/E2E/Lighthouse/budget/drift checks and Cloudflare build verification; distinguish technical deployment from learning readiness.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
4. Retry direct live readback when an accessible targetable provider/browser surface is available.
5. Keep ENGINEERING_READY, DATA_READY, PUBLICATION_READY, LEARNING_READY and MONETIZATION_READY separate.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.


## Mission and constraints

Build a useful responsive desktop and mobile browser game and browser PWA. Website engineering and private data research continue independently. Audio, pronunciation, and culture-led features are not current priorities.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Independent readiness gates

| Gate | Current rule |
|---|---|
| ENGINEERING_READY | Website features and isolated synthetic flows build and pass CI; does not imply language content is ready. |
| DATA_READY | Specific records have sufficient provenance, evidence, quality, topics, alternatives and per-game eligibility. |
| PUBLICATION_READY | Record rights and upstream scope explicitly permit public use. |
| LEARNING_READY | Lawful published lessons work end-to-end and production is checked. |
| MONETIZATION_READY | Separate future gate; no current priority. |

## Historical checkpoint — 2026-10-31 14:33 UTC

Public main is `730ff3fdd1db6190d70cc37774c3800db1e1602b` / tree `2e500141e4811ccbfc16db43207b3f866d1897fb`; PR #11 is merged. Verify run [#62 / 41207408541](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41207408541) passed 201/201 unit tests (0 skipped), 34/34 browser tests, build, E2E smoke, JS/CSS budget, 12 Lighthouse audits, and committed-dist drift. Lighthouse Performance (mobile/desktop): home 99/100, angka 93/99, games 98/100, flashcards 88/100, dictionary 93/100, progress 89/78; Accessibility 100 on every route/profile. Report artifact ID `13044757621`. Cloudflare Workers Builds verified production build `9236ed12-0264-47ef-8429-b6ae23453538` / version `7a3eec26-1e93-437b-8adb-0b7994330563`; direct live readback remains unverified.

The public artifact remains empty/noindex with 0 published items, words, genuine phrases, or sentences. Synthetic fixtures remain test-only; private/restricted content was not moved into this repository. Historical objects remain in earlier Git commits; no history rewrite was performed.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

Readiness: ENGINEERING_READY=YES for the merged and tested browser scope; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue public browser engineering and private metadata research independently. Inspect the progress desktop Lighthouse report and continue PWA/offline, responsive, privacy/security, accessibility, and live-readback work. Do not publish language records without rights and quality gates.

## Historical A2 checkpoint — 2026-10-31 10:47 UTC

Public A2 is integrated through PR #4, merge commit 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e. Verify run 41191955903 passed 193 unit tests, E2E smoke, 33 Playwright tests, drift check, and release prerequisites. Cloudflare Workers Builds reported production deployment success (build f6ede399-fa67-4960-b615-b5f5d5fdaed0; version b6ccda02-0d2d-44c3-ad4f-129deb03e89b). Direct live readback is unavailable, so do not call the live artifact verified. Published content remains empty; synthetic test data is intercepted and absent from production artifacts.

Historical corpus-derived snapshots were deleted from the current public tree by the A1 containment change. Older public Git commits retain those objects. No history rewrite was authorized or performed.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Historical next actions from A2 checkpoint

1. Continue A3 browser work on measured performance, PWA/offline behavior, accessibility, security, and live-site readback.
2. Keep the public content gates closed and all content arrays empty until rights and quality pass.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
4. Recheck private CI only when Actions can start; do not mark engineering validation complete without actual test logs.


## A3 performance budget — 2026-10-31 10:53 UTC

Branch `codex/2026-10-31-browser-performance-checkpoint-a3` adds `npm run performance:budget` to `verify:core`, plus unit coverage for individual and aggregate thresholds. The measured main baseline is 129,845 bytes of minified JS across 14 files and 15,217 bytes of CSS in one file. Budgets are 196,608 total JS bytes / 98,304 per JS file and 49,152 total CSS bytes / 49,152 per CSS file. These are uncompressed artifact limits; they do not claim Lighthouse scores or compressed transfer sizes. Verify workflow run #46 (`41194897354`, job `124518995179`) passed 196/196 unit tests, E2E smoke, 33/33 browser tests, `performance:budget`, release prerequisites, and dist drift. No full Lighthouse score audit or A3 production deployment is claimed yet; PR #5 remains open.

## A3 merged production checkpoint — 2026-10-31 11:18 UTC

PR #5 merged as `ffe009e9de10a1ddd144bb0a5d51be746f81b5cc`. Verify run #48 (`41195989468`) passed 196/196 unit tests (0 skipped), E2E smoke, 33/33 Playwright tests, asset-size budgets, release prerequisites, and dist drift. Cloudflare Workers Builds confirmed production build `de67c3c7-609a-437e-8e76-f4d7ccd26705` / version `cb3c2fd0-8648-4a89-b6bf-e7d766c69553`. The available web connector could not read the deployed home, games, robots.txt, or manifest, so live artifact readback remains unverified. Continue full Lighthouse measurement and PWA/security/accessibility work; keep published arrays empty.

## A3 measured Lighthouse and deployment checkpoint — 2026-10-31 12:03 UTC

Public main is `ce3338f0ac03fd56601db29c361bb8927b6ca247` (tree `4fb92b1df1cfcf31c07ee9932a524e2e43e7f580`); PR #7 is merged. Main Verify run [#52 / 41199134008](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41199134008) passed: 200/200 unit tests (0 skipped), 33/33 Playwright tests, smoke, data and asset checks, Lighthouse, and committed-dist drift. Site check reported 0 published items: 0 words, 0 genuine phrases, 0 sentences. Lighthouse measured mobile Performance 99/100 and Accessibility 100/100; desktop Performance 100/100 and Accessibility 100/100. The two JSON reports are in artifact `lighthouse-reports-41199134008` (ID `13041633182`, 14-day retention).

Cloudflare Workers Builds check `124531517252` reported production build `14592e21-73bd-40cc-b629-99fc4b58c422` successful for this commit. Direct readback of the deployed home, `/games`, `robots.txt`, and manifest was rejected as inaccessible by the available web connector. The provider build is verified; the live artifact has not been independently inspected.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

Next: extend measured browser coverage across key routes and journeys; continue responsive PWA/offline, accessibility, privacy, and security work; retry live artifact readback through an accessible route. Keep published arrays empty until record-level rights and quality gates pass.

## Current checkpoint — 2026-10-31 12:51:22 UTC

Public webgame main is `d5dc0a44786b4b12c20a4586a88dfa85406a68f5` / tree `26b3d94de0742ecca8759bd0ebe0a5caf4a465ff`; public PR #9 is merged. Main Verify run [#56 / 41202127852](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41202127852) passed 201/201 unit tests (0 skipped), 33/33 browser tests, 12 Lighthouse audits across six routes and two profiles, published-data checks, and committed-dist drift. Every Accessibility score is 100/100; Performance ranges from 78 (desktop progress) to 100 (home/games/flashcards/dictionary desktop). The 14-day report artifact is ID `13043018067`.

Cloudflare Workers Builds reports production build `aefb2216-8994-4e29-931d-4966a308b4aa` successful. Live artifact readback remains unverified because the deployed pages are inaccessible through the available web connector. No private or synthetic linguistic content is in public output; published data remains zero. Prior public Git commits still contain historical corpus objects; no history rewrite was performed.

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

Readiness: ENGINEERING_READY=YES for tested synthetic journeys, asset budget and six-route Lighthouse checks; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

## Next actions

1. Continue A3 responsive browser engineering: route-level payload/performance, PWA/offline, accessibility, privacy and security.
2. Preserve empty/noindex public learning content and keep synthetic fixtures isolated from production artifacts.
3. Continue Data Engine discovery and permitted collection only in its PRIVATE repository; resume from its current HANDOFF.md without repeating completed batches.
4. Verify live production Pages content directly through an accessible browser/reader before claiming live readback.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.




## 2026-11-05 post-merge checkpoint

Public audit and guards merged in PR #92 at `a7dbb578ccd7326c82944c7621437a7a76f06152` (tree `51b2f34001248cd8a2118412b72a1e66f84ed6b2`). PR Verify #41959632333, PR Workers Builds #127022450727, main Verify #41960577426, and main Workers Builds #127026190992 all succeeded. Main run passed 232/232 unit, 53/53 Playwright (0 skipped), smoke/performance budget, and all 12 Lighthouse profiles (Accessibility 100 desktop/mobile, mobile Performance 97–99, desktop Performance 100). Verified dist artifact #13384727740 is 120,002 bytes. Current source/dist catalog remains empty; thin-topic routes remain noindex. Historical public Git objects remain reachable; no refs were deleted or history rewritten. See [docs/PUBLIC_CONTENT_EXPOSURE_AUDIT_2026-11-05.md](docs/PUBLIC_CONTENT_EXPOSURE_AUDIT_2026-11-05.md). Continue website work independently; A12 history/ref disposition is blocked pending explicit owner approval. Live Pages readback remains NOT_VERIFIED.
