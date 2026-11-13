import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  mapUpstreamItem,
  preparePublicRelease,
  removeRevokedDescendants,
  validateUpstreamItem,
  validateUpstreamPackage,
  WEBGAME_TOPIC_MAP,
} from "../../assets/js/upstream-adapter.js";
import { createSyntheticEnginePackage } from "../fixtures/synthetic-engine-package.mjs";

/**
 * Synthetic gate fixture only. These placeholders exercise control flow and
 * are not source rights, publication approvals, or linguistic evidence.
 */
function createSyntheticPublicationGateCandidate() {
  const payload = createSyntheticEnginePackage();
  for (const source of payload.sources) {
    Object.assign(source, {
      distribution_state: "EXPLICITLY_ALLOWED_WITH_OBLIGATIONS",
      public_web_permission: "YES",
      commercial_web_permission: "NO",
      revocation_status: "ACTIVE",
      terms_evidence_ref: "SYNTHETIC_TEST_ONLY: placeholder reference",
      terms_sha256: "a".repeat(64),
      license_expression: "SYNTHETIC_TEST_ONLY",
      attribution_requirement: "Synthetic test attribution placeholder",
    });
  }
  Object.assign(payload.items[0], {
    quality_state: "AUTOMATED_SUPPORTED",
    public_release_eligible: true,
    release_block_reason: "",
    lifecycle_state: "PUBLISHED",
  });
  return payload;
}

function addIndependentSyntheticPublicationCandidate(payload) {
  const sourceA = payload.sources.find((source) => source.source_id === "synthetic-source-a");
  const sourceC = {
    ...sourceA,
    source_id: "synthetic-source-c",
    source_family_id: "synthetic-family-c",
  };
  payload.sources.push(sourceC);

  const item = {
    ...structuredClone(payload.items[0]),
    item_id: "synthetic-item-002",
    source_record_id: "synthetic-record-a-002",
    evidence_ids: ["synthetic-evidence-a-002", "synthetic-evidence-c-002"],
    evidence_family_count: 2,
  };
  payload.items.push(item);
  payload.evidence.push(
    {
      ...payload.evidence[0],
      evidence_id: "synthetic-evidence-a-002",
      item_id: item.item_id,
      source_record_id: item.source_record_id,
    },
    {
      ...payload.evidence[1],
      evidence_id: "synthetic-evidence-c-002",
      item_id: item.item_id,
      source_id: sourceC.source_id,
      source_family_id: sourceC.source_family_id,
      source_record_id: "synthetic-record-c-002",
    },
  );
  return item.item_id;
}

const SYNTHETIC_APPROVAL_PLACEHOLDERS = {
  publicWebScopeRef: "SYNTHETIC_TEST_ONLY: placeholder scope",
  upstreamPolicyApprovalRef: "SYNTHETIC_TEST_ONLY: placeholder policy",
};

test("adapter maps alternatives, sense, topic, provenance and independent game readiness", () => {
  const payload = createSyntheticEnginePackage();
  const validation = validateUpstreamPackage(payload);
  assert.deepEqual(validation, { valid: true, errors: [] });

  const item = mapUpstreamItem(payload.items[0]);
  assert.equal(item.id, "synthetic-item-001");
  assert.deepEqual(item.indonesianAlternatives, ["SYNTHETIC_ID_ALT_001"]);
  assert.deepEqual(item.batakAlternatives, ["SYNTHETIC_BT_ALT_001"]);
  assert.equal(item.senseId, "synthetic-sense-001");
  assert.deepEqual(item.themes, ["angka"]);
  assert.equal(item.sourceId, "synthetic-source-a");
  assert.equal(item.sourceRecordId, "synthetic-record-a");
  assert.deepEqual(item.evidenceIds, ["synthetic-evidence-a", "synthetic-evidence-b"]);
  assert.equal(item.gameEligibility.meaning, true);
  assert.equal(item.gameEligibility.reverse, true);
  assert.equal(item.gameEligibility.typed, true);
  assert.equal(item.gameEligibility.matching, true);
  assert.equal(item.gameEligibility.spacedRepetition, true);
  assert.equal(item.publicReleaseEligible, false);
  assert.equal(item.lifecycleState, "WITHHELD");
});

test("topic mapping stays in parity with the public registry and rejects unknown slugs", () => {
  const registry = JSON.parse(readFileSync(
    new URL("../../data/published/topics.json", import.meta.url),
    "utf8",
  ));
  const slugs = registry.topics.map((topic) => topic.slug).sort();
  assert.deepEqual(Object.keys(WEBGAME_TOPIC_MAP).sort(), slugs);
  for (const slug of slugs) assert.equal(WEBGAME_TOPIC_MAP[slug], slug);

  const item = {
    ...createSyntheticEnginePackage().items[0],
    topic_slugs: ["unregistered-topic"],
  };
  assert.ok(validateUpstreamItem(item).errors.includes("topic:unmapped"));
  assert.throws(() => mapUpstreamItem(item), /topic:unmapped/);
});

