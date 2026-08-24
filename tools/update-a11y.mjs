import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * One-time codemod for accessibility basics on every page:
 *  - skip link right after <body>
 *  - id="main-content" + tabindex="-1" on <main>
 *  - mobile nav toggle button before .nav-links
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));

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

const SKIP_LINK =
  '    <a class="skip-link" href="#main-content">Langsung ke konten</a>\n';

function processPage(path) {
  let html = readFileSync(path, "utf8");
  let changed = false;

  if (!html.includes('class="skip-link"')) {
    html = html.replace(/(<body[^>]*>)/, `$1\n${SKIP_LINK}`);
    changed = true;
  }

  if (!html.includes('id="main-content"')) {
    html = html.replace("<main class=", '<main id="main-content" tabindex="-1" class=');
    changed = true;
  }

  if (!html.includes("nav-toggle")) {
    html = html.replace(
      /(<div class="nav-links")/,
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links-list">Menu</button>\n        $1 id="nav-links-list"',
    );
    changed = true;
  }

  if (changed) {
    writeFileSync(path, html, "utf8");
    console.log(`a11y updated: ${path.replace(root, "")}`);
  }
}

walk(root);
