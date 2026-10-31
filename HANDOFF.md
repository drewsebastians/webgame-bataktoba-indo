# Resume handoff

1. Re-fetch both repository visibilities, main/tree SHAs, Issues, PRs and Actions before each batch.
2. Public main remains `ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea` (tree `3c92da8cfb635786eba78eba7d9f8c7b1c60b912`). Continue PR #4 on `codex/2026-10-31-webgame-synthetic-adapter-a2`; current CI found that lesson recall advanced after one answer, skipping the remaining recall prompts. Fix is on the branch; wait for and inspect the next full Verify run.
3. A2 first Verify run 41170059393: 191 unit tests passed, E2E smoke passed, 30/33 browser tests passed. All 3 browser failures shared the same recall transition defect. Cloudflare Workers Builds succeeded for the tested head; live-site readback remains unverified.
4. Public A1 containment is merged at ed7c3ae. Production published arrays stay empty. No history rewrite.
5. Private engine PR #3 remains open because run 41167909686 did not start due GitHub billing/spending-limit status. Do not merge until a real successful workflow run is available.
6. Do not repeat B17–B23. B24 is next; Tatoeba refresh scheduled after 2026-10-31 06:30 UTC. Continue other permitted discovery in parallel.
7. Synthetic browser fixtures stay under `tests/` and are intercepted; never transfer engine text or fixture labels into production artifacts.
8. Update these checkpoints with the exact next SHA/test result before changing tracks. Production verification needs a successful workflow, deployed artifact/build evidence, and live readback.
