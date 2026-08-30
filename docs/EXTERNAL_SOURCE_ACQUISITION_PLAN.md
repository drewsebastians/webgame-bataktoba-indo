# External Source Acquisition Plan — Batak Toba Play

**Status:** `CORPUS_EXHAUSTED = YES` for `angka` 5→8 with current DB; need 3 source-backed.

## Source Categories (evaluate per SOURCE_ACCEPTANCE_POLICY)
|Category|Value|Licensing|Redist|Citation|Machine-readable|Words|Phrases|Sentences|Audio|
|---|---|---|---|---|---|---|---|---|---|
|Openly licensed Batak Toba dictionaries (e.g., CC-BY)|High|CC-BY requires attribution, allow commercial/derivative|Yes with attribution|SourceId + URL + license|Often PDF/JSON|Yes|Maybe|No|Rare|
|Public-domain grammars (pre-1929)|Medium|Public domain|Yes|Bibliographic|Scan/OCR|Yes|No|No|No|
|Open parallel corpora (e.g., OPUS)|Medium|Check per corpus|Varies|URL + checksum|CONLL/TSV|Yes|Yes|Yes|No|
|Licensed Bible/text corpora (held)|Current|UNKNOWN — requires legal|UNKNOWN|Bible verse_key|DB|Yes|No|Yes|No|
|Educational material with permission|High|Explicit permission|Per agreement|Letter + URL|PDF|Yes|Yes|Maybe|Maybe|
|Contributor-supplied reviewer material|Fastest if reviewer qualified|Explicit contributor license (CL A)|Yes if granted|Reviewer ID + date + permission|CSV/JSON|Yes|Yes|Maybe|Maybe|
|Institutional resources (university)|High|Requires agreement|No until approved|Institution + contact|Varies|Yes|Yes|Yes|Maybe|

**Do not name source legally usable unless evidence in `source-registry.json` is APPROVED.**

## Next Steps for angka
1. Try **Strategy B** first: qualified speaker supplies 3 numerals `sada/duа…` with explicit permission (fastest, see `REVIEWER_ORIGINATED_CONTENT_POLICY.md`).
2. In parallel, evaluate openly licensed dictionary (Strategy A) for reusable numerals + broader lexicon.
3. Ingest via staging format `data/sources/staging/<sourceId>.json` (see `SOURCE_INGESTION_CONTRACT.md`) → `source:validate` → `source:preview` → candidate → review → publish.

**Licensing unresolved for current Bible corpus — see `CORPUS_LICENSING_STATUS.md`.**
