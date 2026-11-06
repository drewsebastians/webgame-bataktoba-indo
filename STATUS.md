# Execution status — 2026-11-06

## Latest checkpoint — 2026-11-06 10:26 UTC (post-merge A3 / PR #116)

- PUBLIC main e5b9803b43364b370455e1f0ed65813548146bb9 / tree 7ffb3a7df6b8f32f32bdb71016dd49236a747393 after PR #116: a synthetic-only keyboard due-review regression checks wrong/difficult/correct ratings, progress, focus, queue advancement and empty state. No product data changed.
- Exact-head Verify #42200375587 and post-merge Verify #42201399171 passed 232 unit + 61 Playwright tests (0 skipped), release/data/isolation/smoke/performance/dist-drift gates and 12 Lighthouse profiles (a11y 100; mobile Performance 97–100; desktop 100).
- Verified dist artifact #13495405137 is 120,845 bytes; Lighthouse artifact #13494347357 is 1,291,462 bytes. CI confirms 0 published learning items and no synthetic fixture markers in dist.
- Cloudflare Workers Builds production check succeeded for build ec0db782-d156-43e1-ad00-b64bee5249d4. Direct Pages root, flashcards, manifest, robots and service-worker reads were inaccessible; live route contents and served-artifact identity remain NOT_VERIFIED.
- Historical corpus-shaped Git exposure remains documented; this test-only PR added no source data. No history rewrite; A9/A12 remain approval-gated. ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 synthetic keyboard/touch review of spaced-repetition and other game flows. Keep A5 blocked until direct live artifact readback succeeds.
## Previous checkpoint — 2026-11-06 07:38 UTC (post-merge A3 / PR #112)

