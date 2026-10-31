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

## Latest verified main baseline — 2026-10-31

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
