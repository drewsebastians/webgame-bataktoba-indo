# Resume handoff — 2026-11-02 04:08 UTC

## Latest checkpoint — 2026-11-02 04:08 UTC

- Webgame is **PUBLIC** at main/tree `58d45ce5ed7bbb45fd601a0b7189712883ea1a07` / `43e33e64cf5e35f3df40e2492a00054250f50fc7`; PR #49 onboarding preference is merged. Exact-head Verify [41383644095](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41383644095) and exact-main Verify [41384190761](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41384190761) passed. Both included 221 unit tests (0 skipped), smoke, performance budget, 40 browser tests, dist drift and 12 Lighthouse audits. All Accessibility scores were 100; mobile Performance was 98/98/98/99/99/100 and desktop was 100 across the six audited routes.
- Cloudflare Workers Builds succeeded for production build `5f510877-edb8-4856-9ee7-7060e68085bd`. This verifies the provider build, not a direct live-page readback. The current runtime could not resolve the Pages hostname; `LIVE_READBACK=UNVERIFIED`.
- Checkpoint PR [#50](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/50) head `60bac460bb3b9a82d9f293dd34802acdb495b3a5` passed exact-head Verify [41385538415](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41385538415), including the full suite above. This follow-up documentation commit still needs its own exact-head run.
- The public catalog remains empty/noindex (0 learning items, words, genuine phrases and sentences); synthetic fixtures remain isolated from dist, and no private linguistic data was transferred. Issue #2 is closed; PR #50 is the only open Webgame PR at this checkpoint.
- Readiness: `ENGINEERING_READY=YES`; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.

### Resume actions

1. Finish PR #50 exact-head verification and merge only if its final head passes against the unchanged main SHA.
2. Retry a direct read-only fetch of home, Games, manifest and versioned JS from a network that resolves `pages.dev`; keep live readback unverified until artifact identity and public-data isolation are confirmed.
3. Continue A3 responsive UX, game/lesson flow, browser offline, privacy and security work with synthetic-only fixtures.
4. Keep the public catalog empty/noindex until rights, provenance, quality and publication gates pass; continue the private track independently.


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
- Continue private B24 work separately; keep all source-specific details and corpus artifacts private.
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
4. Exact-main Workers Builds succeeded (build `7bd60fc7-785d-4c3f-9648-233ae7354ac8`, version `04d00dca-64bb-4c83-bb23-86d60d2ea932`). Direct Pages readback remains unverified; treat the build as technical deployment evidence, not live-content inspection.
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

1. Re-fetch visibility, current main/tree SHAs, Issues, PRs, Actions and the private `latest.json` before each write batch.
2. Public main is `ce3338f0ac03fd56601db29c361bb8927b6ca247` / tree `4fb92b1df1cfcf31c07ee9932a524e2e43e7f580`. PR #7 merged. Verify run #52 / 41199134008 passed 200/200 unit (0 skipped), 33/33 browser, E2E smoke, asset budget, Lighthouse, and dist drift. Site check remains at zero published words/phrases/sentences.
3. Main Lighthouse scores: mobile 99 Performance / 100 Accessibility; desktop 100 / 100. Reports are artifact ID `13041633182`, `lighthouse-reports-41199134008`. Cloudflare Workers Builds production check passed for build `14592e21-73bd-40cc-b629-99fc4b58c422`. Direct live readback of home, games, robots and manifest remains inaccessible through the available web connector; do not describe the live artifact as independently verified.
4. Public content remains empty and noindex. Historical corpus objects remain in old Git commits; no history rewrite was performed. No private/restricted or synthetic language content was transferred to public.
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->
<!-- Cross-repository details omitted. -->


## Current resume checkpoint — 2026-10-31 12:51:22 UTC

1. Re-fetch both repository visibilities, main/tree SHAs, Issues, PRs, Actions and private `latest.json` before a new write batch.
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
