import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * One-time codemod: adds Open Graph + Twitter meta tags to every page that
 * has a title/description/canonical but lacks OG tags. Values derive from
 * the existing tags so pages stay self-consistent.
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(path);
    } else if (name === "index.html") {
      processPage(path);
    }
  }
}

function processPage(path) {
  let html = readFileSync(path, "utf8");
  if (html.includes('property="og:title"')) return;

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];

  if (!title || !description || !canonical) {
    console.warn(`SKIP (missing basics): ${path}`);
    return;
  }

  const ogTags = [
    `    <meta property="og:title" content="${title}">`,
    `    <meta property="og:description" content="${description}">`,
    `    <meta property="og:type" content="website">`,
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta property="og:site_name" content="Batak Toba Play">`,
    `    <meta property="og:locale" content="id_ID">`,
    `    <meta name="twitter:card" content="${config.twitterCard}">`,
    `    <meta name="twitter:title" content="${title}">`,
    `    <meta name="twitter:description" content="${description}">`,
  ].join("\n");

  html = html.replace(
    /(<link rel="canonical"[^>]*>)/,
    `$1\n${ogTags}`,
  );
  writeFileSync(path, html, "utf8");
  console.log(`OG/Twitter added: ${path.replace(root, "")}`);
}

walk(root);
