# Blueprint Compliance Matrix

Authoritative completion record for `01_BLUEPRINT_ULTIMATE_WEBSITE_BATAK_TOBA_PLAY.md` versus the actual repository state at HEAD. Legend: **COMPLETE** · PARTIAL · BLOCKED_EXTERNAL · NOT_IMPLEMENTED · INTENTIONALLY_DEFERRED

Evidence keys: file paths, test names (`npm test`), browser tests (`npx playwright test`), checker rules (`npm run check`).

---

## Data & editorial pipeline

| Requirement | Status | Evidence |
|---|---|---|
| raw → candidate → reviewed → published layers | COMPLETE | `data/{raw,candidates,reviewed,published}/`; builder stages in `tools/build-learning-data.py`; `data/reviewed/README.md` documents override schema; `reviewed` layer kosong hari ini (truthful, no fake) |
| Human-review workflow without faking data | COMPLETE | `load_reviewed_overrides()` + `apply_review_overrides()`; layer EMPTY by design; zero `human-reviewed` items; checker hard-fails human claim without `reviewedBy` |
| Stable content-hash IDs | COMPLETE | `stable_id()` sha256-based `word-<10hex>`; format enforced by `tests/data/data-quality.test.mjs`; 367 words |
| Legacy ID migration map | COMPLETE | `data/migration/id-map.json` (485 mapped); consumed by progress migration; `tests/unit/progress-v2.test.mjs` incl. v2→v3 |
| Draft leakage guard | COMPLETE | supplements live ONLY in `data/candidates/lesson-drafts.json` + `content/curated/` internal; checker hard-fails on `needs-review`/`editorial-draft` in `data/published/`; browser "draft vocabulary never renders publicly" |
| Phrase token rule (≥2 meaningful tokens) | COMPLETE | enforced at candidate AND published stage; checker + `tests/data` coverage; phrase set empty truthfully |
| Zero phrases ⇒ zero phrase claims | COMPLETE | dataset empty; homepage stat shows 0 genuine phrases; copy fixed in `index.html`, `data-source/`; no numeric phrase claims |
| Data quality report per build | COMPLETE | `data/reports/data-quality-report.json` validated by checker/tests; stageCounts.wordPairs 367 |

## Question & game engines

| Requirement | Status | Evidence |
|---|---|---|
| Exactly one correct option; unique visible labels | COMPLETE | `assets/js/game/question-engine.js`; unit + real-data suites 500+ rounds; `normalizeLabel` dedupe |
| Distractors exclude answer alternatives | COMPLETE | engine `reservedLabels` includes `indonesianAlternatives`/`batakAlternatives`; `tests/unit/question-engine*.test.mjs` |
| No immediate repeats / cycle-safe queue | COMPLETE | `QuestionQueue`; adjacent-pair property tests including cycle boundaries |
| Rapid-click guard | COMPLETE | runner `answer()` lock; browser asserts disabled options after answer |
| Typed Answer (normalization + transparent typo tolerance) | COMPLETE | `game/modes.js#checkTypedAnswer` boundedLevenshtein; `tests/unit/modes.test.mjs`; UI in games page |
| True/False (false pairs provably not alternatives) | COMPLETE | `buildTrueFalse`; property test 200 seeds; UI wired |
| Memory Game 4/6/8 pairs, keyboard accessible | COMPLETE | `buildMemoryBoard`; size buttons native `<button>` `aria-pressed`; face-down `face-down` + `aria-label`; browser counts cards 8/12/16 |
| Matching Pairs 4/6/8 open board, distinct from Memory | COMPLETE | `buildMemoryBoard` reused with open cards (no face-down), selector 4/6/8, `matching-size-button`; tested distinct from Memory |
| Matching timer optional | COMPLETE | toggle `aria-pressed` false→true, time pill appears, advances; persistence isolated per mode; new board resets; browser test `matching-timer` |
| Daily Challenge (date-seeded, serverless) | COMPLETE | `dailySeed`+`mulberry32`; determinism tests; UI mode |
| Sentence Reordering / Fill-in-Blank | INTENTIONALLY_DEFERRED | gated on publication-eligible sentences; current 80 beta-unreviewed do not qualify (blueprint §10) |
| Listening mode | INTENTIONALLY_DEFERRED | disabled until licensed + reviewed audio exists (blueprint §10.11) |

