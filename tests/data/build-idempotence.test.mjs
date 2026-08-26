import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("build determinism", () => {
  it("build script normalizes EOL before hashing (no git log dependency)", () => {
    const build = readFileSync(join(root, "tools/build-dist.mjs"), "utf8");
    assert.equal(build.includes("git log"), false, "build should not use git log");
    assert.ok(build.includes("normalizeEol(dist)"), "build should normalize EOL");
    // normalize must appear before hashTree and revisionAssets
    const normIdx = build.indexOf("normalizeEol(dist)");
    const hashIdx = build.indexOf("hashTree(dist)");
    const revIdx = build.indexOf("revisionAssets(dist)");
    assert.ok(normIdx < hashIdx, "normalize before hashTree");
    assert.ok(normIdx < revIdx, "normalize before revision");
  });

  it("site.config lastModified is single source and sitemap uses it", () => {
    const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
    assert.ok(config.lastModified, "lastModified map exists");
    assert.equal(config.lastModified["/"], "2026-08-26");
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    assert.ok(sitemap.includes("<lastmod>2026-08-26</lastmod>"), "sitemap should contain lastmod");
  });

  it("dist exists and contains hashed assets", () => {
    const dist = join(root, "dist");
    assert.ok(existsSync(dist), "dist should exist after build");
    const cssFiles = readdirSync(join(dist, "assets/css"));
    assert.ok(cssFiles.some((f) => /styles\.[0-9a-f]{8}\.css$/.test(f)), "hashed css should exist");
  });

  it("patch scripts removed", () => {
    assert.equal(existsSync(join(root, "tools/add-eol.py")), false);
    assert.equal(existsSync(join(root, "tools/fix-extless.py")), false);
  });

  it("package.json verify includes drift gate", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    assert.ok(pkg.scripts["verify:drift"], "verify:drift should exist");
    assert.ok(pkg.scripts["verify:core"], "verify:core should exist");
    assert.ok(pkg.scripts["verify"].includes("verify:drift"), "verify should include drift");
  });
});
