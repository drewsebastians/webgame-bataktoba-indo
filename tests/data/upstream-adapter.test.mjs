import test from "node:test";
import assert from "node:assert/strict";
import {
  mapUpstreamItem,
  preparePublicRelease,
  validateUpstreamItem,
  validateUpstreamPackage,
} from "../../assets/js/upstream-adapter.js";
import { createSyntheticEnginePackage } from "../fixtures/synthetic-engine-package.mjs";

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
  assert.deepEqual(item.provenance, undefined);
  assert.deepEqual(item.evidenceIds, ["synthetic-evidence-a", "synthetic-evidence-b"]);
  assert.equal(item.gameEligibility.meaning, true);
  assert.equal(item.gameEligibility.reverse, true);
  assert.equal(item.gameEligibility.typed, true);
  assert.equal(item.gameEligibility.matching, true);
  assert.equal(item.gameEligibility.spacedRepetition, true);
  assert.equal(item.publicReleaseEligible, false);
  assert.equal(item.lifecycleState, "WITHHELD");
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

test("publication hard-fails without both scope approvals or cleared source rights", () => {
  const payload = createSyntheticEnginePackage();
  assert.throws(() => preparePublicRelease(payload), /PUBLICATION_AUTHORIZATION_REQUIRED/);
  assert.throws(() => preparePublicRelease(payload, {
    publicWebScopeRef: "SYNTHETIC_TEST_ONLY",
    upstreamPolicyApprovalRef: "SYNTHETIC_TEST_ONLY",
  }), /ITEM_NOT_PUBLICATION_READY/);
});
