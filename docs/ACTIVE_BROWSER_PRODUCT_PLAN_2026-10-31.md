## Latest execution checkpoint — 2026-11-14 12:18 UTC (PR #197 and post-merge verification confirmed)

- Reverified that Webgame is PUBLIC. At this checkpoint, main is `e510f811b594924e48a4d572f99cd4916ba2ee8f` / tree `34f1c367441c47599613864abcdfc7693c335ec6`; the checkpoint branch started from the same exact head. PRIVATE Alignment Engine main was rechecked at `779d5c34a5c56c979fdd48d6c836f7c29763e7ae` / tree `1c4913dae0a641dbb0e4015be24b25304ea3b8e9`. The private track remains metadata-only/rightsgated at this point; no data was transferred to this public repository.
- Docs PR [#197](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/197) merged at `e510f811b594924e48a4d572f99cd4916ba2ee8f`. Its exact-head Verify run [#43422127399](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43422127399) completed successfully on PR head `4175730cc874834d5f5f3de01d6b34343d862bbc`. Post-merge main Verify [#43586550390](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43586550390) completed successfully on the merged main commit; the verify job passed.
- Post-merge artifact verified-public-site-dist-43586550390 is 117,983 bytes, SHA-256 `80d325622aa7540bb1649bf0137ab6744cec11fc49f9af3d84d3b9365f618839`. Lighthouse artifact digest: `b7d4fbbddb03a2da1902493692c617caf61921b8be035b6c21d1b4758f259e33`. The run verifies the main build and artifact checks; the artifact is not proof of what a live hostname serves.
- Earlier product PR [#194](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/194) release checks passed 241/241 unit tests and 86/86 browser tests (0 skipped), smoke, axe, performance budget, artifact integrity, synthetic-fixture isolation and 12 Lighthouse route/device audits. The public catalog remains empty/noindex with zero published learning items; synthetic fixtures are test-only.
- Cloudflare reported a successful deployment for PR #197 head 4175730 (Nov 13). A direct readback of https://webgame-bataktoba-indo.pages.dev/ was attempted at this checkpoint, but the available reader reported the URL inaccessible. Live production route and served content therefore remain NOT_VERIFIED; provider status and CI artifacts do not establish live artifact identity.
- Readiness remains separate: ENGINEERING_READY=YES for the verified engineering and release pipeline; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. No real linguistic content is being published. A1 remains approval-gated; no history rewrite and no PROGRESS_LOG.md edit.
- Resume with the next independent A3 responsive/accessibility/browser-flow priority using isolated synthetic fixtures. Keep A5 blocked_external until a confirmed production hostname can be read back and matched to the current main artifact. Continue Engine discovery and rights work independently.

## Latest execution checkpoint — 2026-11-13 11:45 UTC (PR #195 merged; post-merge main Verify completed)

- Reverified PUBLIC Webgame main at `75fb5dc98ca25b962e8fc1d6ec195bd56f4763eb` / tree `fec8d37ace3e9e1234933004f2dd3f2ff98e96cd`. PRIVATE Alignment Engine main is `e2d8281ed833ce7a27f4ea82ee3a4944edb6c68e` / tree `356634b7aa00bf6e70538733c82764eb71665f81`; no private Engine content moved to Webgame.
- Product PR [#194](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/194) merged as `afd19f38820bc4d84a30c28002097bbf37e945df`. It marks the current top-level navigation link with `aria-current="page"` and adds route-level browser regression coverage. Exact-head Verify [#43413123930](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43413123930) and main Verify [#43415038919](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43415038919) passed.
- Docs checkpoint PR [#195](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/195) merged as `75fb5dc98ca25b962e8fc1d6ec195bd56f4763eb`. Its exact-head Verify [#43416481620](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43416481620) and post-merge main Verify [#43418795474](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43418795474) both passed, including full verification, committed-dist drift, and public-artifact upload. Main artifact `verified-public-site-dist-43418795474` is 117,983 bytes; artifact archive SHA-256 `b4d0814647e8fa1e0a8947eed8ea22d5d88ba12d7977af5439f6e9fc77e571c2`.
- PR #194 local release verification passed 241/241 unit and 86/86 browser tests (0 skipped), smoke, axe, performance budget, committed-dist drift, artifact integrity, synthetic-fixture isolation, and 12 Lighthouse route/device audits. The release check reported zero published learning items and zero warnings. The public catalog remains empty and noindex; synthetic fixtures remain test-only.
- Cloudflare's bot reported successful deployment for PR head `973a4e9`. The expected pages.dev route is still inaccessible through the web reader, so the served live route/content remains NOT_VERIFIED. CI artifact and provider status verify technical build results, not live-route identity.
- Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED. A1 remains approval-gated; no history rewrite or `PROGRESS_LOG.md` edit.
- Resume with the next independent A3 responsive/keyboard game-flow gap. Keep A5 `blocked_external` until a confirmed production hostname can be read back and matched to the current main artifact; continue private Engine discovery and rights work independently.

## Latest execution checkpoint — 2026-11-13 11:18 UTC (PR #194 merged; primary navigation announces the current page)

- Reverified PUBLIC Webgame main at `afd19f38820bc4d84a30c28002097bbf37e945df` / tree `927ade3b583aba0397d6ce204d84e9894e72cf64`. Alignment Engine remains PRIVATE at `e6b69620af87351b8aa5d68bc54ecf441fa70580` / tree `0793668de8150cbc1554600420b57052f94fbaca`; no private Engine material moved to Webgame.
- Webgame PR [#194](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/194) merged as `afd19f38820bc4d84a30c28002097bbf37e945df`. The primary navigation now sets `aria-current="page"` for the matching top-level route, leaves topic lessons unmarked, and has browser regressions for all main routes.
- Exact-head Verify [#43413123930](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43413123930) and merged-main Verify [#43415038919](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43415038919) succeeded. Local release verification passed 241/241 unit tests and 86/86 browser tests (0 skipped), smoke, axe, performance budget, committed-dist drift, artifact integrity, synthetic-fixture isolation, and all 12 Lighthouse route/device audits. The release check reported zero published learning items and zero warnings.
- Main run uploaded `verified-public-site-dist-43415038919` (117,983 bytes; artifact archive SHA-256 `fd5cb03b1db774c132329cdb04c89ad3a06d06c781da1f495ff33a3689ce209b`). The artifact is tied to the merged main commit. Cloudflare's bot reported successful deployment for PR head `973a4e9`; this is provider status for that PR commit, not a direct live-route readback.
- Direct readback of the expected pages.dev URL is still NOT_VERIFIED: the web reader reports the route is inaccessible. Keep A5 `blocked_external` until the production hostname serves HTML/assets that can be matched to the main artifact. Do not claim production content is verified.
- The public catalog remains empty and noindex; synthetic fixtures remain test-only. Readiness: ENGINEERING_READY=YES; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- No historical public Git refs were rewritten. A1 remains approval-gated; do not modify `PROGRESS_LOG.md` while that gate is unresolved.
- Resume with the next independent A3 browser-flow/accessibility priority, retry direct live readback only through a supported hostname, and continue private metadata/rights work independently in the Engine.

## Latest execution checkpoint — 2026-11-13 09:50 UTC (PR #192 merged; dictionary disclosure accessible)

- Reverified PUBLIC Webgame main at `daeeaff5d78b91b41bd12f21c4605a2e5f754d55` / tree `5155813a2b6cd64380a2e2a7fe03216f63e4e524`. PRIVATE Alignment Engine main was `a938d6a58f5a5067aa016a70af427b7f5c9bba8f` at this checkpoint; private PR [#252](https://github.com/drewsebastians/batak-indo-alignment-engine/pull/252) adds one rights-gated, metadata-only B24 record. Its exact-head CI is running as run `43404502700`; no Engine data has moved to Webgame.
- Webgame PR [#192](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/192) merged at `daeeaff5d78b91b41bd12f21c4605a2e5f754d55`. Dictionary results now use a native disclosure button, preserve keyboard focus during rerender, and keep action buttons as separate controls. Added isolated synthetic browser checks for keyboard activation, focus restoration, axe, 44px targets, and no horizontal overflow at 320px.
- Exact-head Verify [#43398893946](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43398893946) and post-merge main Verify [#43399961053](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43399961053) both succeeded. Local verification recorded 241/241 unit and 85/85 Playwright browser tests (0 skipped); smoke, axe, Lighthouse, performance budget, artifact integrity, synthetic-fixture isolation, and committed-dist drift gates passed.
- Main run uploaded `verified-public-site-dist-43399961053`, 117,853 bytes, SHA-256 `63f91af76e505cab172413ecd0d4f320782a3833174933b653abf4e3150956b5`. All 12 Lighthouse route/device audits passed; dictionary scored performance 99 mobile / 100 desktop and accessibility 100 on both. The published catalog remains empty; test-only synthetic language records remain isolated from production artifacts.
- Cloudflare's bot reported a successful build/deployment for PR commit `cfa0f3b`. A direct production readback is still NOT_VERIFIED: the expected `webgame-bataktoba-indo.pages.dev` URL was inaccessible through the web reader, no browser surface was available, and a read-only network request returned a DNS “no such host” error. The artifact and provider status verify technical build results, not the content served at a live route.
- A5 remains `blocked_external`; A1/A9/A12 remain approval-gated. No history rewrite or destructive ref operation was done. The requested live artifact identity still requires a confirmed hostname and direct readback.
- Readiness: ENGINEERING_READY=YES for the merged dictionary work and verified CI artifact; DATA_READY=NO; PUBLICATION_READY=NO; LEARNING_READY=NO; MONETIZATION_READY=DEFERRED.
- Resume: check Engine PR #252 exact-head CI and its rights-gated metadata change; continue the next independent A3 mobile/desktop lesson-flow priority; keep A5 blocked until live route contents can be checked directly. `PROGRESS_LOG.md` remains unchanged while queue item A1's approval gate is open.

## Latest execution checkpoint — 2026-11-13 07:56 UTC (PR #190 merged; A3 continues)

- Webgame is PUBLIC. Current main HEAD is `50bb4549eb98d7b79c7ba69055f704e8c7e9de42` after PR #190. The GitHub connector returns commit SHA but not the associated tree object SHA, so this checkpoint records the verified head only.
- PR [#190](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/190) adds 44px touch-target assertions to the isolated synthetic 320px due-flashcard review. It measures mobile navigation, deck/topic filters, shuffle, card flip, and review/navigation controls. It changes tests only; the published catalog and production behavior are unchanged.
- Exact-head Verify [#43380226941](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/43380226941) passed 241/241 unit tests and 84/84 Playwright tests (0 skipped), build/smoke/performance/dist-drift/artifact checks, and 12 Lighthouse audits. Accessibility scored 100 on all routes; mobile performance ranged 97–100 and desktop was 100.
- Cloudflare PR preview build `4e5195f1-d45b-485f-a694-0796e54d2ef5` succeeded for PR head `ffbc8e5b`. A Cloudflare production build for merged main `50bb4549` is not verified. A direct live readback was attempted but browser access was unavailable; do not claim the served production artifact was inspected.
- Production catalog remains empty/noindex; synthetic fixture data remains isolated from public artifacts; no private Engine source metadata or learner data was copied here. Issue #2's synthetic-adapter acceptance is closed; A3 responsive accessibility and browser engineering remain active. A5 remains `blocked_external`; A1/A9/A12 stay approval-gated with no Git-history rewrite.
- Readiness: `ENGINEERING_READY=YES` for the validated browser test batch; `DATA_READY=NO`; `PUBLICATION_READY=NO`; `LEARNING_READY=NO`; `MONETIZATION_READY=DEFERRED`.
- Next: continue independent responsive desktop/mobile UX, keyboard/touch, PWA/offline, privacy/security and game-flow work. Select the next measured browser gap, preserve isolated synthetic fixtures and noindex empty states, and verify production only when provider/live evidence is available.

# Batak Toba Play — Active Browser Product Plan (31 October 2026)

**Decision authority:** owner direction dated 2026-10-31. **Status:** ACTIVE for new development planning; not a claim that features/content have already shipped.
**Supersedes prospective sequencing conflicts** in older blueprint checklists and dated progress narratives. Keep historical audits/commits intact. Existing source restrictions remain enforceable.

## Product mission and platform

A fast, friendly Batak Toba–Indonesian learning **website** for **desktop and mobile browsers**, especially novice learners, families and diaspora. The experience should help users discover usable words, understand their meaning in everyday context, practice for 5–10 minutes, see mistakes, and return for review.

**Explicit owner decisions:**
1. **Web-based only:** responsive desktop/mobile browser and PWA/offline browser use. No Android/iOS native application planning. PWA installability is a browser feature, not a native-app requirement.
2. **No audio/pronunciation/culture-differentiation priority.** Licensed audio may remain a future optional idea but it is not a release gate, strategic differentiator, or prerequisite for content/game development. Do not prioritize recordings, TTS or pronunciation over current product scope.
3. **Corpus enrichment and website development run in parallel.** Do not halt UX, game logic, automated synthetic tests, accessibility, performance, security, PWA/offline, progress, or integration adapter work because published linguistic content is zero. But never claim a playable real-data lesson without real public-eligible content.
4. **Contextual learning and 5-minute sessions remain product priorities.** They can be designed and tested with clearly synthetic data while real content remains blocked.
5. **Provenance, honest linguistic uncertainty and publication rights remain non-negotiable.** Quality confidence is not proof of linguistic correctness; multiple independent sources and sense/alternative handling matter. No fake human verification.

## Strict separation of the two repositories

| Concern | System of record | Rule |
|---|---|---|
| Research source discovery, private access/processing, dedup, evidence, normalized word/phrase/sentence candidates, topic coverage | PRIVATE `drewsebastians/batak-indo-alignment-engine` | Must follow private-only/noncommercial research policy. Source corpus stays in controlled local/private storage; do not write it to public Git/Pages. |
| Source-to-product **future field contract** | [Private upstream collection contract](https://github.com/drewsebastians/batak-indo-alignment-engine/blob/main/docs/WEBGAME_DATA_COLLECTION_CONTRACT.md) | The contract is merged to private main; metadata fields alone grant no publication or transfer rights. |
| Browser UI, games, lessons, progress, testing, published subset, SEO, safe deployment | PUBLIC `drewsebastians/webgame-bataktoba-indo` | Only publication-authorized subset; zero linguistic items until explicit gates pass. |
| Rights/scope gate | Both, independently | Private processing permission != public site redistribution or advertising/commercial permission. Upstream's active private-only policy **also** forbids outward handoff unless explicitly changed. |
| Future conversion | Fail-closed schema and provenance adapter exists; production integration remains gated on explicit authorization | Input contract != current `source:import` staging schema; map and validate explicitly before running publish. |

The public repository already contains historical/raw/candidate corpus-derived files. Their Git exposure needs a **separate provenance/rights audit**, including commit history. Deployment-only exclusion from `dist/` does not make past public Git content private. Do not destructively rewrite history or claim legal clearance solely on the basis of this plan.

## Parallel workstreams (none wait for full corpus)

| Lane | Milestone / deliverables | Acceptance evidence | Content dependence |
|---|---|---|---|
| W1 Browser UX | New and returning user journeys, 5-minute onboarding, responsive game/lesson/dictionary/error states; 320px and desktop checks | Browser Playwright keyboard/touch/zoom/a11y report with documented screenshots/checks | Synthetic fixture |
| W2 Game quality | Meaning, reverse, typed, true/false, matching, memory, flashcards, daily, summary and mistake-review; ambiguity/distractor/alternative safeguards | No game-flow tests skipped just because public corpus=0; synthetic fixtures explicitly scoped and isolated | Synthetic fixture |
| W3 Persistence & PWA | schema v3 migration, offline/reconnect, bounded local progress and due queue, export/import safety | Real browser offline + upgrade/reload cases and deterministic tests | Synthetic fixture |
| W4 Data adapter | Validate upstream metadata schema and map only **authorized** data to current `source:validate/preview/import` workflow; provenance and revocation | Contract tests: blocked records never enter dist; public-only manifest; source revoke removes descendants | Synthetic fixture + safe metadata |
| W5 Content readiness | Draft 3 pilot themes (`angka`, `sapaan`, `keluarga`), meaningful short lessons and contextual notes, 8–12 eligible items each | Per-theme eligibility report; once legal content arrives, public lesson and dictionary acceptance test | Requires individually eligible real data for live |
| W6 Release & trust | Performance, CI, privacy, security headers, source status, SEO noindex on thin topics, production readback | Independent CI green **and** actual deployment/live checks; no fictional SEO or analytics claims | Partial; full learning readiness needs content |

Optional later hypotheses: leaderboard/multiplayer, richer cultural sections, audio — evaluate separately after core browser experience, never treat them as current mandatory differentiators.

## Status and Definition of Done (two independent lanes)

**A. ENGINEERING_READY** (can be advanced now): CI reproducible; non-skipped synthetic end-to-end journeys; desktop + mobile-web accessibility; PWA/offline and progress robustness; secure data boundary; current published dataset may be empty; no required external source access. This is not a claim of playable real learning.

**B. LEARNING_READY** (not yet true): at least three substantive lessons with authorized, source-backed bbc/ind pairs, eligible distractors and alternatives; full lesson -> quiz -> mistake review -> spaced repetition -> dictionary path passes real-data acceptance tests; mobile/desktop browser smoke; clear attribution; deployment verified. A pilot might be released before all three lessons only if explicitly described as a limited pilot, not the completed plan.

**C. MONETIZATION_READY** (separate later gate): material learning value, rights covering relevant commercial use, adequate privacy/consent/ads.txt, actual site review; advertising remains OFF before then.

A successful test job may skip public-data scenarios for legitimate safety, **but the same functionality must be tested on synthetic fixtures** and the skip count must be published honestly. Existing HEAD check reported 190 unit/data passes, 17 Playwright passes, 16 Playwright skips; this is a historical observation, not future acceptance.

## Prioritized backlog

- **P0:** Protect public repo from unapproved source-text exposure and audit tracked/history access; reconcile stale progress docs and establish this plan as active authority. No rights bypass.
- **P1:** Continue browser feature/UX engineering concurrently; remove content-dependent e2e blind spots using synthetic fixtures (without leaking test data to dist).
- **P1:** Implement adapter + upstream schema validation as a distinct task; keep export gate fail-closed; report missing source columns.
- **P1:** Design lesson, answer-alternative/sense and contextual UX with 3 pilot themes, with honest empty-data states.
- **P2:** Browser usability testing desktop + mobile viewport, offline resilience, performance and deploy readback.
- **P2:** Enable legal content only as independent source rights and upstream scope permit; verify source/lesson/game counts with actual published output.
- **P3:** SEO expansion, retention measurement (privacy-safe), then consider monetization and other optional features.

## Implementation cadence and evidence

At each bounded development batch: verify fresh remote main SHA/tree; read this plan and active progress log; choose highest unblocked browser-engineering task; implement; run tests; record tests passed/skipped, production/public data counts, changed paths and exact next tasks. Maintain source/data track separately; no fabricated content. Engineering and source collection can take turns or run on independent branches/agents; their publish gates must never be conflated.

Source handoff currently **blocked**: upstream PRIVATE/NONCOMMERCIAL research scope, and this website PUBLIC. Even an individually CC-licensed source requires verifying precise rights, attribution and upstream policy before transfer. None of these safeguards should block pure code and synthetic-UX improvements.

## A3 verified continuation checkpoint — 2026-11-06 09:05 UTC

PR [#114](https://github.com/drewsebastians/webgame-bataktoba-indo/pull/114) is merged at public main `522eec31530d32f2e3937f5345cf52adff3c6e56` / tree `d9c7b4b38f333341ffb5264015bb7f892041bee1`. The synthetic five-minute browser journey now checks focus after each quiz answer, while reviewing two deliberate mistakes, advancing to the second review prompt, and reaching the review summary. Production code and learning data were unchanged.

Exact-head Verify [#42188695439](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42188695439) and post-merge Verify [#42189240700](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/42189240700) passed 232/232 unit tests, 60/60 Playwright tests (0 skipped), release/governance/data checks, build, smoke, performance budget, fixture isolation, committed-dist drift, and 12 Lighthouse profiles. Accessibility was 100 throughout; mobile Performance was 97–99 and desktop Performance 100. The verified public dist artifact is 13487989938 (120,845 bytes); Lighthouse artifact 13488034858 is 1,291,654 bytes.

Cloudflare Workers Builds reports production build `8b76d90c-db9e-4873-b311-cc59adba7fac` successful. Root, flashcards, manifest, robots, and service-worker live reads were inaccessible from the web reader; the alternate browser surface could not determine its active URL safely. Live contents and served-artifact identity remain NOT_VERIFIED. The current publication catalog remains empty and synthetic markers are absent from dist. Historical public corpus-shaped blobs remain reachable per the 2026-11-05 metadata-only audit; no destructive Git-history action was taken. Continue A3 with spaced-repetition rating/advance focus coverage. Keep A5 blocked until a supported live readback is available; A9/A12 remain approval-gated.


## A2 completion checkpoint — 2026-10-31 10:47 UTC

Public Issue #2's synthetic engineering acceptance is met by PR #4, merged as 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e. Verify run 41191955903 passed the 193-unit suite, E2E smoke, 33 browser tests, release drift gate, and the verify:release prerequisites. Coverage includes the synthetic lesson/quiz/mistake-review/spaced-repetition/dictionary flow; keyboard, touch, 320px and desktop checks; offline/reconnect; axe accessibility; and fixture isolation. Production content remains empty.

Cloudflare Workers Builds reported production deployment success for the merge commit, but direct live Pages readback was not available. Record deployment technical success separately from live artifact verification and from LEARNING_READY. A3 continues with real performance measurement, PWA/security follow-up, and live readback. The public history audit remains in force: removed historical snapshots are not purged, and no history rewrite was performed.


## A3 progress — measured build asset guard

The 31-Oct public main baseline contains 129,845 bytes of minified JavaScript across 14 assets and 15,217 bytes of CSS. CI now includes a deterministic JS/CSS artifact budget with explicit per-file and aggregate limits. The limits measure uncompressed build output; Verify run 41194897354 passed 196/196 unit tests, E2E smoke, 33/33 browser tests, asset budgets, release prerequisites, and dist drift. Lighthouse scores, post-merge deployment, and live Pages readback remain follow-up work.

## A3 integration checkpoint

The production JS/CSS budget is merged and passes CI. Main run 41195989468 passed 196 unit tests, E2E smoke, 33 browser tests, budget, release prerequisites and dist drift. Cloudflare reported a successful production build for merge commit ffe009e9de10a1ddd144bb0a5d51be746f81b5cc. A direct live readback could not be completed through the available web connector. Full Lighthouse score measurement and direct live inspection remain follow-up work; published learning content stays empty.


## A3 verified continuation checkpoint — 2026-11-01 08:12 UTC

Main `8a1ea9611483c90711ea1cf717bf6087cc83a962` passed Verify #126 / 41286770783: 215/215 unit tests (0 skipped), 36/36 browser tests, E2E smoke, JS/CSS budgets, 12 Lighthouse audits and committed-dist drift. Accessibility scored 100 across all route/profile audits. Mobile Performance is 98/93/98/90/94/100 and desktop is 100/99/100/100/100/100 for home/angka/games/flashcards/dictionary/progress. Public content remains empty/noindex and synthetic fixtures remain test-only. PR #31's provider check failed before merge; exact-main provider status and live readback are still unverified. Continue A3 browser engineering independently, and keep publication gated on rights, provenance and quality.

## Post-merge operational checkpoint — 2026-11-01 08:36 UTC

PR #32 merged as `ecebfe67ef17d033d9e9ee41fe0bbb7168cda78a` with documentation-only changes. Its exact-head Verify run 41288169799 passed 215/215 unit tests (0 skipped), 36/36 Playwright tests, E2E smoke, asset budgets, 12 Lighthouse audits and committed-dist drift. Accessibility was 100 across route/profile audits; mobile Performance was 98/92/98/90/93/100 and desktop 100/99/100/100/100/100. Candidate Workers Builds check passed, while exact-main provider state and direct live readback remain unverified. Public content remains empty/noindex; synthetic fixtures remain test-only.

## Post-PR #45 and historical exposure checkpoint — 2026-11-01 16:41 UTC

The product remains a desktop/mobile browser website. PR #45 merged at public main `efbe05226272d364ca3626ebebe4749523e6ec0b` / tree `fddeb9720ec43d736085fc3f9f91700d537979b6` to preserve the stable empty lesson state while no content is published. Exact-main Verify [41322447587](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41322447587) passed 216 unit tests, E2E smoke, 38/38 browser/axe tests, budgets, 12 Lighthouse audits and committed-dist drift. Lighthouse Accessibility is 100 on all audited route/profile pairs; mobile Performance scores are 98–100 and desktop scores are 100. Cloudflare Workers Builds reports a successful provider build; direct live readback remains unverified.

A corrected public history audit now records the July 2026 Git snapshot and a successful Pages root-upload run. Current-tree containment remains in place. A9 blocks any destructive history rewrite pending explicit owner approval; website engineering continues independently.


## A3 progress import safety and verification checkpoint — 2026-11-02 01:26 UTC

PR #47 is merged at application main `3ff59a4e55213b6031a488d2721301cc3afc4d23`. Progress export/import uses a shared 1 MiB limit and validates/whitelists imported session summaries. The Windows Lighthouse command now resolves npx using Windows path semantics even when its resolver test runs on a POSIX CI host.

Exact-main Verify [41372157370](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41372157370) passed 221 unit tests, E2E smoke, 39/39 browser tests, budgets, 12 Lighthouse audits and dist drift. All Accessibility scores were 100; mobile Performance ranged 98–100, desktop was 100 on all routes. Cloudflare provider build succeeded; direct live readback remains unverified. Public learning content remains empty/noindex, and synthetic fixtures remain test-only.

## A3 verified continuation checkpoint — 2026-11-13 06:19 UTC

PR #188 merged as main de9722a394f529150b93cefed609fca24c329417 / tree 642109b391acef7b3f75880a3dfb66a7610dd5f2. The synthetic Playwright regression covers focused-card 1/2/3 flashcard ratings, immediate wrong-answer review, correct-answer spaced scheduling, the independent difficult flag, and focus on each next card. Exact-head Verify #43376001221 and post-main Verify #43377158957 passed 241/241 unit and 84/84 browser tests (0 skipped), build/smoke/performance/drift, and all 12 Lighthouse profiles. Cloudflare merged-main build 3b0e8833-339c-487d-96fb-0acae2f0447d succeeded.

This is engineering evidence only: production catalog remains empty/noindex, no synthetic/private content is in dist, and live readback remains NOT_VERIFIED. Continue with a 320px touch flashcard check and other A3 browser UX independently from corpus readiness. A5 remains blocked_external; preserve public Git history and keep A1/A9/A12 approval-gated.
