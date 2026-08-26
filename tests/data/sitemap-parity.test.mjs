import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const siteConfig = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));

function collectHtmlPages(dir, base = "") {
  const pages = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules" || name === "dist" || name === "test-results") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) pages.push(...collectHtmlPages(path, `${base}${name}/`));
    else if (name === "index.html") pages.push({ path, urlPath: `/${base}` });
  }
  return pages;
}

describe("noindex ↔ sitemap parity", () => {
  it("thin topics and progres are noindex and absent from sitemap", () => {
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    const sitemapSet = new Set(locs);

    const mustBeNoindex = ["/learn/angka/", "/learn/keluarga/", "/learn/sapaan/", "/learn/makanan/", "/progres/"];
    for (const urlPath of mustBeNoindex) {
      const expectedUrl = new URL(urlPath, siteConfig.baseUrl).toString();
      assert.equal(sitemapSet.has(expectedUrl), false, `sitemap should NOT contain ${expectedUrl}`);
      const filePath = join(root, urlPath.slice(1), "index.html");
      const html = readFileSync(filePath, "utf8");
      assert.match(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/, `${urlPath} should have noindex`);
    }
  });

  it("representative indexable pages are indexable and present", () => {
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    const sitemapSet = new Set(locs);
    const mustBeIndexable = ["/", "/learn/", "/games/", "/dictionary/", "/methodology/", "/about/", "/data-source/", "/contributors/"];
    for (const urlPath of mustBeIndexable) {
      const expectedUrl = new URL(urlPath, siteConfig.baseUrl).toString();
      assert.equal(sitemapSet.has(expectedUrl), true, `sitemap should contain ${expectedUrl}`);
      const filePath = urlPath === "/" ? join(root, "index.html") : join(root, urlPath.slice(1), "index.html");
      const html = readFileSync(filePath, "utf8");
      assert.equal(/<meta[^>]+name="robots"[^>]+noindex/.test(html), false, `${urlPath} should NOT be noindex`);
    }
  });

  it("sitemap lastmod derives from single source site.config", () => {
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    for (const [urlPath, date] of Object.entries(siteConfig.lastModified)) {
      const url = new URL(urlPath, siteConfig.baseUrl).toString();
      if (sitemap.includes(`<loc>${url}</loc>`)) {
        assert.ok(sitemap.includes(`<lastmod>${date}</lastmod>`), `sitemap should have lastmod ${date} for ${url}`);
      }
    }
  });
});
