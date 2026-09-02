#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const allowlist = new Set([
  "PROGRESS_LOG.md",
  "BLUEPRINT_COMPLIANCE_MATRIX.md",
  "ULTIMATE_BLUEPRIGHT_TRACEABILITY_2026-08-30.md",
  "CURRENT_STATE_AUDIT.md",
  "docs/GOVERNANCE_PACKAGE_RECONCILIATION.md",
  "tools/check-governance.mjs",
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
  "human-reviewed is required",
  "needs human review",
  "review queue.*human",
];

const skipPatterns = [
  /\.json$/,           // data files
  /\.html$/,           // static HTML
  /dist\//,            // generated dist
  /artifacts\//,       // artifacts
  /test-results\//,    // test results
  /node_modules\//,    // deps
  /\.git\//,           // git
  /tests\//,           // tests
  /artifacts\//,       // artifacts
  /\.json$/,           // data files (field names)
  /dist\//,            // generated dist
  /\.min\.js$/,        // minified
  /\.spec\.mjs$/,      // test files
  /\.test\.mjs$/,      // test files
  /\.spec\.js$/,       // test files
  /\.test\.js$/,       // test files
  /node_modules\//,    // deps
  /\.git\//,           // git
  /\.temp\//,          // temp
  /\.cache\//,         // cache
  /\.dist\//,          // dist
  /\.build\//,         // build
  /\.out\//,           // out
  /\.tmp\//,           // temp
];

const failures = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if ([".git", "node_modules", "dist", "artifacts", "test-results", ".temp", ".cache"].includes(name)) continue;
      walk(full);
    } else if (name.endsWith(".md") || name.endsWith(".html") || name.endsWith(".mjs") || name.endsWith(".js") || name.endsWith(".json") || name.endsWith(".txt")) {
      const fullPath = full.replace(/\\/g, "/");
      const rel = fullPath.slice(root.length + 1);
      
      const skip = skipPatterns.some(p => new RegExp(p).test(full));
      if (skip) continue;
      
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
  walk(root);
  if (failures.length) {
    console.error("governance check FAIL — obsolete human-review language found:");
    for (const f of failures) console.error(" - " + f);
    process.exit(1);
  }
  console.log("governance check PASS — no obsolete human-review dependencies in active docs/code");
}