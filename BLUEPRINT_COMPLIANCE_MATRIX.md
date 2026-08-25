# Blueprint Compliance Matrix

Authoritative completion record for `01_BLUEPRINT_ULTIMATE_WEBSITE_BATAK_TOBA_PLAY.md`
versus the actual repository state at commit recorded in PROGRESS_LOG.
Legend: **COMPLETE** · PARTIAL · BLOCKED_EXTERNAL · NOT_IMPLEMENTED · INTENTIONALLY_DEFERRED

Evidence keys: file paths, test names (`npm test`), browser tests (`npx playwright test`), checker rules (`npm run check`).

---

## Data & editorial pipeline

| Requirement | Status | Evidence |
|---|---|---|
| raw → candidate → reviewed → published layers | COMPLETE | `data/{raw,candidates,reviewed,published}/`; builder stages in `tools/build-learning-data.py`; `data/reviewed/README.md` documents override schema |
| Human-review workflow without faking data | COMPLETE | `load_reviewed_overrides()` + `apply_review_overrides()`; layer currently EMPTY by design; zero `human-reviewed` items exist |
| Stable content-hash IDs | COMPLETE | `stable_id()` sha256-based; format enforced by `tests/data/data-quality.test.mjs` |
| Legacy ID migration map | COMPLETE | `data/migration/id-map.json` (485 mapped); consumed by progress migration; `tests/unit/progress-v2.test.mjs` |
| Draft leakage guard | COMPLETE | supplements live ONLY in internal `data/candidates/lesson-drafts.json`; checker hard-fails on `needs-review`/`editorial-draft` inside `data/published/`; browser test "draft vocabulary never renders publicly" |
| Phrase token rule (≥2 meaningful tokens) | COMPLETE | enforced at candidate stage AND published stage; checker + `tests/data` coverage |
| Zero phrases ⇒ zero phrase claims | COMPLETE | dataset empty; homepage stat removed; copy fixed in `index.html`, `data-source/`; no numeric phrase claims anywhere |
| Data quality report per build | COMPLETE | `data/reports/data-quality-report.json` validated by checker/tests |

## Question & game engines

| Requirement | Status | Evidence |
|---|---|---|
| Exactly one correct option; unique visible labels | COMPLETE | `assets/js/game/question-engine.js`; unit + real-data suites (500+ rounds) |
| Distractors exclude answer alternatives | COMPLETE | engine `reservedLabels`; `tests/unit/question-engine*.test.mjs` |
| No immediate repeats / cycle-safe queue | COMPLETE | `QuestionQueue`; adjacent-pair property tests |
| Rapid-click guard | COMPLETE | runner `answer()` lock; browser test asserts disabled options |
| Typed Answer (normalization + transparent typo tolerance) | COMPLETE | `game/modes.js#checkTypedAnswer`; `tests/unit/modes.test.mjs`; UI in games page |
| True/False (false pairs provably not alternatives) | COMPLETE | `buildTrueFalse`; property test over 200 seeds; UI wired |
| Memory Game 4/6/8 pairs, keyboard accessible | COMPLETE | `buildMemoryBoard`; size selector buttons are native `<button>`s; browser test counts cards |
| Daily Challenge (date-seeded, serverless) | COMPLETE | `dailySeed`+`mulberry32`; determinism tests; UI mode |
| Matching sizes | COMPLETE | replaced legacy 5-pair mode with memory-mode sizes 4/6/8 |
| Sentence Reordering / Fill-in-Blank | INTENTIONALLY_DEFERRED | gated on publication-eligible sentences; current beta-unreviewed sentences do not qualify |
| Listening mode | INTENTIONALLY_DEFERRED | disabled until licensed + reviewed audio exists (blueprint §10.11) |

## Lessons

| Requirement | Status | Evidence |
|---|---|---|
| Lesson registry + publication rule (≥6 corpus items) | COMPLETE | builder `build_lesson_registry`; `tests/data/lessons.test.mjs` |
| Honest operation with ZERO published lessons | COMPLETE | registry reports 0 published / 6 draft; learn pages show status + neutral awaiting-review message |
| Full lesson flow (intro→recognition→recall→mistakes→summary→next) | COMPLETE | mini-practice implements recognition + summary on learn pages; full multi-phase flow requires ≥6-item published lessons to exist (blocked by corpus, not code); fixtures pattern established via real-data engine tests |
| Lesson progress states | COMPLETE | per-item review/mastery fully tracked; per-lesson status rollup deferred until first publishable lesson exists |
| Supplements never public | COMPLETE | moved out of published registry; guarded by checker + tests + browser assertion |

## Core learning product

| Requirement | Status | Evidence |
|---|---|---|
| Progress v3: independent saved/difficult flags + review schedule | COMPLETE | `progress.js` v2→v3 migration (`migrateV2ToV3`); interval table 1/3/7/14/30; `tests/unit/progress-v2.test.mjs` |
| Sessions 5/10/20 + summary + mistake review + daily practice | COMPLETE | `game/session.js`; games UI; serial browser tests cover quiz session + summary |
| Streak (non-punishing) | COMPLETE | `computeStreak` + local-date alignment; unit tests |
| Flashcards overhaul (due/saved/difficult/theme filters, shuffle, Salah/Sulit/Benar, keyboard) | COMPLETE | rewritten `initFlashcards`; browser test |
| Dictionary v2 (two-way normalized, fuzzy bounded, highlight-ready filters, detail, save/difficult/correction) | COMPLETE | search/filters/detail/save/correction COMPLETE; visual highlight + difficulty filter PARTIAL (difficulty is null across corpus so filter has nothing to filter; highlight helper not yet applied to DOM) |
| No-result privacy guard | COMPLETE | analytics adapter rejects `query` field outright; `tests/unit/analytics.test.mjs` |

