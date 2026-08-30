import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));

function collectDistRoutes(dist) {
  const routes = [];
  function walk(dir, urlPath) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full, `${urlPath}${name}/`);
      else if (name === "index.html") routes.push(urlPath);
    }
  }
  walk(dist, "/");
  return routes;
}

describe("route/indexability inventory (drift detector)", () => {
  it("generates inventory and detects drift", () => {
    const distRoutes = collectDistRoutes(join(root, "dist"));
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    // Every sitemap URL must have a dist route
    for (const u of sitemapUrls) {
      assert.ok(distRoutes.includes(u), `sitemap ${u} should have dist route`);
    }
    // No dist route that is indexable should be missing from sitemap
    for (const r of distRoutes) {
      const htmlPath = join(root, "dist", r.slice(1), "index.html");
      if (!existsSync(htmlPath)) continue;
      const html = readFileSync(htmlPath, "utf8");
      const isNoindex = /name="robots"[^>]*noindex/.test(html);
      const inSitemap = sitemapUrls.includes(r);
      if (!isNoindex) assert.ok(inSitemap, `${r} indexable should be in sitemap`);
      else assert.ok(!inSitemap, `${r} noindex should NOT be in sitemap`);
    }
  });

  it("lastModified parity", () => {
    const lastMod = config.lastModified;
    for (const [route, date] of Object.entries(lastMod)) {
      const htmlPath = join(root, "dist", route.slice(1), "index.html");
      if (!existsSync(htmlPath)) continue;
      const html = readFileSync(htmlPath, "utf8");
      if (/name="robots"[^>]*noindex/.test(html)) continue; // progres excluded
      if (route === "/progres/") continue;
      assert.ok(html.includes(`content="${date}"`), `${route} meta last-modified should be ${date}`);
      assert.ok(html.includes(`datetime="${date}"`), `${route} visible time should be ${date}`);
    }
  });
});
