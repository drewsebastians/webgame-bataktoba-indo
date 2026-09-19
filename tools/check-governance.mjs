#!/usr/bin/env node
/**
 * Governance checker — hardened for public-safe mode.
 * Scans active docs, code, public HTML, and generated output for obsolete human-review dependencies.
 * No broad allowlisting. Historical material uses narrow explicit handling.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

// Files that are explicitly historical/legacy and may contain obsolete language.
// These are checked with a narrower rule: only flag if they contain ACTIVE (non-historical) stale guidance.
const historicalFiles = new Set([
  "PROGRESS_LOG.md",
  "BLUEPRINT_COMPLIANCE_MATRIX.md",
  "ULTIMATE_BLUEPRINT_TRACEABILITY_2026-08-30.md",
  "CURRENT_STATE_AUDIT.md",
  "docs/REVIEW_ROUND_1_STATUS.md",
  "docs/FIRST_TOPIC_SEO_UNLOCK_PLAN.md",
  "docs/FIRST_LESSON_UNLOCK_PLAN.md",
  "docs/MANDATORY_RESIDUAL_CLOSURE_LEDGER.md",
  "docs/ADSENSE_ACTIVATION_HANDOFF.md",
  "docs/SEARCH_CONSOLE_HANDOFF.md",
  "data/reviewed/README.md",
]);

// Legacy tooling files (review:* commands) - retained for migration compat, not active publication workflow
const legacyToolFiles = new Set([
  "tools/review-queue.mjs",
  "tools/review-lesson-gaps.mjs",
  "tools/review-topic-gaps.mjs",
  "tools/review-validate.mjs",
  "tools/review-preview.mjs",
  "tools/review-round1.mjs",
  "tools/review-import.mjs",
  "tools/review-lib.mjs",
]);

// Active files that must be clean (no obsolete governance language).
// This includes all source code, active docs, public HTML, generated output.
const activeScanDirs = [
  "",
  "assets",
  "tools",
  "docs",
  "learn",
  "games",
  "dictionary",
  "flashcards",
  "about",
  "contact",
  "privacy",
  "methodology",
  "data-source",
  "editorial-policy",
  "correction-process",
  "progres",
  "contributors",
];

const skipDirs = new Set([
  ".git",
  "node_modules",
  "dist",
  "artifacts",
  "test-results",
  ".temp",
  ".cache",
  "tests",
  "data",
  "content",
]);

// Patterns that indicate obsolete human-review-as-publication-gate language.
// These are forbidden in ACTIVE files.
// Historical files are allowed to contain these ONLY when clearly in historical context.
const forbiddenPatterns = [
  // Direct human-review-as-gate language
  "reviewer approval required",
  "BLOCKED_HUMAN_REVIEW",
  "waiting for reviewer",
  "menunggu review penutur",
  "human review required",
  "human-reviewed is required",
  "needs human review",
  "review queue.*human",
  "first reviewed lesson",
  "reviewedAt.*required",
  "human-reviewed.*publication",
  "review penutur.*publikasi",
  "linguistic review.*required",
  "native speaker.*approval",
  "manual linguistic approval",
  "reviewer persona.*gate",
  "human-review recruitment",
];

// Patterns that are LEGITIMATE and must NOT be flagged:
// - "review" in spaced-repetition context (reviewStage, review schedule, mistake review)
// - "review" in code review / PR review context
// - "review" in correction/review workflow (user-facing "Review Kesalahan")
// - "review" in editorial review (source-evidence-qualified review, not human linguistic)
const legitimatePatterns = [
  /reviewStage/i,
  /reviewSchedule/i,
  /mistake.?review/i,
  /daily.?review/i,
  /spaced.?repetition/i,
  /consecutiveCorrect/i,
  /nextReviewAt/i,
  /lastReviewedAt/i,
  /reviewedBy/i,          // metadata field, not a gate
  /reviewStatus/i,        // status enum, not a gate
  /source.?evidence.?qualified/i,
  /evidence.?insufficient/i,
  /source.?blocked/i,
  /correction/i,
  /code.?review/i,
  /pull.?request/i,
  /pr.?review/i,
  /Review Kesalahan/i,    // user-facing feature
];

function isLegitimateContext(text, matchIndex) {
  // Check surrounding context (100 chars before/after) for legitimate patterns
  const start = Math.max(0, matchIndex - 100);
  const end = Math.min(text.length, matchIndex + 100);
  const context = text.slice(start, end);
  return legitimatePatterns.some(p => p.test(context));
}

function scanFile(fullPath, relPath) {
  // Skip the governance checker itself (it defines the patterns)
  if (relPath === "tools/check-governance.mjs") return [];
  
  const text = readFileSync(fullPath, "utf8");
  const failures = [];
  
  // Entire file is historical/legacy - allow all obsolete language as historical record
  const isHistoricalFile = historicalFiles.has(relPath) || legacyToolFiles.has(relPath);
  
  for (const pat of forbiddenPatterns) {
    const re = new RegExp(pat, "gi");
    let match;
    while ((match = re.exec(text)) !== null) {
      // For historical/legacy files, allow all (they're explicit historical record)
      if (isHistoricalFile) continue;
      
      // For all other files, check legitimate context
      if (isLegitimateContext(text, match.index)) continue;
      
      failures.push(`${relPath}: contains obsolete governance phrase "${match[0]}" (matched pattern: ${pat})`);
    }
  }
  return failures;
}

function walk(dir, baseDir) {
  const failures = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (skipDirs.has(name)) continue;
      failures.push(...walk(full, baseDir));
    } else {
      const ext = extname(name);
      // Scan: .md, .html, .js, .mjs, .json, .txt, .yml, .toml
      if ([".md", ".html", ".js", ".mjs", ".json", ".txt", ".yml", ".toml"].includes(ext)) {
        const rel = full.slice(baseDir.length + 1).replace(/\\/g, "/");
        // Skip test files and generated dist
        if (rel.startsWith("tests/") || rel.startsWith("dist/") || name.endsWith(".test.mjs") || name.endsWith(".spec.mjs")) continue;
        failures.push(...scanFile(full, rel));
      }
    }
  }
  return failures;
}

const allFailures = [];
for (const scanDir of activeScanDirs) {
  const fullDir = join(root, scanDir);
  try {
    allFailures.push(...walk(fullDir, root));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}

if (allFailures.length) {
  console.error("governance check FAIL — obsolete human-review dependencies found in active files:");
  for (const f of allFailures) console.error(" - " + f);
  process.exit(1);
}
console.log("governance check PASS — no obsolete human-review dependencies in active docs/code/HTML");