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
| Source-to-product **future field contract** | [Private upstream collection contract](https://github.com/drewsebastians/batak-indo-alignment-engine/blob/main/docs/WEBGAME_DATA_COLLECTION_CONTRACT.md) | Contract exists on a PR until merged; metadata requirements alone grant no publication rights. |
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


## A2 completion checkpoint — 2026-10-31 10:47 UTC

Public Issue #2's synthetic engineering acceptance is met by PR #4, merged as 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e. Verify run 41191955903 passed the 193-unit suite, E2E smoke, 33 browser tests, release drift gate, and the verify:release prerequisites. Coverage includes the synthetic lesson/quiz/mistake-review/spaced-repetition/dictionary flow; keyboard, touch, 320px and desktop checks; offline/reconnect; axe accessibility; and fixture isolation. Production content remains empty.

Cloudflare Workers Builds reported production deployment success for the merge commit, but direct live Pages readback was not available. Record deployment technical success separately from live artifact verification and from LEARNING_READY. A3 continues with real performance measurement, PWA/security follow-up, and live readback. The public history audit remains in force: removed historical snapshots are not purged, and no history rewrite was performed.


## A3 progress — measured build asset guard

The 31-Oct public main baseline contains 129,845 bytes of minified JavaScript across 14 assets and 15,217 bytes of CSS. CI now includes a deterministic JS/CSS artifact budget with explicit per-file and aggregate limits. The limits measure uncompressed build output; Verify run 41194897354 passed 196/196 unit tests, E2E smoke, 33/33 browser tests, asset budgets, release prerequisites, and dist drift. Lighthouse scores, post-merge deployment, and live Pages readback remain follow-up work.