## Lessons

| Requirement | Status | Evidence |
|---|---|---|
| Lesson registry + publication rule (≥8 corpus items) | COMPLETE | `tools/build-learning-data.py` `MIN_LESSON_POOL_ITEMS=8`; `data/published/lessons.json` `minPoolItemsForPublication:8`; `tests/data/lessons.test.mjs` enforces ≥8 |
| Honest operation with ZERO published lessons | COMPLETE | registry 0 published / 6 draft; `data/published/topics.json` poolItems 0-5 all <8; learn pages show neutral "menunggu review penutur" |
| Full lesson flow (intro→recognition→recall→mistakes→summary→next) | COMPLETE | `assets/js/game/lesson-engine.js` + `progress.js` per-lesson states; mini-practice on learn pages; full multi-phase flow proven via synthetic fixture (route interception, 8–12 items, never in dist) — `tests/browser/lesson-fixture.spec.mjs` |
| Lesson progress states (5) | COMPLETE | `progress.js:LESSON_STATUSES not-started/learning/needs-review/nearly-mastered/completed`; `getLessonState` + `recordLessonStart`/`recordLessonCompletion`; `tests/unit/lesson-progress.test.mjs` covers each state + transitions (`not-started→learning→needs-review→nearly-mastered→completed`, mistake after completed → needs-review) |
| Supplements never public | COMPLETE | moved out of published registry; guarded by checker + tests + browser assertion |

## Core learning product

| Requirement | Status | Evidence |
|---|---|---|
| Progress v3: independent saved/difficult flags + review schedule | COMPLETE | `progress.js` `PROGRESS_SCHEMA_VERSION=3` but key remains `batakTobaPlay.progress.v2` (key != version, documented); `migrateV2ToV3`; interval 1/3/7/14/30; `tests/unit/progress-v2.test.mjs` + `lesson-progress.test.mjs`; reviewStage, bucket `known|review`, flags independent |
| Sessions 5/10/20 + summary + mistake review + daily practice | COMPLETE | `game/session.js` `buildDailyQueue`, `summarizeSession` counts/accuracy/new/strong/mistakeIds; UI `renderSummaryPanel` shows question/correct/incorrect/accuracy/new/improved/needs-review/mistake CTA/next recommendation; browser covers session + summary |
| Streak (non-punishing) | COMPLETE | `computeStreak` local-date; 1-day grace; unit tests |
| Flashcards overhaul (due/saved/difficult/theme filters, shuffle, Salah/Sulit/Benar, keyboard) | COMPLETE | `initFlashcards`; toolbar filters; `getDueItems`, `getSavedIds`, `getDifficultIds`; browser test flips with Space |
| Dictionary v2 (two-way normalized, fuzzy bounded, highlight, filters, detail, save/difficult/correction) | COMPLETE | `initDictionary` normalized search, filters theme/direction/type/review/difficulty (difficulty honestly disabled while null), `highlightNodes` safe DOM with `<mark>`, detail save/difficult/correction prefilled; browser test highlight + save |
| No-result privacy guard | COMPLETE | analytics adapter rejects `query` field; `tests/unit/analytics.test.mjs` |

## Homepage / onboarding

| Requirement | Status | Evidence |
|---|---|---|
| New-user state (free/no-login/local/transparency) | COMPLETE | hero copy "Gratis, tanpa login. Progress tersimpan lokal"; badges |
| Optional local onboarding (familiarity/goal/duration) | COMPLETE | `assets/js/onboarding.js` versioned skippable; browser test onboarding skip |
| Returning-user Lanjutkan Belajar (due/streak/saved/difficult/lastMode CTAs) | COMPLETE | `renderHomeDynamic` returning branch shows `dueCount/streak/lastMode/saved/difficult` + daily/continue/flashcards CTAs; zero-lesson fallback honest; fixture proves lesson-aware path |
| Learning paths without fabricated availability | COMPLETE | homepage cards for `keluarga`/`sapaan` now truthful: "lesson penuh belum terbit, materi menunggu review penutur"; Tebak Arti copy fixed to pilihan ganda 4 opsi (was wrong matching 4-8 copy) |

