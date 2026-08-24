import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * One-time codemod: strips ad placeholder divs from every page.
 * The real ad component (assets/js/ads.js) renders slots only when
 * explicitly enabled with a valid publisher ID and consent.
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(path);
    } else if (name.endsWith(".html")) {
      processPage(path);
    }
  }
}

function processPage(path) {
  const html = readFileSync(path, "utf8");
  if (!html.includes("ad-slot")) return;
  const cleaned = html
    .replace(/[ \t]*<div class="ad-slot"[^>]*><\/div>\r?\n?/g, "")
    .replace(/[ \t]*<div class="ad-slot"[^>]*>\s*<\/div>\r?\n?/g, "");
  if (cleaned !== html) {
    writeFileSync(path, cleaned, "utf8");
    console.log(`ad placeholder removed: ${path.replace(root, "")}`);
  }
}

walk(root);
