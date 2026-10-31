# Production asset budget

## Scope

This guard keeps minified first-party JavaScript and CSS in `dist/assets` within a reviewed size envelope. It checks uncompressed file bytes from the production build. It does not estimate gzip/Brotli transfer sizes, runtime performance, or Lighthouse scores. Images and fonts are outside the first version of the budget.

## Baseline and limits

Measured from public `main` 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e (tree 964e674b438eb3a26419c747c9f030af282516bc):

| Asset class | Files | Baseline bytes | Aggregate budget | Per-file budget |
|---|---:|---:|---:|---:|
| JavaScript (`.js`, `.mjs`) | 14 | 129,845 | 196,608 (192 KiB) | 98,304 (96 KiB) |
| CSS (`.css`) | 1 | 15,217 | 49,152 (48 KiB) | 49,152 (48 KiB) |

The JS aggregate allows about 51% growth from this baseline; the largest JS file is 77,391 bytes, leaving about 27% before its individual limit. The first CSS limit is intentionally a broad ceiling while the stylesheet is small.

## Enforcement

- `npm run performance:budget` scans built files under `dist/assets`.
- `npm run verify:core` runs the guard after the build and unit suite. `npm run verify:release` includes `verify:core`.
- `tests/data/performance-budget.test.mjs` checks the recorded baseline, individual file failures, and aggregate failures.
- Missing JS or CSS output fails the gate to catch broken/incomplete builds.

Revisit limits when the application changes materially. Keep the thresholds tied to measured artifact evidence and raise them only with a documented reason.
