#!/usr/bin/env node
/**
 * Automated source-evidence quality gate — versioned, deterministic.
 * Replaces human-review approval for publication.
 * Uses available upstream signals: confidence, occurrence, support, ambiguity.
 * Calibrated from full canonical corpus distributions (1.69GB, SHA 3a34a54ddbe2).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
export const QUALITY_POLICY_VERSION = "source-evidence-v2";

// Calibrated from full canonical corpus (batak_alignment_canonical.sqlite)
// Words (n=678): min=0.70, p25=0.84, median=0.89, p75=0.95
// Phrases (n=120): min=0.52, p25=0.52, median=0.65, p75=0.65
// Distinct source tables: most have 2+, best have 4-6
// Distinct source families: 0-1 (many null), best have 2+
export const THRESHOLDS = {
  word: {
    highConfidenceMinScore: 0.85,
    mediumConfidenceMinScore: 0.70,
    minCooccurrence: 1,
    minDistinctSourceTables: 2,
    minDistinctSourceFamilies: 0,  // many pairs have null family data
    maxCompetitorMargin: 0.15,
  },
  phrase: {
    highConfidenceMinScore: 0.75,
    mediumConfidenceMinScore: 0.60,
    minCooccurrence: 1,
    minDistinctSourceTables: 1,
    minDistinctSourceFamilies: 0,
    maxCompetitorMargin: 0.20,
  },
  sentence: {
    // Bible translation candidates - no source table/family data in current schema
    highConfidenceMinScore: 0.70,
    mediumConfidenceMinScore: 0.55,
    minCooccurrence: 5,
    minDistinctSourceTables: 0,
    minDistinctSourceFamilies: 0,
    maxCompetitorMargin: 0.25,
  },
};

function isHighConfidence(item) {
  return item.confidenceLabel === "high_confidence" ||
         item.confidenceLabel === "silver" ||
         (item.confidenceScore != null && item.confidenceScore >= 0.85);
}

function isMediumConfidence(item) {
  return item.confidenceLabel === "medium_confidence" ||
         item.confidenceLabel === "bronze" ||
         item.confidenceLabel === "review" ||
         (item.confidenceScore != null && item.confidenceScore >= 0.55);
}

function getConfidenceScore(item) {
  return item.confidenceScore ?? item.score ?? 0;
}

function getConfidenceLabel(item) {
  return item.confidenceLabel ?? item.label ?? "low_confidence";
}

function getCooccurrenceCount(item) {
  return item.cooccurrenceCount ?? item.sourceCount ?? item.cooccurrence_count ?? 0;
}

function getDistinctSourceTables(item) {
  return item.distinctSourceTables ?? 0;
}

function getDistinctSourceFamilies(item) {
  return item.distinctSourceFamilies ?? 0;
}

function getSourceFamilies(item) {
  const f = item.sourceFamilies;
  if (!f) return [];
  return String(f).split(",").map(s => s.trim()).filter(Boolean);
}

function checkConflict(item, allItems, maxMargin) {
  // Check if this item has competing translations with similar confidence.
  // Returns conflict info or null.
  const conflicts = [];

  // Check batak -> indonesia ambiguity (same batak, different indonesia)
  if (item.batak) {
    const competitors = allItems.filter(other =>
      other.id !== item.id &&
      normalizeLabel(other.batak) === normalizeLabel(item.batak) &&
      normalizeLabel(other.indonesia) !== normalizeLabel(item.indonesia)
    );
    for (const comp of competitors) {
      const scoreDiff = Math.abs(getConfidenceScore(item) - getConfidenceScore(comp));
      if (scoreDiff <= maxMargin) {
        conflicts.push({
          type: "batak-ambiguity",
          competitorId: comp.id,
          competitorIndonesia: comp.indonesia,
          scoreDiff: round(scoreDiff, 4),
        });
      }
    }
  }

  // Check indonesia -> batak ambiguity (same indonesia, different batak)
  if (item.indonesia) {
    const competitors = allItems.filter(other =>
      other.id !== item.id &&
      normalizeLabel(other.indonesia) === normalizeLabel(item.indonesia) &&
      normalizeLabel(other.batak) !== normalizeLabel(item.batak)
    );
    for (const comp of competitors) {
      const scoreDiff = Math.abs(getConfidenceScore(item) - getConfidenceScore(comp));
      if (scoreDiff <= maxMargin) {
        conflicts.push({
          type: "indonesia-ambiguity",
          competitorId: comp.id,
          competitorBatak: comp.batak,
          scoreDiff: round(scoreDiff, 4),
        });
      }
    }
  }

  return conflicts.length > 0 ? conflicts : null;
}

function normalizeLabel(value) {
  if (!value) return "";
  return String(value).toLowerCase().trim().replace(/\s+/g, " ");
}

function round(n, decimals = 4) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

export function qualifyWord(item, allItems = []) {
  const reasons = [];
  const blocking = [];
  const conflicts = [];
  const score = getConfidenceScore(item);
  const label = getConfidenceLabel(item);
  const cooc = getCooccurrenceCount(item);
  const distinctTables = getDistinctSourceTables(item);
  const distinctFamilies = getDistinctSourceFamilies(item);
  const sourceFamilies = getSourceFamilies(item);
  const metrics = {
    confidenceScore: score,
    confidenceLabel: label,
    cooccurrenceCount: cooc,
    distinctSourceTables: distinctTables,
    distinctSourceFamilies: distinctFamilies,
    sourceFamilies: sourceFamilies,
  };
  const t = THRESHOLDS.word;

  if (!item.batak || !item.indonesia) { blocking.push("empty form"); return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics }; }

  const isHigh = isHighConfidence(item);
  const isMedium = isMediumConfidence(item);
  const minScore = isHigh ? t.highConfidenceMinScore : t.mediumConfidenceMinScore;

  if (score < minScore) blocking.push(`confidence < ${minScore} (${isHigh ? 'high' : 'medium'})`);
  if (cooc < t.minCooccurrence) blocking.push(`cooccurrence < ${t.minCooccurrence}`);
  if (distinctTables < t.minDistinctSourceTables) blocking.push(`distinct source tables < ${t.minDistinctSourceTables}`);
  if (distinctFamilies < t.minDistinctSourceFamilies) blocking.push(`distinct source families < ${t.minDistinctSourceFamilies}`);
  if (!isHigh && !isMedium) blocking.push("label not high/medium confidence");

  if (blocking.length) return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };

  // Alternatives are normal dictionary behavior (polysemy modeled), not conflicts
  if ((item.indonesianAlternatives && item.indonesianAlternatives.length > 0) ||
      (item.batakAlternatives && item.batakAlternatives.length > 0)) {
    reasons.push("has alternatives (polysemy modeled)");
  }

  // Real conflict: competing translations with similar confidence
  if (allItems.length > 0) {
    const itemConflicts = checkConflict(item, allItems, t.maxCompetitorMargin);
    if (itemConflicts) {
      conflicts.push(...itemConflicts);
      reasons.push("competing translations within margin");
    }
  }

  const status = conflicts.length > 0 ? "source-evidence-conflicted" : "source-evidence-qualified";
  return { status, reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };
}

export function qualifyPhrase(item, allItems = []) {
  const reasons = [];
  const blocking = [];
  const conflicts = [];
  const score = getConfidenceScore(item);
  const label = getConfidenceLabel(item);
  const cooc = getCooccurrenceCount(item);
  const distinctTables = getDistinctSourceTables(item);
  const distinctFamilies = getDistinctSourceFamilies(item);
  const sourceFamilies = getSourceFamilies(item);
  const metrics = {
    confidenceScore: score,
    confidenceLabel: label,
    cooccurrenceCount: cooc,
    distinctSourceTables: distinctTables,
    distinctSourceFamilies: distinctFamilies,
    sourceFamilies: sourceFamilies,
  };
  const t = THRESHOLDS.phrase;

  if (!item.batak || !item.indonesia) { blocking.push("empty form"); return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics }; }

  // Phrase must have >=2 tokens per side
  const batakTokens = (item.batak || "").split(" ").filter(Boolean);
  const indonesiaTokens = (item.indonesia || "").split(" ").filter(Boolean);
  if (batakTokens.length < 2 || indonesiaTokens.length < 2) blocking.push("phrase fewer than 2 tokens per side");

  const isHigh = isHighConfidence(item);
  const isMedium = isMediumConfidence(item);
  const minScore = isHigh ? t.highConfidenceMinScore : t.mediumConfidenceMinScore;

  if (score < minScore) blocking.push(`confidence < ${minScore} (${isHigh ? 'high' : 'medium'})`);
  if (cooc < t.minCooccurrence) blocking.push(`cooccurrence < ${t.minCooccurrence}`);
  if (distinctTables < t.minDistinctSourceTables) blocking.push(`distinct source tables < ${t.minDistinctSourceTables}`);
  if (distinctFamilies < t.minDistinctSourceFamilies) blocking.push(`distinct source families < ${t.minDistinctSourceFamilies}`);
  if (!isHigh && !isMedium) blocking.push("label not high/medium confidence");

  if (blocking.length) return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };

  if ((item.indonesianAlternatives && item.indonesianAlternatives.length > 0) ||
      (item.batakAlternatives && item.batakAlternatives.length > 0)) {
    reasons.push("has alternatives (polysemy modeled)");
  }

  if (allItems.length > 0) {
    const itemConflicts = checkConflict(item, allItems, t.maxCompetitorMargin);
    if (itemConflicts) {
      conflicts.push(...itemConflicts);
      reasons.push("competing translations within margin");
    }
  }

  const status = conflicts.length > 0 ? "source-evidence-conflicted" : "source-evidence-qualified";
  return { status, reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };
}

export function qualifySentence(item, allItems = []) {
  const reasons = [];
  const blocking = [];
  const conflicts = [];
  const score = getConfidenceScore(item);
  const label = getConfidenceLabel(item);
  const cooc = getCooccurrenceCount(item);
  const distinctTables = getDistinctSourceTables(item);
  const distinctFamilies = getDistinctSourceFamilies(item);
  const sourceFamilies = getSourceFamilies(item);
  const metrics = {
    confidenceScore: score,
    confidenceLabel: label,
    cooccurrenceCount: cooc,
    distinctSourceTables: distinctTables,
    distinctSourceFamilies: distinctFamilies,
    sourceFamilies: sourceFamilies,
  };
  const t = THRESHOLDS.sentence;

  if (!item.batak || !item.indonesia) { blocking.push("empty form"); return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics }; }

  const isHigh = isHighConfidence(item);
  const isMedium = isMediumConfidence(item);
  const minScore = isHigh ? t.highConfidenceMinScore : t.mediumConfidenceMinScore;

  if (score < minScore) blocking.push(`confidence < ${minScore} (${isHigh ? 'high' : 'medium'})`);
  if (cooc < t.minCooccurrence) blocking.push(`cooccurrence < ${t.minCooccurrence}`);
  if (distinctTables < t.minDistinctSourceTables) blocking.push(`distinct source tables < ${t.minDistinctSourceTables}`);
  if (distinctFamilies < t.minDistinctSourceFamilies) blocking.push(`distinct source families < ${t.minDistinctSourceFamilies}`);
  if (!isHigh && !isMedium) blocking.push("label not high/medium confidence");

  if (blocking.length) return { status: "evidence-insufficient", reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };

  const status = conflicts.length > 0 ? "source-evidence-conflicted" : "source-evidence-qualified";
  return { status, reasons, blocking, conflicts, metrics, qualityPolicyVersion: QUALITY_POLICY_VERSION };
}

// CLI entry point
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (!isMain && process.argv[1]) {
  const scriptPath = process.argv[1].replace(/\\/g, '/');
  const modulePath = import.meta.url.replace('file:///', '').replace(/%20/g, ' ');
  if (scriptPath === modulePath) {}
}

if (isMain || (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')))) {
  // CLI: qualify all candidates and report counts
  const candidates = JSON.parse(readFileSync(join(root, "data/candidates/word-pairs.json"), "utf8")).items;
  const counts = { qualified: 0, insufficient: 0, conflicted: 0 };
  for (const item of candidates) {
    const res = qualifyWord(item, candidates);
    if (res.status === "source-evidence-qualified") counts.qualified++;
    else if (res.status === "evidence-insufficient") counts.insufficient++;
    else counts.conflicted++;
  }
  console.log(JSON.stringify({ qualityPolicyVersion: QUALITY_POLICY_VERSION, thresholds: THRESHOLDS, counts }, null, 2));
}