## SEO / trust / PWA / security

| Requirement | Status | Evidence |
|---|---|---|
| Generated sitemap = indexable pages only + lastmod | COMPLETE | `tools/generate-sitemap.mjs` from `site.config.json:lastModified` single source, honors `noindex`; includes 15 URLs (`/` + 14 indexable inc. `/contributors/`); `<lastmod>2026-08-26</lastmod>`; checker parity |
| Unique titles/descriptions/canonical/OG/Twitter everywhere + exact cardinality | COMPLETE | checker enforces exactly one per page for `title/description/canonical/robots/og:title/og:description/og:type/og:url/og:site_name/og:locale/og:image/twitter:card/twitter:title/twitter:description/twitter:image` in source AND dist (regression test `tests/data/seo-a11y.test.mjs` + `check-site.mjs`) |
| og:image absolute | COMPLETE | `https://webgame-bataktoba-indo.pages.dev/assets/icons/og-image.png` on all pages; checker + browser "og:image uses absolute" |
| BreadcrumbList JSON-LD | COMPLETE | injected on all indexable pages via `update-seo-pwa.mjs` |
| LearningResource schema | COMPLETE | `tools/lib/learning-resource.mjs` truthful `LearningResource` (name/description/inLanguage/educationalLevel/timeRequired/dateModified/numberOfItems); `build-dist.mjs:injectLearningResource` injects only when `publicationStatus=published` + pool>0 (currently 0 → no fake); tests `structured-data.test.mjs` + browser fixture present/absent |
| Truthful last-modified | COMPLETE | explicit `site.config.json:lastModified` (2026-08-26); `build-dist.mjs` injects `meta last-modified` (ISO date) + visible `<p class="content-meta"><time datetime="2026-08-26">Terakhir diperbarui: 26 Agustus 2026</time></p>` consistently for all substantive pages (/progres excluded); sitemap `<lastmod>` same source; structured data `dateModified` same (when published) |
| Editorial Policy + Correction Process pages | COMPLETE | substantive truthful pages; footer links everywhere incl. contributors |
| Contributors & Reviewer page | COMPLETE | `/contributors/` truthful: "Belum ada reviewer terverifikasi; corpus-derived/beta" + what human-reviewed means + how recorded + correction flow; linked from trust surfaces |
| Manifest linked + theme-color on every page | COMPLETE | `manifest.webmanifest` + `#b7352d`; `update-seo-pwa.mjs` + e2e |
| PNG icons 192/512 (+maskable) | COMPLETE | `tools/gen-images.mjs` deterministic |
| Offline shell + update notification + offline banner | COMPLETE | `sw.js` network-first + versioned `btp-<hash>` (hashTree before revision, LF-normalized), old-cache purge, hashed assets immutable, offline fallback; banner UI |
| Tested CSP (no eval/wildcards, closed third-party while off) | COMPLETE | `_headers` CSP `default-src 'self'`; `connect-src 'self'` closed; Playwright header assertions; zero third-party tour |
| Import size limit + validation | COMPLETE | 512 KB cap + strict schema `validateProgressPayload`; tests |
| Safe DOM rendering (no innerHTML for data) | COMPLETE | `dom.js` `el`/`replaceChildren`; scan test `safe-rendering.test.mjs` |
| Ads component: flag+ID+consent gated, allowlist, single load, CLS-safe | COMPLETE | `assets/js/ads.js`; `ALLOWED_PLACEMENTS`; default OFF |
| No production ads.txt without valid ID | COMPLETE | generator refuses placeholders; only `ads.txt.example` shipped; not in dist |
| Analytics provider contract (no success without consumer) | COMPLETE | `track()` returns `sent:false` on missing provider; consent default OFF; allowlist validated |
| Consent/preferences UI | COMPLETE | toggles on `/progres/`; default denied; no dark patterns |
| Production build → dist (public-only) + verify against it | COMPLETE | `tools/build-dist.mjs` LF-normalize BEFORE hash → deterministic; copies only allowlisted paths; `dist/` is Cloudflare publish dir (`wrangler.toml:pages_build_output_dir=dist`); smoke + browser serve dist |
| Asset revisioning | COMPLETE | 15 assets hashed `*.8hex.*` deterministically (LF-normalized content); imports rewritten via `path.relative`; entry HTML references hashed; `Cache-Control: immutable` for hashed, `must-revalidate` for html/data |
| Noindex ↔ sitemap parity | COMPLETE | single source `topics.json` + `site.config` + sitemap + checker; `tests/data/sitemap-parity.test.mjs` proves `/learn/angka/`, `/keluarga/`, `/sapaan/`, `/makanan/`, `/progres/` noindex + absent, indexable present |

