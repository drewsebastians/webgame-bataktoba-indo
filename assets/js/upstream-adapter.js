/**
 * Fail-closed bridge from the private Alignment Engine contract to the
 * website's legacy learning-item shape. This module never fetches a source.
 * Keep it out of publication workflows until public scope and rights are
 * independently authorized.
 */

const REQUIRED_ITEM_FIELDS = [
  "item_id", "item_type", "batak_text", "indonesian_primary", "sense_id",
  "source_id", "source_record_id", "evidence_ids", "dialect_code",
  "topic_slugs", "quality_state", "quiz_eligible", "reverse_eligible",
  "typed_eligible", "matching_eligible", "sentence_eligible",
  "review_eligible", "public_release_eligible", "release_block_reason",
  "lifecycle_state",
];

const ALLOWED_ITEM_FIELDS = new Set([
  ...REQUIRED_ITEM_FIELDS, "indonesian_alternatives", "batak_alternatives",
  "part_of_speech", "orthography", "difficulty_level", "learning_order",
  "example_usage_ref", "context_note", "evidence_family_count",
  "quality_policy_version", "conflict_reason_codes", "last_checked_at_utc",
]);

const QUALITY_STATES = new Set([
  "UNCHECKED", "CANDIDATE", "AUTOMATED_SUPPORTED", "CONFLICTED",
  "REJECTED", "HUMAN_REVIEWED",
]);
const LIFECYCLE_STATES = new Set([
  "RAW", "CANDIDATE", "QUALIFIED", "WITHHELD", "PUBLISHED", "REVOKED",
]);
const MODES = [
  "quiz_eligible", "reverse_eligible", "typed_eligible",
  "matching_eligible", "sentence_eligible", "review_eligible",
];
const DISTRIBUTION_STATES = new Set([
  "EXPLICITLY_ALLOWED_WITH_OBLIGATIONS", "RESTRICTED", "UNKNOWN", "PROHIBITED",
]);
const PERMISSIONS = new Set(["YES", "NO", "UNKNOWN"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function uniqueStringArray(value) {
  return Array.isArray(value) &&
    value.every(nonEmptyString) &&
    new Set(value).size === value.length;
}

/** Structural validation for the published engine schema v1 item shape. */
export function validateUpstreamItem(item) {
  const errors = [];
  if (!isObject(item)) return { valid: false, errors: ["item must be an object"] };

  for (const field of REQUIRED_ITEM_FIELDS) {
    if (!(field in item)) errors.push(`missing:${field}`);
  }
  for (const field of Object.keys(item)) {
    if (!ALLOWED_ITEM_FIELDS.has(field)) errors.push(`unknown:${field}`);
  }

  if (typeof item.item_id !== "string" || !/^[a-z0-9][a-z0-9._-]{2,}$/.test(item.item_id)) {
    errors.push("invalid:item_id");
  }
  if (!["word", "phrase", "sentence"].includes(item.item_type)) errors.push("invalid:item_type");
  for (const field of ["batak_text", "indonesian_primary", "sense_id", "source_id", "source_record_id", "release_block_reason"]) {
    if (typeof item[field] !== "string") errors.push(`invalid:${field}`);
    else if (field !== "release_block_reason" && !nonEmptyString(item[field])) errors.push(`empty:${field}`);
  }
  if (!["bbc", "btk", "und"].includes(item.dialect_code)) errors.push("invalid:dialect_code");
  if (!Array.isArray(item.evidence_ids) || !uniqueStringArray(item.evidence_ids)) errors.push("invalid:evidence_ids");
  if (!Array.isArray(item.topic_slugs) || !uniqueStringArray(item.topic_slugs)) errors.push("invalid:topic_slugs");
  for (const field of ["indonesian_alternatives", "batak_alternatives", "conflict_reason_codes"]) {
    if (field in item && (!Array.isArray(item[field]) || !uniqueStringArray(item[field]))) {
      errors.push(`invalid:${field}`);
    }
  }
  if (!QUALITY_STATES.has(item.quality_state)) errors.push("invalid:quality_state");
  if (!LIFECYCLE_STATES.has(item.lifecycle_state)) errors.push("invalid:lifecycle_state");
  for (const field of MODES.concat("public_release_eligible")) {
    if (typeof item[field] !== "boolean") errors.push(`invalid:${field}`);
  }
  if ("evidence_family_count" in item &&
      (!Number.isInteger(item.evidence_family_count) || item.evidence_family_count < 0)) {
    errors.push("invalid:evidence_family_count");
  }
  if ("difficulty_level" in item &&
      !(item.difficulty_level === "UNKNOWN" ||
        (Number.isInteger(item.difficulty_level) && item.difficulty_level >= 1 && item.difficulty_level <= 3))) {
    errors.push("invalid:difficulty_level");
  }
  if ("learning_order" in item && (!Number.isInteger(item.learning_order) || item.learning_order < 0)) {
    errors.push("invalid:learning_order");
  }
  for (const field of ["part_of_speech", "orthography", "example_usage_ref", "context_note", "quality_policy_version", "last_checked_at_utc"]) {
    if (field in item && typeof item[field] !== "string") errors.push(`invalid:${field}`);
  }

  if (["CONFLICTED", "REJECTED"].includes(item.quality_state) &&
      MODES.some((field) => item[field] === true)) {
    errors.push("conflict:game_eligibility");
  }
  if (item.public_release_eligible === false && !nonEmptyString(item.release_block_reason)) {
    errors.push("rights:missing_release_block_reason");
  }
  if (item.public_release_eligible === true &&
      (item.lifecycle_state !== "PUBLISHED" || nonEmptyString(item.release_block_reason))) {
    errors.push("rights:published_state_inconsistent");
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Map one structurally valid record. Mapping alone does not authorize the
 * returned text for a website, runtime, build artifact, or public transfer.
 */
export function mapUpstreamItem(item) {
  const result = validateUpstreamItem(item);
  if (!result.valid) throw new Error(`INVALID_UPSTREAM_ITEM:${result.errors.join(",")}`);
  return {
    id: item.item_id,
    type: item.item_type,
    batak: item.batak_text,
    indonesia: item.indonesian_primary,
    indonesianAlternatives: [...(item.indonesian_alternatives ?? [])],
    batakAlternatives: [...(item.batak_alternatives ?? [])],
    senseId: item.sense_id,
    themes: [...item.topic_slugs],
    difficulty: item.difficulty_level === "UNKNOWN" ? null : (item.difficulty_level ?? null),
    learningOrder: item.learning_order ?? null,
    partOfSpeech: item.part_of_speech ?? null,
    orthography: item.orthography ?? null,
    exampleUsageRef: item.example_usage_ref ?? null,
    contextNote: item.context_note ?? null,
    dialectCode: item.dialect_code,
    qualityState: item.quality_state,
    quality: item.quality_state.toLowerCase().replaceAll("_", "-"),
    reviewStatus: item.quality_state.toLowerCase().replaceAll("_", "-"),
    sourceType: "alignment-engine",
    sourceId: item.source_id,
    sourceRecordId: item.source_record_id,
    evidenceIds: [...item.evidence_ids],
    evidenceFamilyCount: item.evidence_family_count ?? null,
    gameEligibility: {
      meaning: item.quiz_eligible,
      reverse: item.reverse_eligible,
      typed: item.typed_eligible,
      matching: item.matching_eligible,
      sentence: item.sentence_eligible,
      spacedRepetition: item.review_eligible,
    },
    publicReleaseEligible: item.public_release_eligible,
    releaseBlockReason: item.release_block_reason,
    lifecycleState: item.lifecycle_state,
  };
}

function validatePackage(payload) {
  const errors = [];
  if (!isObject(payload) || payload.contractVersion !== 1) {
    return { valid: false, errors: ["contractVersion must be 1"] };
  }
  if (!Array.isArray(payload.sources) || !Array.isArray(payload.evidence) || !Array.isArray(payload.items)) {
    return { valid: false, errors: ["sources, evidence, and items must be arrays"] };
  }

  const sources = new Map();
  for (const source of payload.sources) {
    if (!isObject(source) || !nonEmptyString(source.source_id) ||
        !nonEmptyString(source.source_family_id)) {
      errors.push("source:missing_identity");
      continue;
    }
    if (sources.has(source.source_id)) errors.push("source:duplicate_id");
    sources.set(source.source_id, source);
    if (!DISTRIBUTION_STATES.has(source.distribution_state)) errors.push("source:invalid_distribution_state");
    if (!PERMISSIONS.has(source.public_web_permission)) errors.push("source:invalid_public_permission");
    if (!PERMISSIONS.has(source.commercial_web_permission)) errors.push("source:invalid_commercial_permission");
    if (!["ACTIVE", "REVOKED", "UNKNOWN"].includes(source.revocation_status)) errors.push("source:invalid_revocation_status");
  }

  const items = new Map();
  for (const item of payload.items) {
    const checked = validateUpstreamItem(item);
    errors.push(...checked.errors.map((error) => `item:${error}`));
    if (!isObject(item) || !nonEmptyString(item.item_id)) continue;
    if (items.has(item.item_id)) errors.push("item:duplicate_id");
    items.set(item.item_id, item);
  }

  const evidenceById = new Map();
  for (const evidence of payload.evidence) {
    if (!isObject(evidence) ||
        !["evidence_id", "item_id", "source_id", "source_family_id", "source_record_id"].every((key) => nonEmptyString(evidence[key]))) {
      errors.push("evidence:missing_provenance");
      continue;
    }
    if (evidenceById.has(evidence.evidence_id)) errors.push("evidence:duplicate_id");
    evidenceById.set(evidence.evidence_id, evidence);
    const item = items.get(evidence.item_id);
    const source = sources.get(evidence.source_id);
    if (!item) errors.push("evidence:unknown_item");
    if (!source) errors.push("evidence:unknown_source");
    else if (source.source_family_id !== evidence.source_family_id) errors.push("evidence:family_mismatch");
    if (typeof evidence.independent_from_prior !== "boolean") errors.push("evidence:independence_missing");
  }

  for (const item of items.values()) {
    const primarySource = sources.get(item.source_id);
    if (!primarySource) errors.push("item:unknown_source");
    const links = (item.evidence_ids ?? []).map((id) => evidenceById.get(id)).filter(Boolean);
    if (links.length !== (item.evidence_ids ?? []).length) errors.push("item:unknown_evidence");
    if (links.some((link) => link.item_id !== item.item_id)) errors.push("item:evidence_item_mismatch");
    if (primarySource && !links.some((link) =>
      link.source_id === item.source_id && link.source_record_id === item.source_record_id)) {
      errors.push("item:primary_provenance_missing");
    }
    const families = new Set(links.map((link) => link.source_family_id));
    if (!Number.isInteger(item.evidence_family_count) ||
        item.evidence_family_count !== families.size) {
      errors.push("item:evidence_family_count_mismatch");
    }
    for (const link of links) {
      const source = sources.get(link.source_id);
      if (source && link.source_family_id !== primarySource?.source_family_id &&
          link.independent_from_prior !== true) {
        errors.push("item:independent_family_unproven");
      }
    }
    if (item.quality_state === "AUTOMATED_SUPPORTED" && families.size < 2) {
      errors.push("quality:insufficient_independent_families");
    }
    if (item.quality_state === "HUMAN_REVIEWED" &&
        !links.some((link) => link.method === "human_review" && nonEmptyString(link.reviewer_ref))) {
      errors.push("quality:human_review_proof_missing");
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Only emit mapped records after two independent scope references and every
 * source/evidence rights gate pass. References must point to actual approvals;
 * this function does not discover or infer approval.
 */
export function preparePublicRelease(payload, authorization = {}, { requireCommercialPermission = false } = {}) {
  if (!nonEmptyString(authorization.publicWebScopeRef) ||
      !nonEmptyString(authorization.upstreamPolicyApprovalRef)) {
    throw new Error("PUBLICATION_AUTHORIZATION_REQUIRED");
  }
  const checked = validatePackage(payload);
  if (!checked.valid) throw new Error(`INVALID_UPSTREAM_PACKAGE:${checked.errors.join(",")}`);

  const sources = new Map(payload.sources.map((source) => [source.source_id, source]));
  const evidence = new Map(payload.evidence.map((entry) => [entry.evidence_id, entry]));
  const out = [];
  for (const item of payload.items) {
    if (item.public_release_eligible !== true ||
        item.lifecycle_state !== "PUBLISHED" ||
        !["AUTOMATED_SUPPORTED", "HUMAN_REVIEWED"].includes(item.quality_state) ||
        nonEmptyString(item.release_block_reason)) {
      throw new Error("ITEM_NOT_PUBLICATION_READY");
    }
    const relatedSourceIds = new Set([
      item.source_id,
      ...item.evidence_ids.map((id) => evidence.get(id)?.source_id).filter(Boolean),
    ]);
    for (const sourceId of relatedSourceIds) {
      const source = sources.get(sourceId);
      if (!source ||
          source.distribution_state !== "EXPLICITLY_ALLOWED_WITH_OBLIGATIONS" ||
          source.public_web_permission !== "YES" ||
          source.revocation_status !== "ACTIVE" ||
          (requireCommercialPermission && source.commercial_web_permission !== "YES") ||
          !nonEmptyString(source.terms_evidence_ref) ||
          !/^[a-f0-9]{64}$/i.test(source.terms_sha256 ?? "") ||
          !nonEmptyString(source.license_expression) ||
          !nonEmptyString(source.attribution_requirement) ||
          (source.attribution_requirement === "UNKNOWN" || source.attribution_requirement.startsWith("SYNTHETIC_"))) {
        throw new Error("SOURCE_RIGHTS_OR_PROVENANCE_NOT_CLEARED");
      }
    }
    out.push(mapUpstreamItem(item));
  }
  return out;
}

export function validateUpstreamPackage(payload) {
  const result = validatePackage(payload);
  return { valid: result.valid, errors: result.errors };
}
