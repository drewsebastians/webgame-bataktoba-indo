# Ultimate Blueprint Traceability — 2026-08-30

**Baseline:** `c416c5f464ccceedf3a2ebbc6efa941cafd31b71` (origin/main green 33301566303). **Adversarial re-audit** vs `01_BLUEPRINT_ULTIMATE_WEBSITE_BATAK_TOBA_PLAY.md` §§1-28. **Claims challenged**, evidence from source/dist/tests/CI.

Status legend: `REALIZED_PRODUCTION` | `IMPLEMENTED_GATED` | `PARTIAL` | `BLOCKED_CONTENT` | `BLOCKED_EXTERNAL` | `OPERATIONAL_NOT_YET_PROVEN` | `INTENTIONALLY_DEFERRED_BY_BLUEPRINT` | `NOT_IMPLEMENTED` | `OBSOLETE_IMPLEMENTATION_NOTE`

Production data truth (recalculated `node -e`): words 367, genuine phrases 0, sentences 80, published lessons 0, draft 6, human-reviewed 0, threshold 8.

---

## §1 Tujuan (informational) — REALIZED_PRODUCTION
Requirement: Blueprint as product spec. Evidence: this file + `BLUEPRINT_COMPLIANCE_MATRIX.md`. Gap none. Repo solvable: docs. Can Ultimate be COMPLETE while open? YES (informational).

## §2 Visi
- 2.1 Visi portal ringan terpercaya — **PARTIAL**: shell realized, but 0 substantive lessons → not yet *helpful* at Blueprint scale. Code: `index.html` hero, `README` purpose. Gated by content.
- 2.2 Posisi (bukan kamus resmi/AI) — **REALIZED_PRODUCTION**: disclaimers `index.html`, `about`, `methodology`, `footer` “corpus-derived, bukan otoritas”.
- 2.3 Target users A-E — **PARTIAL**: diaspora/keluarga flows exist (onboarding, games) but family lesson 0 → diaspora value limited. Status `IMPLEMENTED_GATED` for reviewer persona (contributors page, correction workflow `app.js:399-442`).

## §3 Sasaran bisnis & guardrail
- 3.1 Traffic→session→return→catalog→AdSense — **PARTIAL**: funnel code exists (SEO sitemap, games, streak) but catalog 0 lessons → no `lesson→game` conversion at scale. `BLOCKED_CONTENT`.
- 3.2 North-star meaningful sessions (≥5 soal / lesson / review / daily / mistake-review) — **IMPLEMENTED_GATED**: `session.js:summarizeSession` counts 5/10/20, `isMeaningful` true ≥5, `dailyQueue`, `mistakeReview` tested, but production has no published lesson sessions. Can Ultimate be COMPLETE? NO until lessons exist.
- 3.3 Guardrail (no adjoining ad, no forced wait…) — **REALIZED_PRODUCTION**: `ads.js` disabled by default, placement allowlist, no placeholder CSS.

## §4 Prinsip
- 4.1 Kejujuran status — **REALIZED_PRODUCTION**: `reviewStatus` badge `app.js:58-60` `data-source-flag`, `methodology`, `PROGRESS_LOG`.
- 4.2 Belajar sebelum monetisasi — **REALIZED_PRODUCTION**: ads after content, not between question/options (`_headers`, `ads.js`).
- 4.3 Sedikit bermutu (20 lessons > ratusan tipis) — **PARTIAL**: code honors quality (threshold 8, noindex thin) but *quantity* 0 → not yet 20. `BLOCKED_CONTENT`.
- 4.4 Mobile-first — **REALIZED_PRODUCTION**: `@media 820/720/520`, touch 44px, grid collapse.
- 4.5 Tanpa login — **REALIZED_PRODUCTION**: `progress.js` localStorage, no auth.
- 4.6 Arsitektur sederhana static modular — **PARTIAL**: `tools/build-dist` static, but `assets/js/app.js` 2247 lines monolith vs Blueprint `src/config/data/game/progress/lessons/...` ideal. Maintainability gap `NOT_IMPLEMENTED` (low priority, see §21).
- 4.7 A11y — **PARTIAL**: axe 0 serious/critical 6 pages, skip, focus, live, 200% zoom, reduced-motion, no mandatory timer — but manual Lighthouse/320px/heading hierarchy not yet demonstrated `OPERATIONAL_NOT_YET_PROVEN`.
- 4.8 Tidak menciptakan fakta bahasa — **PARTIAL**: pipeline never invents translations (checked), but public topic registry `topics.json` descriptions for `keluarga 0` *did* claim lexical availability (fix in this pass). After fix: **REALIZED_PRODUCTION** via bounded copy.

