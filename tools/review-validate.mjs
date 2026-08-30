#!/usr/bin/env node
import { loadReviewedOverrides, validateReviewed } from "./lib/review-lib.mjs";

const overrides = loadReviewedOverrides().overrides || [];
const errors = validateReviewed(overrides);
if (errors.length) {
  console.error("review:validate FAIL");
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`review:validate PASS (${overrides.length} overrides, 0 errors)`);
if (overrides.length === 0) console.log("Note: no reviewed overrides yet — human review pipeline ready, awaiting external input.");
