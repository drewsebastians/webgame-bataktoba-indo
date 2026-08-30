#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { validateReviewed, loadReviewedOverrides } from "./lib/review-lib.mjs";

const overrides = loadReviewedOverrides().overrides || [];
const errors = validateReviewed(overrides);
if (errors.length) {
  console.error("content:publish blocked — validation failed");
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log("content:publish: validation PASS — invoking canonical builder (build-learning-data.py requires local DB) …");
const res = spawnSync("python", ["tools/build-learning-data.py"], { stdio: "inherit" });
if (res.status !== 0) {
  console.log("Note: build-learning-data.py requires 1.6GB corpus DB (docs/DATA_REPRODUCIBILITY.md). CI validates committed data; local publish requires DB.");
  console.log("If DB unavailable, publication preview is via npm run review:preview.");
  process.exit(res.status ?? 1);
}
console.log("content:publish: deterministic output generated — run npm run build && npm run verify:release before release.");