## §5 Pengalaman pengguna final
- 5.1 New user 8 steps — **PARTIAL**: 1-3 hero proposition `index.html` OK, 4 onboarding `onboarding.js` 3 Q, 5 recommendation `renderHomeDynamic`, 6 summary `renderSummaryPanel`, 7 local, 8 due → **REALIZED** for quiz path; **BLOCKED_CONTENT** for lesson path (0 lessons). Distinguish: quiz journey REALIZED, lesson journey IMPLEMENTED_GATED.
- 5.2 Returning user (streak/due/last lesson/theme progress/difficult/daily) — **PARTIAL**: `app.js:200-233` shows `due/streak/lastMode/saved/difficult/daily` for quiz; `last lesson`/`theme progress`/`continue lesson`/`recommendation` gated behind fixture, fallback honest. Status `IMPLEMENTED_GATED` (code) vs `BLOCKED_CONTENT` (production).
- 5.3 Google topic pages (angka/keluarga/sapaan) must give *actual material* not generic tips — **PARTIAL/BLOCKED_CONTENT**: `learn/angka` 5 items <8 + generic prose, `keluarga 0`, `sapaan 0`, `makanan 2` all noindex+generic fallback. Correct safety decision, but final SEO intent **NOT REALIZED**. Must not mass-index thin. `topics.json` descriptions now bounded (fix). `learn/adat-ringan`/`tips-diaspora` indexable but substantive? Indexable & substantive per audit, but lesson-linked? **PARTIAL**.

## §6 Arsitektur informasi (URL /belajar/ vs /learn/)
Blueprint proposes `/belajar/`, `/latihan/`, `/kamus/` — current implements `/learn/`, `/games/`, `/dictionary/` (English). **OBSOLETE_IMPLEMENTATION_NOTE**: URL scheme diverged historically but redirects preserve SEO (`_redirects: /webgame-bataktoba-indo/*`). Not a functional gap, documented in `README`. Status `PARTIAL` (information architecture realized differently).

## §7 Homepage
- 7.1 Hero (proposition, 2 buttons, free/no-login, published counts, disclaimer) — **REALIZED_PRODUCTION**: `index.html:73-98` hero + `data-home-stats` 367/0.
- 7.2 Lanjutkan Belajar — **PARTIAL**: shows `Lanjutkan Belajar` when `answered>0` (`app.js:235`), else onboarding; lesson-specific card shows only via fixture.
- 7.3 Jalur belajar 5 cards — **REALIZED** (Baru mulai, Keluarga truthful, Sapaan truthful, Kata sulit, 5 menit) — truthful after fix `index.html:106-112`.
- 7.4 Lesson populer cards — **IMPLEMENTED_GATED**: component `renderHomeDynamic` would show `title/level/time/items/status/progress` if `publishedLessons>0`; currently fallback honest, not realized.
- 7.5 Trust links — **REALIZED**: footer `about/contact/privacy/methodology/data-source/contributors`.
- 7.6 Iklan — **REALIZED**: no placeholder when OFF (`ads.js`).

## §8 Onboarding
3 questions (familiarity, goal, duration 3/5/10), skippable, local `onboarding.js`, influences recommendation via `renderHomeDynamic` → **REALIZED_PRODUCTION** (browser test `core.spec:16`).

## §9 Lessons
- 9.1 Structure 12 items — **IMPLEMENTED_GATED**: `lesson-engine.js` + `app.js:1784-1974` implements title/objective/time/difficulty/review/intro 8-12/recognition/recall/mistake/summary/next/correction + `progress.js` per-lesson states. Production lesson availability 0 → **BLOCKED_CONTENT**.
- 9.2 Standar publikasi (min items, stable ID, source/status, no dup, validated) — **REALIZED**: threshold 8 `MIN_LESSON_POOL_ITEMS=8`, stable hash, `check-site` validates.
- 9.3 Label human-reviewed vs corpus-derived beta — **REALIZED**: rollup from item `reviewStatus` (`topics.json:reviewRollup`).
- 9.4 Progress per lesson 5 states — **REALIZED**: `progress.js:513-566` not-started/learning/needs-review/nearly-mastered/completed, tested `lesson-progress.test`.

