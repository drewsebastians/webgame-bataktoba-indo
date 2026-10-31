# Master execution plan

## Mission and constraints

Build a useful responsive desktop and mobile browser game and browser PWA. Website engineering and private data research continue independently. Audio, pronunciation, and culture-led features are not current priorities.

Keep drewsebastians/batak-indo-alignment-engine PRIVATE. Never move private or restricted language text into the public repository, logs, external services, or build artifacts without verified record-specific rights and explicit publication scope. Do not rewrite public Git history.

For every batch, re-check both repository visibilities, main/tree SHAs, Issues, PRs, Actions, and private latest.json. Use expected-SHA updates, non-force ref moves, tests and deployment evidence. Keep persistent STATUS, HANDOFF, and WORK_QUEUE checkpoints current.

## Independent readiness gates

| Gate | Current rule |
|---|---|
| ENGINEERING_READY | Website features and isolated synthetic flows build and pass CI; does not imply language content is ready. |
| DATA_READY | Specific records have sufficient provenance, evidence, quality, topics, alternatives, and per-game eligibility. |
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
