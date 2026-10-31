# Master execution plan

Deliver a responsive desktop/mobile browser learning website and browser PWA. Audio/pronunciation and culture-led features are not near-term priorities. Website engineering and private data collection proceed independently.

Keep the Alignment Engine PRIVATE. Never move private/restricted text into the public repository, logs, external services or build without verified source-specific rights and explicit scope authorization. Do not rewrite public Git history. Maintain separate ENGINEERING_READY, DATA_READY, PUBLICATION_READY, LEARNING_READY and MONETIZATION_READY gates.

For each batch, re-fetch both repository visibilities, main/tree SHAs, Issues, PRs, Actions and the private checkpoint before writing. Use expected parent SHAs and non-force ref updates. Run relevant tests/build/security checks, open a PR, merge only after passing validation, then checkpoint actual evidence. Do not claim a live deployment without workflow/build and live readback evidence.

Website: A1 containment merged at ed7c3ae. A2 PR #4 adds a schema/provenance adapter, test-only synthetic coverage, and browser flows. Verify run 41171672244 passed 193/193 unit tests and E2E smoke; 31/33 browser tests passed. The remaining failures were a blank Home after lesson-only progress and a synthetic SRS selector/filter mismatch. The SRS fixture and Home diagnostics are being repaired. Keep published content arrays empty.

Private engine: B23 is complete and must not be repeated. B24 discovery continues, and the scheduled Tatoeba snapshot must be checked only after it appears. Private validator PR #3 remains unmerged because Actions did not start due to billing/spending-limit status; no test pass is claimed.

Resume from STATUS.md, HANDOFF.md, WORK_QUEUE.csv and the private latest run catalog.