## §10 Mode permainan
|10.1 Tebak Arti|REALIZED_PRODUCTION|4 opsi unique, 1 benar, distractor excludes alternatives, no repeat, label, 1-4, explanation|
|10.2 Reverse Quiz|REALIZED_PRODUCTION|same|
|10.3 Matching 4/6/8|REALIZED_PRODUCTION|open board, matched accessible, timer optional `matching-timer.spec`|
|10.4 Flashcards|REALIZED_PRODUCTION|theme/due/saved/difficult/shuffle/Salah/Sulit/Benar/shortcut|
|10.5 Ketik Jawaban|REALIZED_PRODUCTION|NFC casefold, alternatives, fuzzy transparent, no synonym guess|
|10.6 Susun Kalimat|**IMPLEMENTED_GATED**|uses only publishable sentences; code exists `sentence` pool 80 but `beta-unreviewed` → deferred activation. Blueprint does **not** list in §26, so not `INTENTIONALLY_DEFERRED` by spec — classify `BLOCKED_CONTENT` (no reviewed publishable sentence). Can be safely coded with synthetic fixture without fake production.|
|10.7 Fill in Blank|**IMPLEMENTED_GATED** / `BLOCKED_CONTENT` similar to 10.6 — only reviewed/beta-approved sentences; currently none approved.
|10.8 True/False|REALIZED_PRODUCTION|for review/daily|
|10.9 Memory 4/6/8|REALIZED_PRODUCTION|face-down, keyboard|
|10.10 Daily Challenge|REALIZED_PRODUCTION|seed date `dailySeed+mulberry32`|
|10.11 Listening|**BLOCKED_EXTERNAL**|requires legal audio + metadata + license + review; no synthetic; correctly OFF.

## §11 Question Engine
Unicode NFC, case/whitespace, visible uniqueness, 1 correct, alternatives excluded, queue no-repeat + boundary, RNG injectable, small-pool error, double-score guard, rapid-click safe — **REALIZED_PRODUCTION** `question-engine.js` + `question-engine.test` 500+ real rounds.

## §12 Progress
- 12.1 Schema `seen/correct/incorrect/consecutive/last/lastReviewed/nextReview/stage/mastery/saved/difficult` — **PARTIAL**: explicit `mastery` field not stored; mastery derived via `reviewStage→masteryLabel` (`session.js: masteryLabel`). Status `IMPLEMENTED_GATED` (semantic via stage). Fields otherwise REALIZED, versioned, migration.
- 12.2 Review schedule 1/3/7/14/30 — **REALIZED** deterministic tested.
- 12.3 Session summary `questions/correct/incorrect/accuracy/new/strong/review/CTA/next` — **REALIZED** `summarizeSession` + `renderSummaryPanel` + mistake CTA + next.
- 12.4 Daily 5/10/20 priority due→often-wrong→recent-wrong→new — **REALIZED**.
- 12.5 Export/import/reset bounded 512KB, quarantine, export note — **REALIZED** `progres/index.html`.

## §13 Dictionary
- 13.1 Search two-way NFC case-insensitive bounded fuzzy, highlight `<mark>`, theme/type/review/difficulty filter — **PARTIAL**: filter UI capability REALIZED, but `difficulty` metadata null corpus → disabled honestly (`dictionary:58-60`); production detail richness **BLOCKED_CONTENT** (no usage notes/examples). Highlight REALIZED.
- 13.2 Detail Batak/primary/alternatives/type/theme/difficulty/review/source/notes/examples/save/practice/correction — **PARTIAL**: `difficulty`/`notes`/`examples` blocked content; rest REALIZED.
- 13.3 No-result as editorial input, no sensitive query sent — **REALIZED** analytics rejects `query`.

## §14 Data/Editorial
- 14.1-14.4 Layers `raw→candidates→reviewed→published`, stable hash, `schemaVersion 2`, `reviewStatus` 6 — **REALIZED**.
- 14.5 Workflow candidate→tech→linguistic→theme/level→approve→publish→monitor→correct — **IMPLEMENTED_GATED** (tech), **BLOCKED_EXTERNAL** (linguistic approve) + `OPERATIONAL_NOT_YET_PROVEN` (no cycle demonstrated; human 0).
- 14.6 Correction prefilled `itemId/text/meaning/page` GitHub issue, not auto-published — **REALIZED**.
- 14.7 Quality report `data/reports/data-quality-report.json` — **REALIZED**.

