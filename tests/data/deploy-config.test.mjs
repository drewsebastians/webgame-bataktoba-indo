import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);
const wrangler = readFileSync(new URL("wrangler.toml", root), "utf8");

describe("deployment configuration", () => {
  it("deploys the generated dist/ artifact, never the repository root", () => {
    assert.match(wrangler, /pages_build_output_dir\s*=\s*"dist"/);
    const assetsDir = wrangler.match(/\[assets\][\s\S]*?directory\s*=\s*"([^"]+)"/)?.[1];
    assert.equal(assetsDir, "dist");
    // root deployment regression guard
    assert.ok(!/directory\s*=\s*"\."/.test(wrangler), "asset directory must not be repository root");
    assert.ok(!/pages_build_output_dir\s*=\s*"\."/.test(wrangler));
  });

  it("build script exists and CI builds before deploy", () => {
    const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
    assert.equal(pkg.scripts.build, "node tools/build-dist.mjs");
  });
});
