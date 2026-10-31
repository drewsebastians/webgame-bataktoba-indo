# Lighthouse release audit

The release check runs Lighthouse against the generated `dist/` site through the repository's local preview server. It performs two audits of the home route: the default mobile profile and the built-in desktop preset. Each audit collects the Performance and Accessibility categories.

## Reproducibility and gates

- Lighthouse CLI is pinned to `13.4.1`; CI runs it with the Chromium binary installed for Playwright.
- The preview server binds only to `127.0.0.1:4178`. The audit does not require a deployed URL or credentials.
- Both profiles must score at least 70/100 for Performance and 90/100 for Accessibility. Missing category scores fail closed.
- Reports are written to `artifacts/lighthouse/lighthouse-mobile.json` and `artifacts/lighthouse/lighthouse-desktop.json`; GitHub Actions uploads them for 14 days, including when an audit fails.
- `npm run verify:release` runs the core checks and then the two Lighthouse audits.

The score gate is a CI regression guard for this static release artifact. A single CI score is not field-user telemetry or proof of a live production deployment. Current audits cover the home route; browser journey coverage remains in the Playwright suite. Published language data remains empty, and this audit does not load private or synthetic linguistic fixtures.

Review the floors when application structure or the runner changes, using stored reports and a passing run as evidence. Do not lower a floor just to make a failing regression green.

## Latest verified main baseline — 2026-10-31

Verify run [#52 / 41199134008](https://github.com/drewsebastians/webgame-bataktoba-indo/actions/runs/41199134008) passed on main commit `ce3338f0ac03fd56601db29c361bb8927b6ca247`. Scores were mobile Performance 99 / Accessibility 100 and desktop Performance 100 / Accessibility 100. The reports are available in artifact `lighthouse-reports-41199134008` (ID `13041633182`, retained for 14 days). An earlier PR run measured mobile Performance 98 / Accessibility 100 and desktop 100 / 100; these are CI snapshots rather than field-user measurements.

Cloudflare Workers Builds reported production build `14592e21-73bd-40cc-b629-99fc4b58c422` successful. The available web connector could not open the deployed artifact, so provider build success does not establish independent live-site readback.
