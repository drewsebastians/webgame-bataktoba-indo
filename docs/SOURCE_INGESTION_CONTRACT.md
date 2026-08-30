# Source Ingestion Contract — Batak Toba Play

**Staging format** `data/sources/staging/<sourceId>.json`:
```json
{
  "sourceId": "kbbi-batak-toba-2024",
  "licenseStatus": "APPROVED_FOR_INGESTION",
  "records": [
    {
      "externalRecordId": "kbbi-123",
      "batak": "sada",
      "indonesian": "satu",
      "sourceReference": "KBBI Batak Toba p.12",
      "sourceType": "human-curated",
      "notes": null
    }
  ]
}
```

**Requirements:**
- Ingestion ≠ publication; records → `raw/candidate` → stable IDs `hash(batak+indonesian)` → `source-registry.json` preserved
- Duplicates detected via `normalize_label` (existing `batak`/`indonesia` uniqueness) → merged to `alternatives` or rejected
- Conflicts (same `batak` different `indonesia` and vice versa) → human review, not silent overwrite
- Human review still required unless `licenseStatus` + `human-reviewed` already
- Source removal traceable via `sourceId` → which `items`/`lessons`/`topics` depend → withdraw + archive stable IDs

**Commands:**
- `npm run source:validate -- <file>` (schema, licenseStatus, duplicates)
- `npm run source:preview -- <file>` (counts, topics affected, lesson gap delta, no write)
- `npm run source:import -- <file> --apply` (requires validated, deterministic, never `human-reviewed` auto)