- PUBLIC `main` is `2bd0a3be873776592dcec5d95ace24555ee19eed` / tree `7f8fac76a4402e818e7307cd3fca62eb0818dc4a`, after [PR #112](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/112). Due-first flashcard review now rebuilds its queue after a correct rating, removes mastered cards, updates the remaining count, and moves focus to the next card or empty status. Coverage uses isolated synthetic mobile fixtures.
- Exact-head Verify [#42179496857](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42179496857) and post-merge Verify [#42180710200](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42180710200) succeeded: 232/232 unit tests and 60/60 Playwright tests, 0 skipped; release/governance/data gates, build, smoke, performance budget, fixture isolation, committed-dist drift, and all 12 Lighthouse profiles passed. Accessibility scored 100 in every profile; mobile Performance was 97–99 and desktop 100.
- Verified dist artifact [13485810074](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42180710200/artifacts/13485810074) is 120,845 bytes; Lighthouse artifact [13485775134](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42180710200/artifacts/13485775134) is 1,291,919 bytes. The public catalog remains empty (0 learning items/words/phrases/sentences), and synthetic markers are absent from dist.
- Cloudflare Workers Builds production check succeeded for build `17935b84-700b-4b17-a68f-06d4e61ae482`. Direct route and asset reads failed because the Pages host did not resolve from the available surfaces; served content and artifact identity remain NOT_VERIFIED.
- No private/restricted linguistic records or synthetic fixtures were published; thin-topic routes remain noindex and public Git history was not rewritten. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 keyboard/touch and focus review across lesson, quiz, mistake-review, and spaced-repetition answer/advance flows. Keep A5 blocked pending supported direct readback; keep A9/A12 historical-ref actions approval-gated.

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

- PUBLIC main is `e295415176bc975e5fa89ab444760263024b3aa0` / tree `b807e9f615652b497846f57df381465ace0b75c1`, after [PR #107](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/107). Lesson flow now moves focus to the first recognition prompt, then typed recall, then the completed-lesson summary. The isolated synthetic flow asserts recognition, recall, mistake review, and summary focus.
- Exact-head Verify [#42140435349](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42140435349) and post-merge Verify [#42142771367](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42142771367) passed 232/232 unit tests and 58/58 Playwright tests (0 skipped), site/governance checks, build, smoke, performance budget, synthetic isolation/data gates, committed-dist drift, and all 12 Lighthouse profiles. Accessibility scored 100/100 in every profile; mobile performance ranged 96–100 and desktop was 100.
- Main artifacts: `verified-public-site-dist-42142771367`, artifact ID 13469146205 (120,698 bytes); Lighthouse reports artifact ID 13468452733 (1,291,166 bytes). The site gate reports 0 published learning items/words/phrases/sentences and 0 warnings; synthetic markers remain absent from public dist.
- Cloudflare Workers Builds production check succeeded for build `49333f68-771e-4b37-823e-ccfe428186b1`, version `70108076-9780-4522-bb80-fff973f53b6e`. Provider deployment success is verified; direct live page/asset readback and served-artifact identity remain NOT_VERIFIED because the available web reader could not access the Pages host and no supported browser surface was available.
- No private/restricted records or synthetic linguistic fixtures were added to public artifacts; thin-topic routes remain noindex; public Git history was not rewritten. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Next: continue A3 with synthetic-only keyboard/touch and focus review for mistake review and spaced repetition. Keep A5 blocked until live readback is possible; keep A9/A12 historical-ref actions approval-gated.

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


## Previous verified main checkpoint — 2026-11-01 16:41 UTC

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

## Resume actions

1. Continue A3 browser UX, PWA/offline, accessibility, privacy and security work independently of data readiness; keep performance regressions below the existing 95 Lighthouse threshold.
2. Preserve the empty/noindex published catalog and synthetic-only browser fixtures.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
4. Keep live production readback UNVERIFIED until a live artifact is directly inspected.
5. A9 historical public Git-history removal is blocked pending explicit owner approval; meanwhile preserve current-tree containment and the evidence-only audit.

## Previous checkpoint (superseded: 2026-11-01 14:31 UTC)

## Latest verified main checkpoint

- Repository is PUBLIC. Main is `00f8ab0049cbff8585cd554438166f4531f04c39` / tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`. PR #43 is merged; Issue #2 is closed. No other PRs were open at the recheck before this documentation branch.
- PR [#43](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/43) merged as `00f8ab0049cbff8585cd554438166f4531f04c39` (tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`); Issue #2 is closed. Exact-PR Verify [41313831063](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41313831063) and exact-main Verify [41315341826](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826) both passed. The merged-main run passed 216/216 unit tests (0 failed/skipped), E2E smoke, 37/37 Playwright/axe browser tests, JavaScript/CSS budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse report artifact: [13087012406](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826/artifacts/13087012406).
- Accessibility scored 100 on all 12 route/profile audits. Lighthouse Performance is mobile 98/92/99/99/99/100 and desktop 100/99/100/100/100/100 for home/angka/games/flashcards/dictionary/progress.
- Performance budgets pass: JavaScript 178,590/196,608 bytes across 18 files; CSS 15,766/49,152 bytes.
- Cloudflare Workers Builds check [124874167176](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/124874167176) succeeded for production build `bf5b6270-f706-4df7-a3a8-9112aff78a1f`, version `a070d6b6-7be0-4117-b44a-01acd875d5d3`.
- Production remains empty/noindex: site check reports 0 published learning items (0 words, 0 genuine phrases, 0 sentences) and 0 warnings. Synthetic data remains isolated to browser tests; no private/restricted language data entered public source or dist. Direct live-page readback remains UNVERIFIED.

## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES | Exact-main Verify 41315341826 passed build, unit, smoke, browser/axe, budget, Lighthouse and dist-drift checks; Cloudflare production build succeeded. |
| DATA_READY | NO | Public learning data remains empty. |
| PUBLICATION_READY | NO | Record-level rights and explicit scope approvals are not established. |
| LEARNING_READY | NO | No real production learning content; synthetic tests do not establish learning readiness. |
| MONETIZATION_READY | DEFERRED | Separate decision; not a current priority. |

## Resume actions

1. Continue A3 route performance work, prioritizing the measured mobile angka CLS (0.145) and its unused JavaScript opportunity (70,418 bytes); preserve synthetic-only game fixtures.
2. Keep public content empty/noindex until data meets rights, provenance, schema and quality gates.
3. Retry direct live readback through an available provider/browser surface; retain UNVERIFIED until the live artifact is inspected.
4. Continue website and private data work independently; transfer no private language content.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.

## Previous checkpoint (superseded: 2026-11-01 10:32 UTC)
## Latest branch checkpoint (PR #39 validation pending)

- Repository is PUBLIC. Verified base main is `3c5d3946c3ef3dd0eea756fbc8235f047ce39c76`, root tree `5f2c37f38e3232967827f52b8da93e91e1937eca`.
- PR #39 adds a unit-tested Lighthouse diagnostics threshold: report route/profile metrics and top measured opportunities whenever Performance is below 95. This includes the current flashcards mobile score of 90 and dictionary mobile score of 93, which the prior below-90 condition did not report.
- Code commits are `e5946caaa0eb898e499b64144c9ed2bc7e0f8498` and `3eeea62d35ad22914e3ab7cbfeaebb381293c421`. Base main Verify run [41296159704](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41296159704) passed 215/215 unit tests, E2E smoke, 36/36 Playwright tests, budgets, 12 Lighthouse audits and committed-dist drift. PR #39 checks are pending at this checkpoint.
- Baseline Lighthouse Accessibility scored 100 on all route/profile audits. Mobile Performance for home/angka/games/flashcards/dictionary/progress was 98/94/98/90/93/100; desktop was 100/99/100/100/100/100. This PR is intended to expose metrics and opportunities for routes below 95.
- Exact-main Workers Build succeeded for base main (build `3f906f04-f715-44c1-8e11-476bf5ed5235`, version `31d30c5e-8144-4fdb-907c-50f651e7df5a`). Direct Pages readback remains UNVERIFIED; provider build success does not verify the live artifact.
- Production remains empty/noindex: 0 published items, words, genuine phrases, sentences and warnings. Synthetic fixtures remain test-only; Git history was not rewritten.

## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES for current browser flows and exact-main CI; PR #39 diagnostics refinement pending | Base main Verify run 41296159704 passed unit, smoke, browser, budget, Lighthouse and dist-drift checks. |
| DATA_READY | NO | Published learning data remains empty. |
| PUBLICATION_READY | NO | No record-level public rights and upstream scope authorization. |
| LEARNING_READY | NO | No real production learning content; synthetic tests do not establish learning readiness. |
| MONETIZATION_READY | DEFERRED | Separate future gate; not a current priority. |

## Resume actions

1. Await PR #39 checks, inspect its Lighthouse metric/opportunity output for flashcards and dictionary, then implement the highest-value measured mobile fix.
2. Retry direct Pages readback through a targetable provider/browser surface. Keep live production UNVERIFIED until the actual artifact is inspected.
3. Keep content empty/noindex and fixtures synthetic until source rights, provenance, quality and publication gates pass.
4. Keep data and rights evidence in the repository where it is authorized; do not transfer any record before verifying its publication rights.
5. Re-fetch both repositories, visibility, main/tree, Issues, PRs, Actions and checkpoints before the next write batch.


## Previous checkpoint (superseded: 2026-11-01 10:00 UTC)

## Latest branch checkpoint (PR #39 validation pending)

- Repository is PUBLIC. Verified base main is `3c5d3946c3ef3dd0eea756fbc8235f047ce39c76`, root tree `5f2c37f38e3232967827f52b8da93e91e1937eca`.
- PR #39 adds a unit-tested Lighthouse diagnostics threshold: report route/profile metrics and the top three measured opportunities whenever Performance is below 95. This includes the current flashcards mobile score of 90 and dictionary mobile score of 93, which were omitted by the old below-90 condition.
- Code commits are `e5946caaa0eb898e499b64144c9ed2bc7e0f8498` and `3eeea62d35ad22914e3ab7cbfeaebb381293c421`. PR #39's base main Verify run [41296159704](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41296159704) passed 215/215 unit tests, E2E smoke, 36/36 Playwright tests, budgets, 12 Lighthouse audits and committed-dist drift. PR #39 checks are pending at this checkpoint.
- Baseline Lighthouse Accessibility scored 100 on all route/profile audits. Mobile Performance for home/angka/games/flashcards/dictionary/progress was 98/94/98/90/93/100; desktop was 100/99/100/100/100/100. Current diagnostics do not yet include metric or opportunity details; PR #39 is intended to expose them in CI.
- Exact-main Workers Build succeeded for base main (build `3f906f04-f715-44c1-8e11-476bf5ed5235`, version `31d30c5e-8144-4fdb-907c-50f651e7df5a`). Direct Pages readback remains UNVERIFIED; a provider build alone does not verify the live artifact.
- Public production remains empty/noindex: 0 published items, words, genuine phrases, sentences and warnings. Synthetic fixtures remain test-only; no private/restricted linguistic data was transferred. Git history was not rewritten.

## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES for current browser flows and exact-main CI; PR #39 diagnostics refinement pending | Base main Verify run 41296159704 passed unit, smoke, browser, budget, Lighthouse and dist-drift checks. |
| DATA_READY | NO | Published learning data remains empty. |
| PUBLICATION_READY | NO | No record-level public rights and upstream scope authorization. |
| LEARNING_READY | NO | No real production learning content; synthetic tests do not establish learning readiness. |
| MONETIZATION_READY | DEFERRED | Separate future gate; not a current priority. |

## Resume actions

1. Await PR #39 checks, inspect its Lighthouse metric/opportunity output for flashcards and dictionary, then implement the highest-value measured mobile fix.
2. Retry direct Pages readback through a targetable provider/browser surface. Keep live production UNVERIFIED until the actual artifact is inspected.
3. Keep content empty/noindex and fixtures synthetic until source rights, provenance, quality and publication gates pass.
<!-- Cross-repository details omitted. -->
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.


## Previous checkpoint (superseded: 2026-11-01 10:00 UTC)

## Latest verified merged-main checkpoint

- Repository visibility is PUBLIC. Main HEAD is `84c05624f959f235d16a790d3c479e74f68b9564`; root tree SHA is `e67bd8ecbc0651afb37899a801f3b25195d35028`, fetched from GitHub Git Data.
- PR #35 (README pins), PR #36 (operational checkpoint), and PR #37 (CI step order) are merged; Issue #2 is closed and no PRs were open after the merge.
- Exact-main Verify run [41295166507](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41295166507) passed 215/215 unit tests (0 failed, 0 skipped), E2E smoke, 36/36 Playwright tests, JS/CSS budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse artifact: [13078943622](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41295166507/artifacts/13078943622).
- Lighthouse Accessibility scored 100 on all route/profile audits. Mobile Performance for home/angka/games/flashcards/dictionary/progress was 98/92/98/90/93/100; desktop was 100/99/100/100/100/100. Budgets: JS 178,003/196,608 bytes across 18 files; CSS 15,698/49,152 bytes.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
- Production remains empty/noindex: 0 published items, words, genuine phrases, sentences and warnings. Synthetic fixtures remain test-only; no private/restricted language data was transferred. Git history was not rewritten.


## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES for current browser flows, fail-closed adapter, security checks and exact-main CI | Main Verify run 41295166507 passed unit, smoke, browser, budget, Lighthouse and dist-drift checks. |
| DATA_READY | NO | Published learning data remains empty. |
| PUBLICATION_READY | NO | No record-level public rights and upstream scope authorization. |
| LEARNING_READY | NO | No real production learning content; synthetic tests do not establish learning readiness. |
| MONETIZATION_READY | DEFERRED | Separate future gate; not a current priority. |


## Resume actions

1. Continue A3 browser engineering; investigate mobile Performance on flashcards (90) and dictionary (93), then PWA/offline, accessibility, privacy/security and responsive UX.
2. Retry direct Pages readback through a targetable provider/browser surface. Keep live production UNVERIFIED until the actual artifact is inspected.
3. Keep content empty/noindex and fixtures synthetic until source rights, provenance, quality and publication gates pass.
- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.


## Previous checkpoint (superseded: 2026-11-01 00:50 UTC)

## Previous checkpoint (superseded: 2026-11-01 00:50 UTC)

# Execution status — 2026-11-01 00:50 UTC

### Snapshot as of 00:50 UTC (superseded)

- Repository visibility: PUBLIC. Current main/tree: ca7bc9842a57b0765d0b33b5bf517c4b5de485b5 / e6485a749114b9086b5e628270f5e2bb7546c21f. PR #23 (adapter) and PR #24 (checkpoint) are merged.
- Main Verify #108 / run 41257990728 passed on main: 211/211 unit tests (0 failed, 0 skipped), E2E smoke, 36/36 Playwright tests, JS/CSS budgets, committed-dist drift and 12 Lighthouse audits. Report artifact: https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41257990728/artifacts/13063919161.
- Lighthouse accessibility scored 100/100 across every route/profile. Mobile performance: home 99, angka 92, games 98, flashcards 90, dictionary 93, progress 100. Desktop: home 100, angka 99, games 100, flashcards 100, dictionary 100, progress 100.
- The fail-closed adapter preserves part of speech, orthography, example-use reference, context note, alternatives, sense, topics, provenance and per-game eligibility. Adapter tests use synthetic-only fixtures.
- Cloudflare Workers Builds reported success for this exact main SHA in its production service: build 191555d0-5483-4ca9-a0f6-e4fa0d597d5c, version 45ae3539-c79c-49ec-aa83-8041d9d9cb10. This verifies provider build/deployment status. Direct readback of home, dictionary, robots.txt and manifest remains unavailable through connected browser surfaces, so the live artifact is not marked production-verified.
- Main verification measured 0 published learning items, 0 words, 0 genuine phrases, 0 sentences and 0 warnings. Synthetic fixtures remain test-only; no private/restricted text was transferred and public Git history was not rewritten.

## Readiness gates

| Gate | State | Evidence |
|---|---|---|
| ENGINEERING_READY | YES for the merged adapter and synthetic/browser verification scope; wider A3 work continues | Main Verify #108 passed unit, smoke, browser, budget, Lighthouse and drift gates. |
| DATA_READY | NO | No approved learning records are available for public consumption. |
| PUBLICATION_READY | NO | No verified record-level publication rights and upstream scope grant. |
| LEARNING_READY | NO | Production repository data is empty; synthetic tests do not establish real-content readiness. |
| MONETIZATION_READY | DEFERRED | Separate future gate, not a current priority. |

## Resume actions

- Private-track progress and source-level rights remain checkpointed in the private repository. No private metadata, restricted records, or language content is copied into this public repository.
2. Continue A3 browser work independently: responsive UX, PWA/offline, accessibility, privacy/security and route performance.
3. Retry direct live artifact inspection when an available browser surface can reach the configured Pages host.
<!-- Cross-repository details omitted. -->




## 2026-11-05 post-merge public exposure checkpoint

- Audit and CI guards merged as PR #92, commit `a7dbb578ccd7326c82944c7621437a7a76f06152`, tree `51b2f34001248cd8a2118412b72a1e66f84ed6b2`. Report: [docs/PUBLIC_CONTENT_EXPOSURE_AUDIT_2026-11-05.md](docs/PUBLIC_CONTENT_EXPOSURE_AUDIT_2026-11-05.md).
- PR Verify #41959632333 and PR Workers Builds #127022450727 succeeded. Post-merge main Verify #41960577426 and Workers Builds #127026190992 succeeded: 232/232 unit, 53/53 Playwright (0 skipped), smoke and performance budget passed; all 12 Lighthouse profiles passed (Accessibility 100 desktop/mobile, mobile Performance 97–99, desktop Performance 100).
- Verified main artifact #13384727740 is 120,002 bytes. Current source and dist published items and lessons remain 0; raw/candidate/legacy paths remain absent from current main. Thin-topic routes remain noindex; dictionary/data-source routes are indexable by product intent.
- The metadata-only history audit found old content still reachable from main history and merged PR #1 branch head. No ref deletion or history rewrite occurred. A11 is done; A12 remains blocked pending explicit owner authorization for history/ref disposition.
- Direct live Pages readback is NOT_VERIFIED. Local targeted tests could not run in this managed shell; exact-head CI passed the full verification workflow.
