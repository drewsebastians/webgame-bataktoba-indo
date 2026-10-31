## Latest verified main baseline — 2026-10-31 18:55 UTC

Main commit `08075c01533670beaea8f97bb0e88b7d135ae9c5`; Verify [#94 / 41231508931](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41231508931) passed all 12 audits. Reports are in artifact [13054012122](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41231508931/artifacts/13054012122).

| Route | Mobile Performance | Desktop Performance | Accessibility (both) |
|---|---:|---:|---:|
| Home | 98 | 100 | 100 |
| Angka lesson | 92 | 99 | 100 |
| Games | 99 | 100 | 100 |
| Flashcards | 90 | 100 | 100 |
| Dictionary | 92 | 100 | 100 |
| Progress | 100 | 100 | 100 |

JavaScript is 163,643/196,608 bytes across 17 files (largest file: 77,391 bytes); CSS is 15,491/49,152 bytes. The Flashcards page now uses a dedicated entrypoint, and its browser test confirms it does not request the general app or lesson-engine bundles. Mobile Performance rose from 88 to 90 on this release. These are lab scores, not field-user telemetry.

Cloudflare Workers Builds reported successful production build `0460f206-5b78-4643-812c-1e4aeb9daeef` / version `27c5545e-1eed-47b2-ae83-8948b92cefd5`. Direct live-site readback remains unverified with the available reader. Public learning data is empty/noindex; CI confirmed synthetic fixture markers are absent from dist and no private corpus is included.

# Lighthouse release audit

The release check runs Lighthouse against the generated `dist/` site through the repository's local preview server. It audits six fixed learner-facing routes in the mobile and desktop profiles: home, the angka lesson, games, flashcards, dictionary, and progress. Each audit collects the Performance and Accessibility categories, for 12 reports per release run.

## Reproducibility and gates

- Lighthouse CLI is pinned to `13.4.1`; CI runs it with the Chromium binary installed for Playwright.
- The preview server binds only to `127.0.0.1:4178`. Every allowlisted route must have a generated `dist` page before audit.
- Both profiles must score at least 70/100 for Performance and 90/100 for Accessibility. Missing category scores fail closed.
- Reports are written as `artifacts/lighthouse/lighthouse-<route>-<profile>.json`; GitHub Actions uploads them for 14 days, including when an audit fails.
- `npm run verify:release` runs the core checks and then all Lighthouse audits.

The score gate is a CI regression guard for this static release artifact. A single CI score is not field-user telemetry or proof of a live production deployment. Playwright separately covers browser journeys, including isolated synthetic fixtures. Lighthouse loads only the built public artifact without synthetic fixture interception; published language data remains empty, and private corpus files are not part of this audit.

Review the floors when application structure or the runner changes, using stored reports and a passing run as evidence. Do not lower a floor just to make a failing regression green.

## Previous verified main baseline — 2026-10-31

Public PR #9 added the fixed six-route audit and was merged as `d5dc0a44786b4b12c20a4586a88dfa85406a68f5`. Main Verify run [#56 / 41202127852](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41202127852) passed 201/201 unit tests (0 skipped), 33/33 browser tests, build/data checks and committed-dist drift.

| Route | Mobile Performance | Desktop Performance | Accessibility, both profiles |
|---|---:|---:|---:|
| Home | 98 | 100 | 100 |
| Angka lesson | 92 | 99 | 100 |
| Games | 98 | 100 | 100 |
| Flashcards | 88 | 100 | 100 |
| Dictionary | 92 | 100 | 100 |
| Progress | 87 | 78 | 100 |

All audits met the existing floors (Performance 70, Accessibility 90). The lowest score is desktop `/progres/` at 78. Reports are in artifact `lighthouse-reports-41202127852` (ID `13043018067`, retained 14 days). The site check reported 0 published learning items, 0 words, 0 genuine phrases and 0 sentences. These are CI lab snapshots, not field-user telemetry.

Cloudflare Workers Builds reported production build `aefb2216-8994-4e29-931d-4966a308b4aa` successful for this main commit. Direct readback of the deployed site was attempted through the available web connector but its Pages routes were inaccessible; provider build success is verified, while independent live artifact verification remains open.

## PR #11 candidate verification — run #60 (2026-10-31)

The focused `/progres/` entrypoint change is on PR #11 at code/dist head `2c412b1f940e1548cb34f0e54a359d9740531a08`. Verify [run #60 / 41206008614](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41206008614) passed all 201 unit tests (0 skipped), all 34 browser tests, build/smoke/performance budget, all 12 Lighthouse route/profile audits and committed-dist drift. The browser request assertion confirms the progress route does not load `app.js` or quiz, lesson, and game-mode bundles. Its fingerprinted entrypoint is 9,975 bytes; total JavaScript is 153,131/196,608 bytes across 16 files and CSS is 15,217/49,152 bytes.

| Route | Mobile Performance | Desktop Performance | Accessibility, both profiles |
|---|---:|---:|---:|
| Home | 98 | 100 | 100 |
| Angka lesson | 94 | 99 | 100 |
| Games | 98 | 100 | 100 |
| Flashcards | 89 | 100 | 100 |
| Dictionary | 92 | 100 | 100 |
| Progress | 89 | 78 | 100 |

All candidate audits exceeded the 70 Performance / 90 Accessibility floors. Reports are in `lighthouse-reports-41206008614` (artifact ID `13043638906`, retained 14 days). The desktop progress score remains 78; these are lab snapshots, not field telemetry.

Cloudflare Workers Builds check succeeded for the PR candidate (build `67dbfb92-aa03-4567-aa85-46477b82ba28`, version `12feb4c9-2b57-48da-a646-46aa7c01a382`). Production main deployment and independent live readback remain unverified until after merge and an accessible readback.


## Latest verified main deployment — run #62 (2026-10-31)

PR #11's focused progress entrypoint is merged on main `730ff3fdd1db6190d70cc37774c3800db1e1602b`. Verify [run #62 / 41207408541](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41207408541) passed 201/201 unit tests (0 skipped), 34/34 browser tests, build/smoke, performance budget, all 12 route/profile Lighthouse audits, and committed-dist drift. The browser assertion confirms `/progres/` does not request the main application or quiz, lesson, and game-mode bundles.

| Route | Mobile Performance | Desktop Performance | Accessibility, both profiles |
|---|---:|---:|---:|
| Home | 99 | 100 | 100 |
| Angka lesson | 93 | 99 | 100 |
| Games | 98 | 100 | 100 |
| Flashcards | 88 | 100 | 100 |
| Dictionary | 93 | 100 | 100 |
| Progress | 89 | 78 | 100 |

All audits met the existing 70 Performance / 90 Accessibility floors. Artifact `lighthouse-reports-41207408541` (ID `13044757621`) retains the reports for 14 days. JavaScript is 153,131/196,608 bytes across 16 files; CSS is 15,217/49,152 bytes. These are lab scores, not field-user telemetry.

Cloudflare Workers Builds check reported production build `9236ed12-0264-47ef-8429-b6ae23453538` / version `7a3eec26-1e93-437b-8adb-0b7994330563` successful for main. This verifies provider build/deployment status. Direct live-site readback remains unverified through the available route/tooling. Public data check reports zero published items, words, genuine phrases, and sentences; synthetic fixtures and private corpus are not in the audited artifact.