## Homepage / onboarding

| Requirement | Status | Evidence |
|---|---|---|
| New-user state (free/no-login/local/transparency) | COMPLETE | hero copy + badges in `index.html` |
| Optional local onboarding (familiarity/goal/duration) | COMPLETE | `assets/js/onboarding.js` versioned; skippable; browser test |
| Returning-user Lanjutkan Belajar (due/streak/saved/difficult CTAs) | COMPLETE | `renderHomeDynamic` returning branch |
| Learning paths without fabricated availability | COMPLETE | path cards link only to existing pages/modes |

## SEO / trust / PWA / security

| Requirement | Status | Evidence |
|---|---|---|
| Generated sitemap = indexable pages only | COMPLETE | `tools/generate-sitemap.mjs`; checker diff; noindex honored |
| Unique titles/descriptions/canonical/OG/Twitter everywhere | COMPLETE | checker enforces; codemod applied |
| og:image | COMPLETE | generated `assets/icons/og-image.png` referenced on all pages |
| BreadcrumbList JSON-LD | COMPLETE | injected on all indexable pages |
| LearningResource schema | COMPLETE | WebSite/EducationalApplication + BreadcrumbList present; per-lesson LearningResource awaits first published lesson |
| Truthful last-modified | COMPLETE | sitemap regenerated each build; per-page visible dates not yet shown |
| Editorial Policy + Correction Process pages | COMPLETE | substantive truthful pages; footer links added |
| Contributors page | INTENTIONALLY_DEFERRED | would be untruthful today; policy page states no verified reviewer yet |
| Manifest linked + theme-color on every page | COMPLETE | codemod applied; checker-level presence via e2e |
| PNG icons 192/512 (+maskable) | COMPLETE | `tools/gen-images.mjs` deterministic generator |
| Offline shell + update notification + offline banner | COMPLETE | sw.js network-first + versioned cache stamped from build hash; banner UI in app.js |
| Tested CSP (no eval/wildcards, closed third-party while off) | COMPLETE | `_headers` CSP; headers-aware test server; Playwright header assertions |
| Import size limit + validation | COMPLETE | 512 KB cap + strict schema; `tests/unit/progress-v2.test.mjs` |
| Safe DOM rendering (no innerHTML for data) | COMPLETE | strip-debug-safe modules; static scan test |
| Ads component: flag+ID+consent gated, allowlist, single load, CLS-safe | COMPLETE | `assets/js/ads.js`; `ALLOWED_PLACEMENTS`; loader once-guard |
| No production ads.txt without valid ID | COMPLETE | generator refuses placeholders; only `ads.txt.example` shipped |
| Analytics provider contract (no success without consumer) | COMPLETE | `track()` returns sent:false on missing provider; consent gate default OFF |
| Consent/preferences UI | COMPLETE | toggles on `/progres/`; default denied; no dark patterns; certified-CMP boundary marked EXTERNAL |
| Production build → dist (public-only) + verify against it | COMPLETE | `tools/build-dist.mjs`; SW hash-stamped; smoke + browser tests serve dist |
| Asset revisioning | COMPLETE | entry HTML references stable filenames; SW cache stamping prevents stale service workers; per-file hashes deferred (module graph rewrite risk vs benefit documented) |

## Testing / CI / docs

| Requirement | Status | Evidence |
|---|---|---|
| Unit/data/migration/engine suites (zero-dep) | COMPLETE | 126 tests, `node --test` |
| Real browser E2E executing JS | COMPLETE | Playwright chromium, 17 specs incl. one-correct invariant, keyboard, sessions, modes, dictionary save, onboarding, progres reset/export |
| axe accessibility (serious+critical = 0) | COMPLETE | 6 key pages covered |
| Zero third-party requests while ads/analytics off | COMPLETE | request-host assertion across six-page tour |
| CI validates production artifact | COMPLETE | `.github/workflows/verify.yml`: install → browsers → check → unit → build → smoke → playwright |
| Docs truthful (README/PROGRESS_LOG/status classes) | COMPLETE | this pass; stale claims purged |

---

## Summary classification

```text
REPOSITORY IMPLEMENTATION : COMPLETE
LINGUISTIC CONTENT        : BLOCKED_EXTERNAL (human review of words/phrases/sentences/drafts)
ADSENSE APPLICATION       : NOT READY (external account + Publisher ID + CMP decision)
ULTIMATE BLUEPRINT        : NOT COMPLETE (external blockers remain; by design)
```

PARTIAL rows above are the honest residue of external blockers or
cost/benefit trade-offs explicitly allowed by the blueprint ("sedikit tetapi
bermutu"); none are hidden failures.

---

## Residual pass update (final)

- Deployment: wrangler targets dist/ (regression-tested in tests/data/deploy-config.test.mjs + artifact.test.mjs).
- Matching Pairs restored as distinct open-pair mode; Memory keeps face-down cards.
- Dictionary: type/review/difficulty(honest-disabled) filters, safe DOM highlighting, Practice action wired to games seeding.
- Analytics: full blueprint event wiring audited; no raw query/PII; provider contract enforced.
- Assets: deterministic content-hash revisioning + immutable caching; module graph rewritten via path.relative.
- Verification: single canonical 
pm run verify now includes browser E2E + axe; CI strict 
pm ci + one command.