## §15 SEO
- 15.1 Intent `angka` must show angka etc. — **PARTIAL/BLOCKED_CONTENT**: `angka` 5 no material, `keluarga`/`sapaan`/`makanan`/*waktu*/*alam* thin → noindex correct but intent NOT REALIZED.
- 15.2 Topic page: intro + actual list + table + status + examples + mini quiz + lesson + dictionary + correction + source + modified — **PARTIAL**: `adat-ringan`/`tips-diaspora` realized (intro+material+status+correction+source+time); thin topics fallback generic + mini quiz gated (≥4) → not full Blueprint shape.
- 15.3 Metadata title/desc/canonical/OG/Twitter/breadcrumb/structuredData/lastModified/author/publisher — **REALIZED** `check-site` exact cardinality source+dist `metadata-cardinality.test`.
- 15.4 Sitemap auto from registry, excludes draft/progress/search/empty/error/internal — **REALIZED** `generate-sitemap.mjs` + `site.config` single source 15 URLs.
- 15.5 Structured data WebSite/BreadcrumbList/Article/LearningResource honest — **IMPLEMENTED_GATED**: WebSite+BreadcrumbList REALIZED, LearningResource via build only when published (0 → none), Article where appropriate (topic pages have Article? Currently BreadcrumbList only; Article not injected — `PARTIAL`).
- 15.6 Internal linking loop topic→lesson→game→dictionary→review→next — **PARTIAL**: code loop exists (`learn`→`games`→`dictionary`→`progress`), but 0 lessons → *lesson* step `BLOCKED_CONTENT`.

## §16 AdSense
16.1 Activation after domain+substantive+reviewed+privacy+consent+ads.txt+no placeholder — **BLOCKED_EXTERNAL** (domain unconfigured per §25, 0 reviewed core, no Publisher ID). Repository component readiness `ads.js` allowlist, ID validation, CLS reserve — **REALIZED** (`ads.test`).

## §17 Analytics
17.1 17 events `lesson_view…offline_session` — **IMPLEMENTED_GATED**: adapter allowlist `analytics.js`, `lesson_view` only published (`initLearn` checks `published`), `track` returns `sent:false` when provider absent; wired in `app.js` (`game_start`, `question_answered` etc.). Live collection **BLOCKED_EXTERNAL** (no provider).
17.2 Forbidden data (name/email/localStorage/progress/free text/PII/raw query) — **REALIZED** rejects `query`.
17.3-17.4 KPIs `meaningful sessions…ad revenue` + guardrail — **OPERATIONAL_NOT_YET_PROVEN** (no live data, but capability exists gated).

## §18 Privacy/Trust
`about/contact/privacy/methodology/data-source/editorial-policy/correction-process/contributors` + `privacy` explains localStorage/export/analytics optional/ads optional/3p cookies/consent/delete/correction/external — **REALIZED** parity checked; no inactive service claimed active; external link `rel=noopener`.

## §19 Accessibility
Axe serious0 critical0 6 pages, skip, landmarks, heading hierarchy, focus, 1-4 shortcuts, live, non-color, contrast, touch 44px, 200% zoom, 320px reflow, reduced-motion, no mandatory timer, mobile nav, form errors, responsive tables, labels — **PARTIAL**: automated axe REALIZED, manual keyboard/zoom/mobile nav tested via Playwright, but full 200%/320/contrast not yet *documented* manual checklist → `OPERATIONAL_NOT_YET_PROVEN` (report as such).

## §20 PWA/Offline
Installability, shell, opened pages, game, `data/published` SWR, progress local, fallback `offline.html`, HTML network-first, hashed cache-first, data SWR, cross-origin network-only, purge, update notification — **REALIZED** `sw.js` + `manifest`; lesson offline **IMPLEMENTED_GATED** (0 lessons).

## §21 Architecture
Proposed `src/config/data/game/progress/lessons/dictionary/analytics/ads/ui/utils` vs actual `assets/js/app.js` 2247 lines monolith — **PARTIAL**: functional but maintainability gap; no churn required now (Blueprint §21 not strict file names). Classify `NOT_IMPLEMENTED` for ideal structure, but not blocking Ultimate? Keep `PARTIAL` with low priority.

## §22 Security
Safe DOM `dom.js`, untrusted data, external link `noopener`, no secrets, CSP `default-src 'self'` no `unsafe-eval`, `X-Frame-Options DENY`, `nosniff`, `referrer strict-origin-when-cross-origin`, `permissions`, dep min (`package.json` 2 dev), no public stack trace, import validation 512KB, correction URL `URLSearchParams` — **REALIZED** `check-site` headers via `e2e-smoke`.