test("adapter preserves context and source-relevant language metadata", () => {
  const payload = createSyntheticEnginePackage();
  Object.assign(payload.items[0], {
    part_of_speech: "SYNTHETIC_TEST_ONLY_NOUN",
    orthography: "SYNTHETIC_TEST_ONLY_STANDARD",
    example_usage_ref: "synthetic-evidence-a",
    context_note: "SYNTHETIC_TEST_ONLY: contextual note",
  });

  const item = mapUpstreamItem(payload.items[0]);
  assert.equal(item.partOfSpeech, "SYNTHETIC_TEST_ONLY_NOUN");
  assert.equal(item.orthography, "SYNTHETIC_TEST_ONLY_STANDARD");
  assert.equal(item.exampleUsageRef, "synthetic-evidence-a");
  assert.equal(item.contextNote, "SYNTHETIC_TEST_ONLY: contextual note");
});

test("optional contextual mapping fields stay empty when upstream omits them", () => {
  const item = mapUpstreamItem(createSyntheticEnginePackage().items[0]);
  assert.equal(item.exampleUsageRef, null);
  assert.equal(item.contextNote, null);
});

test("schema validation rejects unknown fields, invalid enums and conflicting eligibility", () => {
  const payload = createSyntheticEnginePackage();
  const withUnknown = { ...payload.items[0], raw_source_text: "never accepted" };
  assert.equal(validateUpstreamItem(withUnknown).valid, false);

  const withUnknownDialect = { ...payload.items[0], dialect_code: "toba-guessed" };
  assert.equal(validateUpstreamItem(withUnknownDialect).valid, false);

  const conflict = {
    ...payload.items[0],
    quality_state: "CONFLICTED",
    quiz_eligible: true,
  };
  assert.ok(validateUpstreamItem(conflict).errors.includes("conflict:game_eligibility"));
});

test("package validation catches missing foreign keys and family-count mismatches", () => {
  const payload = createSyntheticEnginePackage();
  payload.items[0].evidence_ids[0] = "missing-evidence";
  assert.ok(validateUpstreamPackage(payload).errors.includes("item:unknown_evidence"));

  const familyMismatch = createSyntheticEnginePackage();
  familyMismatch.items[0].evidence_family_count = 1;
  assert.ok(validateUpstreamPackage(familyMismatch).errors.includes("item:evidence_family_count_mismatch"));
});

test("automated support requires two independent source families", () => {
  const payload = createSyntheticEnginePackage();
  payload.items[0].quality_state = "AUTOMATED_SUPPORTED";
  payload.items[0].evidence_family_count = 1;
  payload.evidence = [payload.evidence[0]];
  payload.items[0].evidence_ids = [payload.evidence[0].evidence_id];
  assert.ok(validateUpstreamPackage(payload).errors.includes("quality:insufficient_independent_families"));
});

test("human-reviewed state needs reviewer evidence rather than a quality label alone", () => {
  const payload = createSyntheticEnginePackage();
  payload.items[0].quality_state = "HUMAN_REVIEWED";
  assert.ok(validateUpstreamPackage(payload).errors.includes("quality:human_review_proof_missing"));
});


test("publication rejects unknown rights and missing rights evidence after scope gates", () => {
  const unresolvedCases = [
    ["distribution state", (source) => { source.distribution_state = "UNKNOWN"; }],
    ["public permission", (source) => { source.public_web_permission = "UNKNOWN"; }],
    ["revocation state", (source) => { source.revocation_status = "UNKNOWN"; }],
    ["terms reference", (source) => { source.terms_evidence_ref = ""; }],
    ["terms hash", (source) => { source.terms_sha256 = ""; }],
    ["license expression", (source) => { source.license_expression = ""; }],
    ["attribution", (source) => { source.attribution_requirement = "UNKNOWN"; }],
  ];

  for (const [label, makeUnresolved] of unresolvedCases) {
    const payload = createSyntheticPublicationGateCandidate();
    makeUnresolved(payload.sources[0]);
    assert.deepEqual(validateUpstreamPackage(payload), { valid: true, errors: [] }, label);
    assert.throws(
      () => preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS),
      /SOURCE_RIGHTS_OR_PROVENANCE_NOT_CLEARED/,
      label,
    );
  }
});

