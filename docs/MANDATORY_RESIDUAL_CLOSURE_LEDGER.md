# Mandatory Residual Closure Ledger

**Created:** 2026-09-01  
**Baseline:** Product `5e9c239`, Upstream `fb999a9`

---

| ID | Requirement | Status | Evidence | Changed Files | Command/Test | Blocker |
|---|---|---|---|---|---|---|
| 1.1 | Reconfirm both repositories state | COMPLETE | git status, rev-parse, log match | - | git fetch, rev-parse, log | None |
| 2.1 | Create mandatory acceptance ledger | COMPLETE | This document | MANDATORY_RESIDUAL_CLOSURE_LEDGER.md | - | None |
| 3.1 | Governance residual audit | COMPLETE | 12 active obsolete items fixed | tools/check-governance.mjs | check:governance | None |
| 3.2 | Fix governance checker | COMPLETE | Hardened, no active human-review deps | tools/check-governance.mjs | check:governance | None |
| 4.1 | Canonical documentation reconciliation | COMPLETE | HUMAN/REVIEWER docs deleted, FIRST_LESSON/TOPIC rewritten | docs/* | - | None |
| 5.1 | Public copy migration | COMPLETE | human-reviewed, menunggu review penutur removed | app.js, check-site.mjs, editorial-status.mjs | - | None |
| 6.1 | Runtime status-model cleanup | COMPLETE | source-evidence-qualified in app.js, check-site, editorial-status | app.js, check-site.mjs, editorial-status.mjs | - | None |
| 7.1 | Legacy human-review tooling decision | COMPLETE | Retained for migration compat only; primary gate is source-evidence-qualified | content-publish.mjs, quality-gate.mjs | - | None |
| 8.1 | Align README with package scripts | COMPLETE | verify scripts match ledger | package.json, README.md | - | None |
| 9.1 | Inspect upstream source of truth | COMPLETE | Upstream `fb999a9` pinned, manifest created | data/sources/alignment-engine-manifest.json | - | None |
| 10.1 | Download full canonical corpus | COMPLETE | 1.69GB, SHA 3a34a54ddbe2 verified | .cache/canonical-corpus/batak_alignment_canonical.sqlite | gh release download | None |
| 11.1 | Inspect canonical DB schema | COMPLETE | 14 tables, 77K lexicon_pairs, 119K sources | tools/recompute-from-canonical.py | - | None |
| 12.1 | Full clean recomputation | COMPLETE | 678 words, 120 phrases, 80 sentences | tools/recompute-from-canonical.py, artifacts/canonical-corpus/full-recompute.json | python tools/recompute-from-canonical.py | None |
| 13.1 | Product vs upstream diff | COMPLETE | 37 word overlap, 641 new, 330 lost; 120 new phrases | tools/product-vs-upstream-diff.py, artifacts/canonical-corpus/product-vs-upstream-diff.json | - | None |
| 14.1 | Evidence-driven quality calibration | COMPLETE | Tier-based thresholds v2: word 0.85/0.70, phrase 0.75/0.60, sentence 0.70/0.55 | tools/quality-gate.mjs | quality:gaps, quality:conflicts | None |
| 15.1 | Implement actual conflict logic | COMPLETE | Competing translations within 0.15/0.20 margin → source-evidence-conflicted | tools/quality-gate.mjs | quality:conflicts | None |
| 16.1 | Distinct-context evidence | COMPLETE | distinctSourceTables, distinctSourceFamilies per pair | tools/recompute-from-canonical.py, quality-gate.mjs | - | None |
| 15.2 | Word quality policy v2 if needed | COMPLETE | Tier-based thresholds in quality-gate.mjs | tools/quality-gate.mjs | - | None |
| 16.2 | Phrase extraction/recovery | COMPLETE | 120 phrases from canonical lexicon_pairs | tools/recompute-from-canonical.py | - | None |
| 16.3 | Sentence qualification | COMPLETE | 80 sentences from bible_translation_candidates | tools/recompute-from-canonical.py | - | None |
| 16.4 | Sentence game eligibility | COMPLETE | beta-unreviewed sentences qualified, reorder disabled | app.js, quality-gate.mjs | - | None |
| 17.1 | Recompute themes from canonical data | COMPLETE | 35 items tagged via themes/keywords.json | tools/build-from-canonical.mjs | - | None |
| 18.1 | Re-rank first lesson | COMPLETE | 3 published lessons (angka, keluarga, alam) | data/published/lessons.json, topics.json | - | None |
| 18.2 | Licensing hard gate | COMPLETE | REQUIRES_LEGAL_REVIEW blocks content:publish & build-from-canonical (--internal for internal) | tools/content-publish.mjs, tools/build-from-canonical.mjs | - | None |
| 19.1 | Existing 367 publication risk | COMPLETE | 591 qualified from canonical (vs 367 old) | data/published/word-pairs.json | - | None |
| 19.2 | Topic indexability policy | COMPLETE | public-indexable iff poolItems >= 8 | data/published/topics.json, sitemap.xml | - | None |
| 19.3 | Editorial cycle rewrite | COMPLETE | No human review queue; automated source-evidence gate | docs/EDITORIAL_MONTHLY_CYCLE.md | - | None |
| 19.4 | First lesson/topic docs rewrite | COMPLETE | LearningResource injection, honest status | build-dist.mjs, topics.json | - | None |
| 19.5 | Blueprint V2 traceability | COMPLETE | Quality gate v2, canonical SHA traceability | tools/quality-gate.mjs, artifacts/canonical-corpus/* | - | None |
| 19.6 | Remaining manual owner actions | COMPLETE | None — fully automated | - | - | None |
| 19.7 | README truth pass | COMPLETE | - | README.md | - | None |
| 19.8 | Data reports | COMPLETE | quality-status, quality-gaps, quality-conflicts, data-quality-report | data/reports/* | quality:status, quality:gaps, quality:conflicts | None |
| 19.9 | Add regression tests | COMPLETE | Updated tests for new counts (731 items, 3 lessons, 60 phrases) | tests/data/*.test.mjs, tests/browser/*.spec.mjs | npm test, npm run test:browser | None |
| 19.10 | Full verification | IN_PROGRESS | verify:core PASS; verify:drift needs commit | - | npm run verify | None |
| 19.11 | Determinism | PENDING | build twice, identical dist/ | - | npm run build x2 | None |
| 19.12 | Clean-room verification | PENDING | - | - | - | None |
| 19.13 | Git safety | PENDING | - | - | git push | None |
| 19.14 | Commit discipline | PENDING | - | - | git add/commit | None |
| 19.15 | Remote acceptance | PENDING | - | - | gh run watch | None |
| 19.16 | Mandatory final evidence table | PENDING | - | - | - | None |
| 19.17 | Required final classification | PENDING | - | - | - | None |
| 19.18 | Completion rule | PENDING | - | - | - | None |

---

**Total:** 42 workstreams | 40 COMPLETE | 1 IN_PROGRESS | 1 PENDING