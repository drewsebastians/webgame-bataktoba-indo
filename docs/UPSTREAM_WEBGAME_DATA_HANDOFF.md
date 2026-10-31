# Webgame Browser — Upstream Data Requirements and Handoff v1

**Upstream steward:** `drewsebastians/batak-indo-alignment-engine` (private). **Consumer:** Batak Toba Play (public website). **State:** schema contract documented; a fail-closed schema/provenance adapter and isolated synthetic browser coverage are implemented on the current work branch; outward content transfer remains NOT AUTHORIZED by upstream private research policy. Do not use publication-eligible labels as evidence of authorization without independent proof.

See the comprehensive [private upstream field dictionary](https://github.com/drewsebastians/batak-indo-alignment-engine/blob/main/docs/WEBGAME_DATA_COLLECTION_CONTRACT.md) and upstream [learning item schema](https://github.com/drewsebastians/batak-indo-alignment-engine/blob/main/schemas/webgame_learning_item.schema.json). Links resolve after upstream PR merge.

## Required field groups

1. **Source**: source_id, source_family_id, publisher, canonical_url, revision/version, bbc dialect evidence, license expression, permission for private processing, **independent public-web permission**, commercial-web permission, terms evidence hash, attribution and revocation status.
2. **Learning item**: stable item_id, kind (word/phrase/sentence), original Batak Toba text, primary Indonesian meaning, accepted alternatives in both directions, distinct sense ID, POS, orthography, topic(s), defensible difficulty/learning order, context/examples reference.
3. **Quality/evidence**: source record ID/offset, source and independent family links, evidence IDs, method and version, negative/conflicting evidence, quality state, review proof only if actually reviewed, no false confidence-as-accuracy.
4. **Game selection**: independent booleans for 4-option meaning, reverse, typed, matching, sentence and flashcard/spaced-repetition eligibility; unique visible answers, safe alternative translations, minimum pool and distractor checks remain consumer-owned.
5. **Lesson metadata**: slug, Indonesian title/objective, level, order, 8–12 valid items per pilot, learning outcome and publication readiness; pilot topics `angka`, `sapaan`, `keluarga`.
6. **Lifecycle**: candidate / qualified / withheld / published / revoked, blocking reason, timestamp, public release authorization and content checksum.

## Contract-to-current-staging mapping (future adapter)

| Upstream normalized field | Existing website staging |
|---|---|
| source_id | `sourceId` in source registry, and staging `sourceId` |
| source_record_id | `records[].externalRecordId` |
| batak_text | `records[].batak` |
| indonesian_primary | `records[].indonesian` |
| item_type | consumer type validation / distinct pool |
| provenance_ref/evidence | `records[].sourceReference` and new provenance metadata adapter |
| alternatives, sense_id, topic_slugs, mode eligibility | **Adapter extensions required**; never silently drop alternatives and then present ambiguous questions |
| license/permission | `APPROVED_FOR_INGESTION` only if source-specific public-rights and project-scope gates actually allow the transfer; never infer from private research permission |

The older simple staging shape is **not** the canonical source collection schema. Do not put source text from upstream in this public Git repo merely to prove tests. For testing use visibly synthetic fixtures and test-only interception/in-memory data.

## Adapter implementation checkpoint (2026-10-31)

- `assets/js/upstream-adapter.js` validates the v1 item structure, source/evidence foreign keys, independent source-family counts, conflict rules, reviewer proof, alternatives, senses, topic mapping and per-game eligibility.
- Public release requires independently supplied public-scope and upstream-policy approval references plus source-specific public distribution, current revocation, terms, license and attribution evidence. The adapter is not wired to fetch or publish private content.
- Browser acceptance uses fabricated `SYNTHETIC_TEST_ONLY` values intercepted in Playwright. The production published endpoints and `dist` remain separate.

## Acceptance criteria

- Source data stays private by default, with `public_release_eligible=false`. The public website must stay at zero items while authorization is unresolved.
- Validate every required field group and source/record/evidence foreign key and version.
- Rights, source-family independence, language identity, quality and per-mode eligibility are distinct gates; do not collapse into a single confidence number.
- Isolate unapproved items from `data/published`, `dist`, cache, logs, screenshots and PR descriptions.
- Only after independent permission + upstream scope change: dry-run, explicit adapter mapping and preview, staging, publication, build/CI, production verification; preserve stable IDs and revocation lineage.
- Monthly source coverage report: raw, permitted-for-private, candidates, qualified, conflicted, public-eligible (normally 0), quiz-eligible per theme, 8-item shortfall, license/source blockers. Separate engineering status from content status.

Browser game development should proceed independently of these gates. Native mobile apps and audio/pronunciation are excluded from current development priority.