## Testing / CI / docs

| Requirement | Status | Evidence |
|---|---|---|
| Unit/data/migration/engine suites (zero-dep) | COMPLETE | 156 tests via `node --test tests/**/*.test.mjs` (data + unit: sitemap-parity, metadata-cardinality, build-idempotence, lesson-progress, topic-truth) |
| Real browser E2E executing JS | COMPLETE | Playwright chromium 32 specs (core 17 + residual 6 + matching-timer 4 + lesson-fixture 5) incl. matching open vs memory face-down, timer optional, lesson fixture intro→summary, dictionary save, onboarding, progres reset/export, production asset revisioning |
| axe accessibility (serious+critical = 0) | COMPLETE | 6 key pages (`/`, `/games/`, `/flashcards/`, `/dictionary/`, `/progres/`, `/learn/angka/`) in `core.spec.mjs` |
| Zero third-party requests while ads/analytics off | COMPLETE | request-host assertion across 6-page tour |
| CI validates production artifact | COMPLETE | `.github/workflows/verify.yml`: `npm ci` → browsers → `npm run verify` (check+build+unit+smoke+browser+axe) → `git diff --exit-code -- dist` drift gate; `npm run verify` locally reproduces CI; second build idempotent |
| Deterministic build (LF, explicit lastModified, no git history) | COMPLETE | `build-dist.mjs` LF-normalize before hash; explicit `site.config:lastModified`; shallow/full clone identical; tested via `tests/data/build-idempotence.test.mjs` + manual shallow clone |
| Lighthouse / release checklist (Blueprint §24.2) | COMPLETE | `tools/lighthouse-check.mjs` deterministic (dist/_headers/checklist) + `docs/RELEASE_CHECKLIST.md` manual Lighthouse ≥90/95; `package.json:verify:release` |
| Docs truthful (README/PROGRESS_LOG/status classes) | COMPLETE | `README.md` rewritten from actual arch (progress v3 key, pipeline reviewed, dist artifact, wrangler dist, drift gate, external blockers); `PROGRESS_LOG.md` authoritative current-state section; `CURRENT_STATE_AUDIT.md` historical; `ULTIMATE_BLUEPRINT_TRACEABILITY_2026-08-30.md` §1-28 |

---

## Summary classification (at HEAD, CI green, dist drift zero)

```text
REPOSITORY IMPLEMENTATION : COMPLETE
LINGUISTIC CONTENT        : BLOCKED_EXTERNAL (human review of words/phrases/sentences/drafts, 0 human-reviewed)
ADSENSE APPLICATION       : NOT READY (external account + Publisher ID + CMP decision if required; thin topic pages noindex, need substantive reviewed content)
ULTIMATE BLUEPRINT        : NOT COMPLETE (external linguistic/legal/domain/AdSense blockers remain by design)
```

PARTIAL/BLOCKED rows are honest residue of external/content blockers; none hidden. Tool residue removed; EOL canonical; drift gate canonical; homepage truthful; prose audited (keluarga/sapaan kinship/adat/greeting claims softened, topics.json pool-0 descriptions bounded via `topic-registry-truth.test`); Lighthouse gate via `lighthouse-check.mjs` + `RELEASE_CHECKLIST.md`.

---

## Evidence counts (final run)

- `npm test` 156 pass
- `npx playwright test` 32 pass (incl. axe)
- `npm run lighthouse:check` PASS (static checklist + headers/dist)
- published word pairs 367, genuine phrases 0, sentences 80, published lessons 0, draft lessons 6, human-reviewed 0
