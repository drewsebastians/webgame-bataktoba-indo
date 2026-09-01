#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const allowlist = new Set([
  "PROGRESS_LOG.md",
  "BLUEPRINT_COMPLIANCE_MATRIX.md",
  "ULTIMATE_BLUEPRINT_TRACEABILITY_2026-08-30.md",
  "docs/GOVERNANCE_PACKAGE_RECONCILIATION.md",
  "tools/check-governance.mjs",
  "data/published/learning-items.json",
  "data/published/word-pairs.json",
  "data/published/phrase-pairs.json",
  "data/published/sample-sentences.json",
  "data/candidates/word-pairs.json",
  "data/candidates/phrase-pairs.json",
  "data/candidates/sample-sentences.json",
  "data/candidates/lesson-drafts.json",
  "data/reviewed/README.md",
  "content/curated/draft-vocabulary.json",
  "CURRENT_STATE_AUDIT.md",
  "tests/data/topic-registry-truth.test.mjs",
  "tests/data/source-expansion.test.mjs",
  "tests/browser/core.spec.mjs",
  "docs/REVIEW_ROUND_1_STATUS.md",
  "docs/FIRST_LESSON_UNLOCK_PLAN.md",
  "docs/FIRST_TOPIC_SEO_UNLOCK_PLAN.md",
  "docs/REVIEWER_ORIGINATED_CONTENT_POLICY.md",
  "docs/HUMAN_LINGUISTIC_REVIEW_HANDOFF.md",
]);

const forbidden = [
  "reviewer approval required",
  "BLOCKED_HUMAN_REVIEW",
  "waiting for reviewer",
  "menunggu review penutur",
  "human review required",
  "human-reviewed is required",
  "needs human review",
  "review queue.*human",
];

const failures = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if ([".git", "node_modules", "dist", "artifacts", "test-results", ".temp"].includes(name)) continue;
      walk(full);
    } else if (name.endsWith(".md") || name.endsWith(".html") || name.endsWith(".mjs") || name.endsWith(".js") || name.endsWith(".json")) {
      const rel = full.slice(root.length + 1).replace(/\\/g, "/");
      if ([...allowlist].some((a) => rel.startsWith(a) || rel === a)) continue;
      const text = readFileSync(full, "utf8");
      for (const pat of forbidden) {
        const re = new RegExp(pat, "i");
        if (re.test(text)) {
          failures.push(`${rel}: contains obsolete governance phrase "${pat}"`);
        }
      }
    }
  }
}
walk(root);
if (failures.length) {
  console.error("governance check FAIL — obsolete human-review language found:");
  for (const f of failures) console.error(" - " + f);
  process.exit(1);
}
console.log("governance check PASS — no obsolete human-review dependencies in active docs/code");
