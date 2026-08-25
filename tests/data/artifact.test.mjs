import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const hasDist = existsSync(dist);

const FORBIDDEN = [
  "data/raw",
  "data/candidates",
  "data/reviewed",
  "content",
  "tests",
  "tools",
  "BLUEPRINT_COMPLIANCE_MATRIX.md",
  "PROGRESS_LOG.md",
  "CURRENT_STATE_AUDIT.md",
];

describe("deployment target (Task 2 regression)", () => {
  it("wrangler.toml serves dist/, never repository root", () => {
    const wrangler = readFileSync(new URL("wrangler.toml", root), "utf8");
    assert.match(wrangler, /pages_build_output_dir = "dist"/);
    assert.ok(!/directory = "\."/m.test(wrangler));
  });
});

describe("production artifact integrity", () => {
  it("dist exists for verification", () => {
    assert.ok(hasDist, "run npm run build before verify");
  });

  (hasDist ? it : it.skip)("excludes internal/source material from dist", () => {
    for (const rel of FORBIDDEN) {
      assert.ok(!existsSync(new URL(`dist/${rel}`, root)), `dist must not contain ${rel}`);
    }
  });

  (hasDist ? it : it.skip)("contains required runtime entry points", () => {
    for (const rel of [
      "index.html",
      "sw.js",
      "manifest.webmanifest",
      "_headers",
      "data/published/learning-items.json",
      "data/migration/id-map.json",
    ]) {
      assert.ok(existsSync(new URL(`dist/${rel}`, root)), `missing dist/${rel}`);
    }
  });
});
