# Master execution plan

Deliver a responsive desktop/mobile browser learning website and browser PWA. Audio/pronunciation and culture-led differentiation are not near-term priorities. Website engineering and private data collection proceed independently; neither waits for the other.

Keep the Alignment Engine PRIVATE. Never move private/restricted text into the public repository, logs, external services or build without verified source-specific rights and an explicit scope authorization. Do not rewrite public Git history. Maintain separate ENGINEERING_READY, DATA_READY, PUBLICATION_READY, LEARNING_READY and MONETIZATION_READY gates.

For each batch, re-fetch both repository visibilities, main/tree SHAs, Issues, PRs, Actions and current private checkpoint before writing. Use an expected parent SHA and non-force ref updates. Run relevant tests/build/security checks, open a PR, merge only after passing validation, then checkpoint actual commit/check/deployment evidence. Leave completed worktrees/branches clean.

Website work queue: A1 public exposure containment is merged at ed7c3ae3d22e1685bc31a61b3c027cd21d7254ea. A2 implements the schema-validating Alignment Engine adapter plus synthetic browser flow and fixture-isolation checks; production data remains empty. Continue responsive/accessibility/offline/performance work in parallel where independent.

Private engine work queue: B23 is complete and must not be repeated. Continue B24 discovery and the Tatoeba refresh only after its scheduled snapshot is observed; no collection is gated on publication. The current private validator PR remains unmerged because GitHub Actions did not start due to account billing/spending limit; no test pass is claimed.

Resume from STATUS.md, HANDOFF.md, WORK_QUEUE.csv and the latest private run catalog. Production verification requires a green workflow, deployed artifact/build evidence and live readback. An external provider build check alone is insufficient.
