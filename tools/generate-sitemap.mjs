import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates sitemap.xml from the actual set of index.html pages.
 * Deterministic output (no timestamps) so diffs stay meaningful.
 * Excludes nothing today because there are no draft pages; when drafts
 * appear they must carry <meta name="robots" content="noindex"> and this
 * generator will honor that automatically.
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));

function collectHtmlPages(dir, base = "") {
  const pages = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules" || name === "dist" || name === "test-results") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      pages.push(...collectHtmlPages(path, `${base}${name}/`));
    } else if (name === "index.html") {
      pages.push({ path: join(path), urlPath: `/${base}` });
    }
  }
  return pages;
}

const pages = collectHtmlPages(root)
  .filter(({ path }) => !path.includes(`${join(root, "tools")}`))
  .map(({ path, urlPath }) => {
    const html = readFileSync(path, "utf8");
    const noindex = /<meta[^>]+name="robots"[^>]+noindex/.test(html);
    return { urlPath, noindex };
  })
  .filter((page) => !page.noindex)
  .map((page) => new URL(page.urlPath, config.baseUrl).toString())
  .sort();

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((url) => `  <url><loc>${url}</loc></url>`),
  "</urlset>",
];

writeFileSync(join(root, "sitemap.xml"), `${lines.join("\n")}\n`, "utf8");
console.log(`sitemap.xml generated with ${pages.length} URLs.`);
if (!existsSync(join(root, "robots.txt"))) {
  console.error("Warning: robots.txt missing.");
}
