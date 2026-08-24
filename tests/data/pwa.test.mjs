import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);

describe("PWA manifest", () => {
  const manifest = JSON.parse(readFileSync(new URL("manifest.webmanifest", root), "utf8"));

  it("has the required fields", () => {
    assert.equal(manifest.name, "Batak Toba Play");
    assert.ok(manifest.start_url === "." || manifest.start_url.startsWith("/"));
    assert.ok(["standalone", "fullscreen", "minimal-ui"].includes(manifest.display));
    assert.ok(manifest.icons.length > 0);
  });

  it("icon file exists", () => {
    const iconPath = new URL(manifest.icons[0].src.replace(/^\//, ""), root);
    assert.ok(readFileSync(iconPath).length > 0);
  });
});

describe("service worker", () => {
  const sw = readFileSync(new URL("sw.js", root), "utf8");

  it("versions its caches and cleans old ones on activation", () => {
    assert.match(sw, /CACHE_VERSION\s*=\s*"/);
    assert.match(sw, /caches\s*\.\s*keys\(\)/);
    assert.match(sw, /caches\s*\.\s*delete/);
  });

  it("uses network-first for navigations with offline fallback", () => {
    assert.match(sw, /request\.mode === "navigate"/);
    assert.match(sw, /offline\.html/);
    assert.match(sw, /fetch\(request\)/);
  });

  it("never intercepts cross-origin requests (ads/analytics stay network-only)", () => {
    assert.match(sw, /url\.origin !== self\.location\.origin/);
  });

  it("app registers the worker only when the pwa feature flag is on", async () => {
    const { SITE_CONFIG } = await import("../../assets/js/config.js");
    assert.equal(SITE_CONFIG.features.pwa, true);
    const app = readFileSync(new URL("assets/js/app.js", root), "utf8");
    assert.ok(app.includes("SITE_CONFIG.features.pwa"));
    assert.ok(!/"\/sw\.js"/.test(app), "must resolve sw path via import.meta.url, not root-absolute");
  });
});

describe("cache headers", () => {
  const headers = readFileSync(new URL("_headers", root), "utf8");

  it("does not serve immutable caching for unversioned assets", () => {
    const assetsSection = headers.split("/assets/*")[1]?.split(/\n\/[^\n]*/)[0] ?? "";
    assert.ok(assetsSection.includes("must-revalidate"), "assets must revalidate");
    assert.ok(!assetsSection.includes("immutable"), "unversioned assets must not be immutable");
    assert.ok(!headers.includes("max-age=31536000"), "one-year cache removed entirely");
  });

  it("keeps sw.js uncacheable and secures responses", () => {
    assert.match(headers, /\/sw\.js[\s\S]*?no-cache/);
    assert.match(headers, /X-Content-Type-Options: nosniff/);
    assert.match(headers, /Referrer-Policy:/);
  });
});