## §23 Testing/CI
`npm run verify` = build+schema+data quality+unit+link+HTML+SEO+structured+ e2e+ a11y + PWA (via e2e) — **PARTIAL**: Lighthouse not automated (see §24), but other gates explicit `verify.yml` (check+build+unit+smoke+browser+axe). Coverage explicit vs implicit documented. Tests: unique answers, 1 correct, no repeat, migration, corrupted storage, daily, lesson publishing, dictionary, offline (via SW), ads/analytics disabled, keyboard, mobile — **REALIZED**.

## §24 Ops
- 24.1 Monthly review no-result/correction/problematic/publish/archive — **IMPLEMENTED_GATED** (tooling `check-site`, `data-quality-report`) + `BLOCKED_EXTERNAL` (needs provider+human).
- 24.2 Every release `verify`+clean build+Lighthouse+broken links+data report+SW version+privacy+ad check — **PARTIAL**: Lighthouse missing → fix in this pass via `lighthouseCheck` script + manual checklist `docs/RELEASE_CHECKLIST.md`; rest REALIZED.
- 24.3 Backup raw preserved, export, release tag, reproducible `git clone`+`build-learning-data.py` requires local DB `1.6GB` → `OPERATIONAL_NOT_YET_PROVEN` for external repro, `migration map` retained.

## §25 Production readiness
Literal criteria: core tests, no ambiguity, migration, **halaman tema benar-benar berisi materi**, data transparent, no ad placeholder, PWA safe, metadata, a11y 0, privacy parity, **domain final**, CI green — **PARTIAL**: domain unconfigured → strict Blueprint `PRODUCTION TECHNICAL READINESS = BLOCKED_EXTERNAL`. Narrower `TECHNICAL ARTIFACT READINESS = READY` (CI green, dist deterministic). AdSense readiness `BLOCKED_EXTERNAL`.

## §26 Deferred (accounts, cloud sync, leaderboard, multiplayer, UGC, AI translator, AI pronunciation, payment, subscription, native, forum, chat, heavy CMS) — **INTENTIONALLY_DEFERRED_BY_BLUEPRINT** correctly excluded.

## §27 Final paragraph
`pilih lesson nyata → permainan tanpa ambigu → review kesalahan → jadwal → dictionary source/status → progress lokal → offline → koreksi → SEO substantif → trust → privacy analytics → safe ads` — **PARTIAL**: 6/10 YES production (game/dictionary/progress/offline/correction/SEO generic), 4 NO (real lesson ×2, substantive SEO intent, analytics live). Matrix section enumerates YES gated vs NO content.

## §28 Definition of Done
Rebuilt in `BLUEPRINT_COMPLIANCE_MATRIX.md` 2026-08-30: each `[x]` re-evaluated; “Lesson substantive tersedia” vs “engine supports fixture” distinguished; current `0 published` → former `[x]` now `BLOCKED_CONTENT`/`IMPLEMENTED_GATED`.

---

## Summary Statuses

|Bucket|Count|
|---|---|
|REALIZED_PRODUCTION|~45|
|IMPLEMENTED_GATED|~18|
|PARTIAL|~12|
|BLOCKED_CONTENT|~14|
|BLOCKED_EXTERNAL|~9|
|OPERATIONAL_NOT_YET_PROVEN|~4|
|INTENTIONALLY_DEFERRED|~13|
|NOT_IMPLEMENTED|1 (Lighthouse, now fixed)|
|OBSOLETE|1|

**Repository code capability** ~ COMPLETE (Lighthouse added); **Production learning experience** BLOCKED_CONTENT (0 lessons); **SEO final** BLOCKED_CONTENT.

## Gaps Closed This Pass
- `topics.json` keluarga/sapaan descriptions bounded (pool 0).
- Prose softened `learn/keluarga`/`sapaan` sentences (kinship/adat/greeting specifics removed).
- Lighthouse release gate added (`tools/lighthouse-check.mjs` + `docs/RELEASE_CHECKLIST.md` + `package.json:verify:release`).
- Architecture note `OBSOLETE` for URL scheme.
- Manual a11y checklist added.

## Remaining External/Content Blockers
0 published lessons (need 8 pool ≥ human review), thin topics, domain/DNS, publisher ID/ads.txt/CMP, corpus licensing, audio, Search Console — not faked.
