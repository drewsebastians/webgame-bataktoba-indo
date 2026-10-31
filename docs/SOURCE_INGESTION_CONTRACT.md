# Source Ingestion Contract — Batak Toba Play (consumer-side v2)

**Active reference:** [Upstream webgame data handoff](UPSTREAM_WEBGAME_DATA_HANDOFF.md) and [browser product plan](ACTIVE_BROWSER_PRODUCT_PLAN_2026-10-31.md). This document specifies the existing **consumer** staging bridge, **not** authorization to copy from private upstream. No mandatory human linguistic review gate; automated evidence qualification is distinct from source and release rights.

## Existing staging shape

```json
{
  "sourceId": "synthetic-fixture-source",
  "licenseStatus": "REQUIRES_LEGAL_REVIEW",
  "records": [
    {
      "externalRecordId": "example-only-001",
      "batak": "SYNTHETIC_NOT_A_REAL_BATAK_WORD",
      "indonesian": "CONTOH BUKAN TERJEMAHAN",
      "sourceReference": "test fixture only",
      "sourceType": "synthetic-test",
      "notes": "Never ingest/publish"
    }
  ]
}
```

**This example is intentionally not publishable.** Current actual staging may not accept every new upstream column; an explicit adapter and schema tests are required. The upstream private repository will administer `source_id/source_family_id/rights/record/evidence/sense/alternatives/topic/mode_eligibility` in [the field dictionary](UPSTREAM_WEBGAME_DATA_HANDOFF.md).

## Invariant gates

1. No source may be transferred from the upstream **private-only/noncommercial** research vault to this **public** repository/Pages without separately documented permission for public redistribution/use and an explicit authorized scope change upstream.
2. Per-record quality, linguistic dialect (`bbc`), ambiguous alternatives, source independence, type and theme are independently validated. No synthetic fixtures in `data/published` or deployed `dist`.
3. Existing staging uses `sourceId, externalRecordId, batak, indonesian`; map richer fields explicitly rather than losing senses, accepted alternatives, conflicts or rights metadata.
4. Never auto-publish blocked or unknown-rights records, or grant `APPROVED_FOR_INGESTION` from private access alone. Preserve stable item IDs and revocation links.
5. `source:validate` -> `source:preview` -> `source:import --apply` -> `content:publish` -> `verify:release` apply **only after** legal and project-scope gates pass. Execute tests with isolated synthetic fixtures in the meantime.

Development work on browser UI/engine/testing proceeds in parallel with source gathering. Maintain public-safe 0 content until actual authorization and a validated adapter are demonstrated.