test("commercial permission is a separate optional release gate", () => {
  const payload = createSyntheticPublicationGateCandidate();
  assert.deepEqual(validateUpstreamPackage(payload), { valid: true, errors: [] });
  assert.throws(
    () => preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS, {
      requireCommercialPermission: true,
    }),
    /SOURCE_RIGHTS_OR_PROVENANCE_NOT_CLEARED/,
  );
});

test("publication rejects primary evidence without a matching source record", () => {
  const payload = createSyntheticPublicationGateCandidate();
  payload.items[0].source_record_id = "untraced-record";
  const validation = validateUpstreamPackage(payload);
  assert.ok(validation.errors.includes("item:primary_provenance_missing"));
  assert.throws(
    () => preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS),
    /INVALID_UPSTREAM_PACKAGE:item:primary_provenance_missing/,
  );
});

test("publication requires a mapped topic even when the remaining rights fixture is valid", () => {
  const payload = createSyntheticPublicationGateCandidate();
  payload.items[0].topic_slugs = [];
  assert.deepEqual(validateUpstreamPackage(payload), { valid: true, errors: [] });
  assert.throws(
    () => preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS),
    /ITEM_TOPIC_MAPPING_REQUIRED/,
  );
});

test("conflicted records cannot be published even when all game modes are withheld", () => {
  const payload = createSyntheticPublicationGateCandidate();
  Object.assign(payload.items[0], {
    quality_state: "CONFLICTED",
    quiz_eligible: false,
    reverse_eligible: false,
    typed_eligible: false,
    matching_eligible: false,
    sentence_eligible: false,
    review_eligible: false,
  });
  assert.deepEqual(validateUpstreamPackage(payload), { valid: true, errors: [] });
  assert.throws(
    () => preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS),
    /ITEM_NOT_PUBLICATION_READY/,
  );
});

test("mode eligibility maps independently instead of being inferred from another mode", () => {
  const payload = createSyntheticEnginePackage();
  payload.items[0].matching_eligible = false;
  payload.items[0].typed_eligible = false;
  const item = mapUpstreamItem(payload.items[0]);

  assert.equal(item.gameEligibility.meaning, true);
  assert.equal(item.gameEligibility.reverse, true);
  assert.equal(item.gameEligibility.matching, false);
  assert.equal(item.gameEligibility.typed, false);
  assert.equal(item.gameEligibility.spacedRepetition, true);
});

test("publication hard-fails without both scope approvals or cleared source rights", () => {
  const payload = createSyntheticEnginePackage();
  assert.throws(() => preparePublicRelease(payload), /PUBLICATION_AUTHORIZATION_REQUIRED/);
  assert.throws(() => preparePublicRelease(payload, {
    publicWebScopeRef: "SYNTHETIC_TEST_ONLY",
    upstreamPolicyApprovalRef: "SYNTHETIC_TEST_ONLY",
  }), /ITEM_NOT_PUBLICATION_READY/);
});

test("revoked source records remove their item and evidence descendants without mutating input", () => {
  const payload = createSyntheticPublicationGateCandidate();
  const sourceB = payload.sources.find((source) => source.source_id === "synthetic-source-b");
  sourceB.revocation_status = "REVOKED";
  addIndependentSyntheticPublicationCandidate(payload);
  const original = structuredClone(payload);

  const retained = removeRevokedDescendants(payload);

  assert.deepEqual(retained.items.map((item) => item.item_id), ["synthetic-item-002"]);
  assert.deepEqual(retained.sources.map((source) => source.source_id), ["synthetic-source-a", "synthetic-source-c"]);
  assert.deepEqual(retained.evidence.map((entry) => entry.evidence_id), [
    "synthetic-evidence-a-002",
    "synthetic-evidence-c-002",
  ]);
  assert.deepEqual(validateUpstreamPackage(retained), { valid: true, errors: [] });
  assert.deepEqual(payload, original);
});

test("public release omits descendants of a revoked evidence source and retains unrelated items", () => {
  const payload = createSyntheticPublicationGateCandidate();
  payload.sources.find((source) => source.source_id === "synthetic-source-b").revocation_status = "REVOKED";
  addIndependentSyntheticPublicationCandidate(payload);

  const released = preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS);

  assert.deepEqual(released.map((item) => item.id), ["synthetic-item-002"]);
  assert.equal(released.some((item) => item.sourceId === "synthetic-source-b"), false);
});

test("public release omits a candidate whose primary source is revoked", () => {
  const payload = createSyntheticPublicationGateCandidate();
  payload.sources.find((source) => source.source_id === "synthetic-source-a").revocation_status = "REVOKED";

  const released = preparePublicRelease(payload, SYNTHETIC_APPROVAL_PLACEHOLDERS);

  assert.deepEqual(released, []);
});
