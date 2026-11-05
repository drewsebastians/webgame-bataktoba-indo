import { readFileSync, existsSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const hasDist = existsSync(dist);

const FORBIDDEN = [
  "data/raw",
  "data/candidates",
  "data/legacy",
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

  (hasDist ? it : it.skip)("gives each immutable JS/CSS URL a hash of its final bytes", () => {
    const assetRoot = fileURLToPath(new URL("dist/assets/", root));
    const hashedAssets = [];
    function walk(dir) {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(?:js|mjs|css)$/.test(name)) hashedAssets.push({ name, path: full });
      }
    }
    walk(assetRoot);
    assert.ok(hashedAssets.length > 0, "expected revisioned production assets");

    for (const asset of hashedAssets) {
      const { name, path } = asset;
      const match = name.match(/\.([a-f0-9]{8})\.(?:js|mjs|css)$/);
      assert.ok(match, `expected a content-hashed asset name: ${name}`);
      const bytes = readFileSync(path);
      const expected = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
      assert.equal(match[1], expected, `${name} must hash its final rewritten bytes`);
    }
  });
});
