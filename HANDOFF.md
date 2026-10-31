# Resume handoff

1. Re-fetch both GitHub repository visibilities, main SHAs and tree SHAs; inspect Issue #2, PRs and Actions before every batch.
2. Public latest verified main is `ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea` (tree `3c92da8cfb635786eba78eba7d9f8c7b1c60b912`). Continue A2 PR checks, repair only against the live head, and merge only after full verification passes.
3. Public A1 containment is merged. Historical Git history was not rewritten. Production pools remain empty; live deployment readback is unverified.
4. Private engine PR #3 remains open. Its check run did not start because GitHub reported billing/spending limit. Do not claim validation or merge it until a real successful check is available.
5. Do not repeat B17–B23. B23 finished with 0 new direct bbc–Indonesian pairs; B24 is next. Tatoeba refresh scheduled after 2026-10-31 06:30 UTC; continue other permitted discovery meanwhile.
6. Keep all website E2E content as marked test-only fixtures under `tests/`; the adapter must fail closed without real rights and explicit scope approval. Never copy private text or corpus into public artifacts.
7. Update STATUS.md, HANDOFF.md, WORK_QUEUE.csv and PROGRESS_LOG.md with exact tests, branch/PR/commit/check state and next action before switching tracks.
8. For deployment, verify successful workflow, deployed artifact/build, and live page separately; do not infer live success from a provider check.
