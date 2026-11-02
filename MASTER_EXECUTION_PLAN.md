# Master execution plan

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
4. Continue B24 discovery and rights work in the PRIVATE Engine independently; do not transfer private content or publish records without verified rights and quality gates.

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
3. Continue private B24 discovery independently; do not copy source-specific details or language content into this repository.
4. Keep direct live readback unverified; distinguish provider build success from served-artifact inspection.
5. Preserve current history evidence and seek explicit owner authorization before any destructive history rewrite.

## Previous checkpoint (superseded: 2026-11-01 14:31 UTC)

### Archived checkpoint — 2026-11-01 14:31 UTC

- Webgame remains PUBLIC at main `00f8ab0049cbff8585cd554438166f4531f04c39` / tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`; PR #43 is merged and Issue #2 is closed. No PRs were open at the pre-checkpoint recheck.
- PR [#43](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/43) merged as `00f8ab0049cbff8585cd554438166f4531f04c39` (tree `f4258c919a4377af9faf9d50e65c9adb18fb7c88`); Issue #2 is closed. Exact-PR Verify [41313831063](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41313831063) and exact-main Verify [41315341826](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826) both passed. The merged-main run passed 216/216 unit tests (0 failed/skipped), E2E smoke, 37/37 Playwright/axe browser tests, JavaScript/CSS budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse report artifact: [13087012406](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41315341826/artifacts/13087012406).
- Lighthouse Accessibility scored 100 across all route/profile audits; Performance was mobile 98/92/99/99/99/100 and desktop 100/99/100/100/100/100. Budgets pass at 178,590/196,608 JavaScript bytes and 15,766/49,152 CSS bytes.
- Cloudflare Workers Builds check [124874167176](https://github.com/drewsebastians/webgame-bataktoba-indo/runs/124874167176) succeeded for production build `bf5b6270-f706-4df7-a3a8-9112aff78a1f`, version `a070d6b6-7be0-4117-b44a-01acd875d5d3`.
- Production remains empty/noindex: site check reports 0 published learning items (0 words, 0 genuine phrases, 0 sentences) and 0 warnings. Synthetic data remains isolated to browser tests; no private/restricted language data entered public source or dist. Direct live-page readback remains UNVERIFIED.
- The Alignment Engine remains PRIVATE; B23 is still the latest completed batch and B24 remains metadata-only. No private language data was transferred here.

## Next actions

1. Implement and measure A3 route payload/CLS improvements, prioritizing angka mobile CLS and unused JavaScript.
2. Continue exact-head unit/E2E/Lighthouse/budget/drift checks and Cloudflare build verification; distinguish technical deployment from learning readiness.
3. Continue independent private B24 discovery without repeating B17–B23; keep all restricted content private and latest.json at B23 until a lawful reproducible collection passes.
4. Retry direct live readback when an accessible targetable provider/browser surface is available.
5. Keep ENGINEERING_READY, DATA_READY, PUBLICATION_READY, LEARNING_READY and MONETIZATION_READY separate.
6. Re-fetch both repositories' visibility, refs/trees, Issues, PRs, Actions and private latest.json before each batch; use expected SHAs and never rewrite public history.


## Mission and constraints

Build a useful responsive desktop and mobile browser game and browser PWA. Website engineering and private data research continue independently. Audio, pronunciation, and culture-led features are not current priorities.

Keep drewsebastians/batak-indo-alignment-engine PRIVATE. Never move private or restricted language text into the public repository, logs, external services, or build artifacts without verified record-specific rights and explicit publication scope. Do not rewrite public Git history.

For every batch, re-check both repository visibilities, main/tree SHAs, Issues, PRs, Actions and private latest.json. Use expected-SHA updates, non-force ref moves, tests and deployment evidence. Keep persistent STATUS, HANDOFF and WORK_QUEUE checkpoints current.

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

The Alignment Engine remains PRIVATE on main `cfec3baeb8beee4738c81fde73ba92b71755bc22`; B23 remains latest (DEGRADED). Private PR #3 remains open; run #17 failed before runner startup with zero steps, so no validator tests ran. Its B24 branch contains metadata-only discovery (14 rows, 0 permitted/acquired records). The approved private source vault remains unavailable.

Readiness: ENGINEERING_READY=YES for the merged and tested browser scope; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. Continue public browser engineering and private metadata research independently. Inspect the progress desktop Lighthouse report and continue PWA/offline, responsive, privacy/security, accessibility, and live-readback work. Do not publish language records without rights and quality gates.

## Historical A2 checkpoint — 2026-10-31 10:47 UTC

Public A2 is integrated through PR #4, merge commit 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e. Verify run 41191955903 passed 193 unit tests, E2E smoke, 33 Playwright tests, drift check, and release prerequisites. Cloudflare Workers Builds reported production deployment success (build f6ede399-fa67-4960-b615-b5f5d5fdaed0; version b6ccda02-0d2d-44c3-ad4f-129deb03e89b). Direct live readback is unavailable, so do not call the live artifact verified. Published content remains empty; synthetic test data is intercepted and absent from production artifacts.

Historical corpus-derived snapshots were deleted from the current public tree by the A1 containment change. Older public Git commits retain those objects. No history rewrite was authorized or performed.

Private B23 remains the latest completed batch. B24 is metadata-only and has produced no permitted records or consumer items. The current private validator PR cannot run because GitHub Actions fails before validator startup; run 41193636578 exposed no steps or logs. The approved private source vault remains unavailable.

## Historical next actions from A2 checkpoint

1. Continue A3 browser work on measured performance, PWA/offline behavior, accessibility, security, and live-site readback.
2. Keep the public content gates closed and all content arrays empty until rights and quality pass.
3. Continue B24 source discovery in parallel, metadata-only while rights or vault access are unresolved.
4. Recheck private CI only when Actions can start; do not mark engineering validation complete without actual test logs.


## A3 performance budget — 2026-10-31 10:53 UTC

Branch `codex/2026-10-31-browser-performance-checkpoint-a3` adds `npm run performance:budget` to `verify:core`, plus unit coverage for individual and aggregate thresholds. The measured main baseline is 129,845 bytes of minified JS across 14 files and 15,217 bytes of CSS in one file. Budgets are 196,608 total JS bytes / 98,304 per JS file and 49,152 total CSS bytes / 49,152 per CSS file. These are uncompressed artifact limits; they do not claim Lighthouse scores or compressed transfer sizes. Verify workflow run #46 (`41194897354`, job `124518995179`) passed 196/196 unit tests, E2E smoke, 33/33 browser tests, `performance:budget`, release prerequisites, and dist drift. No full Lighthouse score audit or A3 production deployment is claimed yet; PR #5 remains open.

## A3 merged production checkpoint — 2026-10-31 11:18 UTC

PR #5 merged as `ffe009e9de10a1ddd144bb0a5d51be746f81b5cc`. Verify run #48 (`41195989468`) passed 196/196 unit tests (0 skipped), E2E smoke, 33/33 Playwright tests, asset-size budgets, release prerequisites, and dist drift. Cloudflare Workers Builds confirmed production build `de67c3c7-609a-437e-8e76-f4d7ccd26705` / version `cb3c2fd0-8648-4a89-b6bf-e7d766c69553`. The available web connector could not read the deployed home, games, robots.txt, or manifest, so live artifact readback remains unverified. Continue full Lighthouse measurement and PWA/security/accessibility work; keep published arrays empty.

## A3 measured Lighthouse and deployment checkpoint — 2026-10-31 12:03 UTC

Public main is `ce3338f0ac03fd56601db29c361bb8927b6ca247` (tree `4fb92b1df1cfcf31c07ee9932a524e2e43e7f580`); PR #7 is merged. Main Verify run [#52 / 41199134008](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41199134008) passed: 200/200 unit tests (0 skipped), 33/33 Playwright tests, smoke, data and asset checks, Lighthouse, and committed-dist drift. Site check reported 0 published items: 0 words, 0 genuine phrases, 0 sentences. Lighthouse measured mobile Performance 99/100 and Accessibility 100/100; desktop Performance 100/100 and Accessibility 100/100. The two JSON reports are in artifact `lighthouse-reports-41199134008` (ID `13041633182`, 14-day retention).

Cloudflare Workers Builds check `124531517252` reported production build `14592e21-73bd-40cc-b629-99fc4b58c422` successful for this commit. Direct readback of the deployed home, `/games`, `robots.txt`, and manifest was rejected as inaccessible by the available web connector. The provider build is verified; the live artifact has not been independently inspected.

Readiness: ENGINEERING_READY=YES for the tested synthetic UX, asset budget, and Lighthouse baseline; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=deferred. Private B24 remains metadata-only and B23 remains latest; no restricted or synthetic linguistic text was transferred here. The Alignment Engine stays PRIVATE.

Next: extend measured browser coverage across key routes and journeys; continue responsive PWA/offline, accessibility, privacy, and security work; retry live artifact readback through an accessible route. Keep published arrays empty until record-level rights and quality gates pass.

## Current checkpoint — 2026-10-31 12:51:22 UTC

Public webgame main is `d5dc0a44786b4b12c20a4586a88dfa85406a68f5` / tree `26b3d94de0742ecca8759bd0ebe0a5caf4a465ff`; public PR #9 is merged. Main Verify run [#56 / 41202127852](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41202127852) passed 201/201 unit tests (0 skipped), 33/33 browser tests, 12 Lighthouse audits across six routes and two profiles, published-data checks, and committed-dist drift. Every Accessibility score is 100/100; Performance ranges from 78 (desktop progress) to 100 (home/games/flashcards/dictionary desktop). The 14-day report artifact is ID `13043018067`.

Cloudflare Workers Builds reports production build `aefb2216-8994-4e29-931d-4966a308b4aa` successful. Live artifact readback remains unverified because the deployed pages are inaccessible through the available web connector. No private or synthetic linguistic content is in public output; published data remains zero. Prior public Git commits still contain historical corpus objects; no history rewrite was performed.

The Alignment Engine remains PRIVATE on main `cfec3baeb8beee4738c81fde73ba92b71755bc22`; PR #3 head `ca4b41fa55d445fcc70b935156c55f8ca041fd71` and latest run #15 failed before validator startup with 0 steps. B23 remains latest; B24 is metadata-only and detailed source discovery stays in the private repo.

Readiness: ENGINEERING_READY=YES for tested synthetic journeys, asset budget and six-route Lighthouse checks; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.

## Next actions

1. Continue A3 responsive browser engineering: route-level payload/performance, PWA/offline, accessibility, privacy and security.
2. Preserve empty/noindex public learning content and keep synthetic fixtures isolated from production artifacts.
3. Continue Data Engine discovery and permitted collection only in its PRIVATE repository; resume from its current HANDOFF.md without repeating completed batches.
4. Verify live production Pages content directly through an accessible browser/reader before claiming live readback.
5. Re-fetch repository visibility, main/tree SHAs, Issues, PRs, Actions, deployments and private latest.json before the next write batch.
