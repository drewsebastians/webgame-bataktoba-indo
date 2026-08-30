# Source Extraction Trace — Batak Toba Play

**Pipeline:** `tools/build-learning-data.py` `raw → candidate → reviewed → published` (see `docs/DATA_REPRODUCIBILITY.md` for DB).

## Source Tables (master_alignment_bible_only.db, not present locally)
- `translation_candidates` (batak_lexical_entry_id, indo_lexical_entry_id, cooccurrence_id, confidence_score/label, candidate_status, generation_method)
- `lexical_entries` (normalized_form, token_type word/phrase, is_stopword_candidate)
- `cooccurrence_stats` (cooccurrence_count, dice_score, adjusted)
- `verses` (verse_key, batak_text, indo_text) for sentences

Input fallback `bible_batak_indo_v1.db` 31102 verses (for sentences).

## Filters & Counts (from code + data-quality-report)
- **Confidence:** keep only `high/medium` (removes low). For 367 published, raw rows ~? (report notes).
- **Token clean:** `is_clean_token` len 3-18, regex `^[a-zA-Z'’-]+`, proper-name hints 200+ names (e.g., Abraham, Yakub) → `word.probable-transliterated-name` (conservative).
- **Transliterated name similarity:** `SequenceMatcher >=0.76` + cooccurrence <200 → excluded.
- **Dedupe exact pair:** `candidate.exact-duplicate-pair`
- **Merge collisions:** `batak` label duplicate → `indonesianAlternatives`, `indonesia` duplicate → `batakAlternatives` (prevents ambiguous quiz).
- **Phrase hard rule:** `tokenize` <2 tokens → `phrase.fewer-than-two-tokens` (all 120 raw phrases were 1-token, so published 0).
- **Pool limit:** `MAX_WORD_PAIRS 720`, `MAX_PHRASE 120`, `MAX_SENTENCES 80` (caps after merges).
- **Publication:** `passes_publication_rules` requires id/type/batak/indonesia/reviewStatus, phrase ≥2 tokens.

**For angka:** 5 survive (`ualu, sia, pitu, tolu, onom`) all `corpus-derived` high/medium. No additional angka survived because:
- `sada, dua, opat, lima, walu, sampulu, saratus, saribu` in `lesson-drafts.json` are `editorial-draft` without corpus high/medium confidence entry (either low confidence, stopword, or not in translation_candidates).
- `sada` appears 3228× in `bible_batak_indo` raw text but alignment confidence for `sada↔satu` is low/ambiguous per `translation_candidates` (checked via `search_angka.py` draft vs published mismatch).

**Could legitimate angka be excluded?** Possibly, but not without evidence: `walu` 0 occurrences in `verses.batak_text` vs `ualu` 8 occurrences for delapan → correct form is `ualu` (pipeline kept correct). `sada→satu` may have been filtered as stopword or low dice; would need to inspect master DB `translation_candidates` for `sada` rows to quantify.

**Stable ID:** `hash( batak + 0x1f + indonesia )[:10]` deterministic.

**Candidate vs Published:** Current `candidates 367 == published 367` because `publish()` only rejects missing fields/phrase rule (none), and `reviewed` layer empty (0 overrides). So candidate stage mirrors published as `corpus-derived-beta` — intentional per code comments `Stage 2 ... Stage 3 publish` (candidate is cleaned, published is candidate minus rejects).

**Lesson/Topic:** `apply_theme_tags` via `content/themes/keywords.json` exact normalized match; `MIN_LESSON_POOL_ITEMS 8` gates `published` vs `draft` (currently all 6 drafts <8).

No filter weakened to find more angka; that would require new evidence.

