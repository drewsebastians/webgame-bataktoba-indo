import { readFileSync, readdirSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);
const siteConfig = JSON.parse(readFileSync(new URL("tools/site.config.json", root), "utf8"));
const { SITE_CONFIG } = await import("../../assets/js/config.js");

const pages = [];
function walk(url) {
  const base = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  for (const name of readdirSync(url)) {
    const path = new URL(`${base}${name}`, url);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(path);
    } else if (name === "index.html") {
      pages.push(path);
    }
  }
}
walk(root);

function relPath(page) {
  return decodeURIComponent(page.pathname).split("/Webgame Bahasa Batak/")[1] ?? page.pathname;
}

describe("single source of truth for site URLs", () => {
  it("browser config matches tooling config", () => {
    assert.equal(SITE_CONFIG.baseUrl, siteConfig.baseUrl);
    assert.equal(SITE_CONFIG.repositoryIssuesUrl, siteConfig.repositoryIssuesUrl);
  });
});

describe("accessibility markup present on all pages", () => {
  it("covers all site pages", () => {
    assert.ok(pages.length >= 15, `expected >=15 pages, found ${pages.length}`);
  });

  it("every page has skip link, main-content id, and nav toggle", () => {
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      const rel = relPath(page);
      assert.ok(html.includes('class="skip-link"'), `missing skip link: ${rel}`);
      assert.ok(html.includes('id="main-content"'), `missing main id: ${rel}`);
      assert.ok(html.includes("nav-toggle"), `missing nav toggle: ${rel}`);
    }
  });

  it("social meta present on every page (OG + twitter card)", () => {
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      const rel = relPath(page);
      for (const marker of ['property="og:title"', 'property="og:url"', 'name="twitter:card"']) {
        assert.ok(html.includes(marker), `missing ${marker}: ${rel}`);
      }
    }
  });

  it("canonical URLs use the configured base URL", () => {
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];
      assert.ok(canonical?.startsWith(siteConfig.baseUrl), `bad canonical in ${relPath(page)}: ${canonical}`);
    }
  });
});
