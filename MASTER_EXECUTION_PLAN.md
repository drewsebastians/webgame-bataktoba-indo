# Master execution plan

Deliver a responsive desktop/mobile browser learning website and browser PWA. Audio/pronunciation and culture-led differentiation are not near-term priorities. Website engineering and private data collection proceed independently.

Keep the Alignment Engine PRIVATE. Never move private/restricted text into the public repository, logs, external services or build without verified source-specific rights and explicit scope authorization. Do not rewrite public Git history. Maintain separate ENGINEERING_READY, DATA_READY, PUBLICATION_READY, LEARNING_READY and MONETIZATION_READY gates.

For each batch, re-fetch both repository visibilities, main/tree SHAs, Issues, PRs, Actions and current private checkpoint before writing. Use an expected parent SHA and non-force ref updates. Run relevant tests/build/security checks, open a PR, merge only after passing validation, then checkpoint actual commit/check/deployment evidence. Leave completed worktrees/branches clean.

Website: A1 containment is merged at ed7c3ae. A2 PR #4 adds a schema/provenance adapter, isolated synthetic coverage, and a saved-mode guard. Its first Verify run had 191/191 unit tests and E2E smoke green; 30/33 browser tests passed. Three tests found a shared lesson recall transition defect; the repair is underway. Keep the production dataset empty.

Private engine: B23 is complete and must not be repeated. Continue B24 discovery and only retry the scheduled Tatoeba snapshot after it appears. Private validator PR #3 remains unmerged because Actions did not start due to billing/spending-limit status; no passing test is claimed.

Resume from STATUS.md, HANDOFF.md, WORK_QUEUE.csv and latest private run catalog. Production verification requires a green workflow, deployed artifact/build evidence and live readback.
