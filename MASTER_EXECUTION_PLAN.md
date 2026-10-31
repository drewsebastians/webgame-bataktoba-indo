# Master execution plan

## Mission and constraints

Build a useful responsive desktop and mobile browser game and browser PWA. Website engineering and private data research continue independently. Audio, pronunciation, and culture-led features are not current priorities.

Keep drewsebastians/batak-indo-alignment-engine PRIVATE. Never move private or restricted language text into the public repository, logs, external services, or build artifacts without verified record-specific rights and explicit publication scope. Do not rewrite public Git history.

For every batch, re-check both repository visibilities, main/tree SHAs, Issues, PRs, Actions, and private latest.json. Use expected-SHA updates, non-force ref moves, tests and deployment evidence. Keep persistent STATUS, HANDOFF, and WORK_QUEUE checkpoints current.

## Independent readiness gates

| Gate | Current rule |
|---|---|
| ENGINEERING_READY | Website features and isolated synthetic flows build and pass CI; does not imply language content is ready. |
| DATA_READY | Specific records have sufficient provenance, evidence, quality, topics, alternatives, and per-game eligibility. |
| PUBLICATION_READY | Record rights and upstream scope explicitly permit public use. |
| LEARNING_READY | Lawful published lessons work end-to-end and production is checked. |
| MONETIZATION_READY | Separate future gate; no current priority. |

## Current checkpoint — 2026-10-31 10:47 UTC

Public A2 is integrated through PR #4, merge commit 14fe3bb5f2a7c9d2d663f9c3221382afb54bb76e. Verify run 41191955903 passed 193 unit tests, E2E smoke, 33 Playwright tests, drift check, and release prerequisites. Cloudflare Workers Builds reported production deployment success (build f6ede399-fa67-4960-b615-b5f5d5fdaed0; version b6ccda02-0d2d-44c3-ad4f-129deb03e89b). Direct live readback is unavailable, so do not call the live artifact verified. Published content remains empty; synthetic test data is intercepted and absent from production artifacts.

Historical corpus-derived snapshots were deleted from the current public tree by the A1 containment change. Older public Git commits retain those objects. No history rewrite was authorized or performed.

Private B23 remains the latest completed batch. B24 is metadata-only and has produced no permitted records or consumer items. The current private validator PR cannot run because GitHub Actions fails before validator startup; run 41193636578 exposed no steps or logs. The approved private source vault remains unavailable.

## Next actions

1. Continue A3 browser work on measured performance, PWA/offline behavior, accessibility, security, and live-site readback.
2. Keep the public content gates closed and all content arrays empty until rights and quality pass.
3. Continue B24 source discovery in parallel, metadata-only while rights or vault access are unresolved.
4. Recheck private CI only when Actions can start; do not mark engineering validation complete without actual test logs.


## A3 performance budget — 2026-10-31 10:53 UTC

Branch `codex/2026-10-31-browser-performance-checkpoint-a3` adds `npm run performance:budget` to `verify:core`, plus unit coverage for individual and aggregate thresholds. The measured main baseline is 129,845 bytes of minified JS across 14 files and 15,217 bytes of CSS in one file. Budgets are 196,608 total JS bytes / 98,304 per JS file and 49,152 total CSS bytes / 49,152 per CSS file. These are uncompressed artifact limits; they do not claim Lighthouse scores or compressed transfer sizes. Verify workflow run #46 (`41194897354`, job `124518995179`) passed 196/196 unit tests, E2E smoke, 33/33 browser tests, `performance:budget`, release prerequisites, and dist drift. No full Lighthouse score audit or A3 production deployment is claimed yet; PR #5 remains open.
