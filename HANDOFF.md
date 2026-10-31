# Resume handoff

1. Re-fetch repository visibility, main/tree SHAs, Issues, PRs, Actions and private `latest.json` before each batch.
2. Public main is `ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea` (tree `3c92da8cfb635786eba78eba7d9f8c7b1c60b912`). A2 PR #4 branch `codex/2026-10-31-webgame-synthetic-adapter-a2` is `f32c0bdd68e280c155e1e0225f44b29d69d37d00`. Verify run 41171672244 passed 193/193 unit tests (0 skipped) and E2E smoke; Playwright passed 31/33.
3. Two browser failures remain: Home was empty after lesson completion, despite the attempted lesson-history-aware onboarding fix; SRS test selected a nonexistent `#flashcard` and filtered to due cards before scheduling one. The SRS selector/filter are corrected; Home runtime diagnostics are added to the next run.
4. Cloudflare reported success for the A2 PR build. This is provider build/deployment evidence only; live-site readback is unverified.
5. Production published arrays stay empty. Keep synthetic fixtures under tests/intercepted requests. No private corpus text or restricted records go into this public repo. Do not rewrite history.
6. Private engine main remains `cfec3baeb8beee4738c81fde73ba92b71755bc22`. B23 is complete; B24 is next. Check the Tatoeba weekly export only after 2026-10-31 06:30 UTC and continue independent permitted discovery.
7. Private PR #3 remains open at `3e0c6acc9bfbb485640507b55c19b25b43df8dc7`; run 41170710503 did not start because GitHub reported billing/spending-limit status. No validator tests have run or passed; keep it unmerged.
8. Keep readiness gates separate. Production verification requires green workflow, build/deployment evidence and live readback.
