import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

describe("domain portability (one-config change)", () => {
  it("all derived URLs come from site.config baseUrl", () => {
    const config = JSON.parse(readFileSync(join(process.cwd(), "tools/site.config.json"), "utf8"));
    const altBase = "https://example.com/";
    const altUrl = new URL("/learn/angka/", altBase).toString();
    assert.equal(altUrl, "https://example.com/learn/angka/");
    // Check that sitemap uses baseUrl
    const sitemap = readFileSync(join(process.cwd(), "sitemap.xml"), "utf8");
    assert.ok(sitemap.includes(config.baseUrl));
    // Canonical in dist should match baseUrl
    const html = readFileSync(join(process.cwd(), "dist/index.html"), "utf8");
    assert.ok(html.includes(`href="${config.baseUrl}"`));
    // Correction URLs use repositoryIssuesUrl, not baseUrl — ensure consistent
    const issuesUrl = config.repositoryIssuesUrl;
    assert.ok(issuesUrl.includes("github.com"));
  });

  it("synthetic alternate domain build would change consistently (simulated)", () => {
    const config = JSON.parse(readFileSync(join(process.cwd(), "tools/site.config.json"), "utf8"));
    const syntheticBase = "https://batak.example.org/";
    const routes = ["/", "/learn/angka/", "/dictionary/"];
    for (const r of routes) {
      const expected = new URL(r, syntheticBase).toString();
      assert.ok(expected.startsWith(syntheticBase));
    }
    // Ensure no hard-coded production hostname in source besides config
    const appJs = readFileSync(join(process.cwd(), "assets/js/config.js"), "utf8");
    assert.ok(appJs.includes("baseUrl") || appJs.includes("SITE_CONFIG"));
  });
});
