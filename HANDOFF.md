# Resume handoff

1. Re-fetch repository visibility, main/tree SHAs, Issues, PRs, Actions and private latest.json before each batch.
2. Public main is `ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea` (tree `3c92da8cfb635786eba78eba7d9f8c7b1c60b912`). A2 PR #4 branch is `codex/2026-10-31-webgame-synthetic-adapter-a2` at `f8c7416f8628ad9eace8e80856f1461dd3865e5c`; the latest Verify run 41170470319 passed 191/191 unit tests and E2E smoke, with 32/33 browser checks passing.
3. The one failing browser test found lesson-only history was not treated as meaningful progress on Home. Current branch update adds a shared lesson-history predicate to onboarding and the Home returning card plus unit coverage; rerun the full release verification and inspect build drift.
4. Cloudflare reported success for the A2 PR build on `f8c7416`; treat this as provider build/deployment evidence only. Live-site readback is unverified.
5. Production published arrays remain empty. Keep synthetic fixtures under tests and intercept them; never copy private or restricted language text here. Do not rewrite public Git history.
6. Private engine main remains `cfec3baeb8beee4738c81fde73ba92b71755bc22`. B23 is complete and must not be repeated; B24 is next. Tatoeba weekly refresh is only eligible after 2026-10-31 06:30 UTC.
7. Private PR #3 remains open at `3e0c6acc9bfbb485640507b55c19b25b43df8dc7`; run 41167909686 did not start because GitHub reported billing/spending-limit status. No validator tests passed yet; keep it unmerged.
8. Current readiness: engineering in progress, data in progress, publication and learning not ready, monetization deferred. Confirm a green workflow, built artifact and live readback before claiming production verified.
