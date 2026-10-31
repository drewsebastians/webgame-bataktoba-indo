/**
 * Fabricated contract record for adapter unit tests only.
 * Every label is a placeholder; this fixture carries no linguistic evidence.
 */
export function createSyntheticEnginePackage() {
  const itemId = "synthetic-item-001";
  const primarySource = {
    source_id: "synthetic-source-a",
    source_family_id: "synthetic-family-a",
    distribution_state: "RESTRICTED",
    public_web_permission: "NO",
    commercial_web_permission: "NO",
    revocation_status: "UNKNOWN",
    terms_evidence_ref: "SYNTHETIC_TEST_ONLY",
    terms_sha256: "",
    license_expression: "SYNTHETIC_TEST_ONLY",
    attribution_requirement: "SYNTHETIC_TEST_ONLY",
  };
  const corroboratingSource = {
    ...primarySource,
    source_id: "synthetic-source-b",
    source_family_id: "synthetic-family-b",
  };
  return {
    contractVersion: 1,
    fixtureStatus: "SYNTHETIC_TEST_ONLY",
    sources: [primarySource, corroboratingSource],
    evidence: [
      {
        evidence_id: "synthetic-evidence-a",
        item_id: itemId,
        source_id: primarySource.source_id,
        source_family_id: primarySource.source_family_id,
        source_record_id: "synthetic-record-a",
        method: "SYNTHETIC_TEST_ONLY",
        independent_from_prior: false,
      },
      {
        evidence_id: "synthetic-evidence-b",
        item_id: itemId,
        source_id: corroboratingSource.source_id,
        source_family_id: corroboratingSource.source_family_id,
        source_record_id: "synthetic-record-b",
        method: "SYNTHETIC_TEST_ONLY",
        independent_from_prior: true,
      },
    ],
    items: [
      {
        item_id: itemId,
        item_type: "word",
        batak_text: "SYNTHETIC_BT_001",
        indonesian_primary: "SYNTHETIC_ID_001",
        indonesian_alternatives: ["SYNTHETIC_ID_ALT_001"],
        batak_alternatives: ["SYNTHETIC_BT_ALT_001"],
        sense_id: "synthetic-sense-001",
        part_of_speech: "UNKNOWN",
        dialect_code: "und",
        orthography: "UNKNOWN",
        topic_slugs: ["angka"],
        difficulty_level: "UNKNOWN",
        learning_order: 0,
        source_id: primarySource.source_id,
        source_record_id: "synthetic-record-a",
        evidence_ids: ["synthetic-evidence-a", "synthetic-evidence-b"],
        evidence_family_count: 2,
        quality_state: "CANDIDATE",
        quality_policy_version: "SYNTHETIC_TEST_ONLY",
        conflict_reason_codes: [],
        quiz_eligible: true,
        reverse_eligible: true,
        typed_eligible: true,
        matching_eligible: true,
        sentence_eligible: false,
        review_eligible: true,
        public_release_eligible: false,
        release_block_reason: "SYNTHETIC_TEST_ONLY: no publication rights",
        lifecycle_state: "WITHHELD",
        last_checked_at_utc: "2026-10-31T00:00:00Z",
      },
    ],
  };
}
