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

Verify run [#54 / 41200639789](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41200639789) passed on main commit `586943a6cf92b759dcceba87fc9b9e123b029295`. At that time Lighthouse covered the home route only: mobile Performance 99 / Accessibility 100 and desktop Performance 100 / Accessibility 100. The reports are in artifact `lighthouse-reports-41200639789` (ID `13042985213`, retained for 14 days). The six-route audit will be reported after its own CI run.

Cloudflare Workers Builds reported production build `9a3c3308-b778-40ed-a09d-947cfdc5d6ca` successful. The available web connector could not open the deployed artifact, so provider build success does not establish independent live-site readback.
