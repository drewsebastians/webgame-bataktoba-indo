import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const THEME_COLOR = "#b7352d";

function walk(dir, prefix = "") {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules" || name === "progres") continue;
      walk(path, `${prefix}${name}/`);
    } else if (name === "index.html") {
      processPage(path, prefix);
    }
  }
}

function relPrefix(prefix) {
  // root page -> "", one level deep -> "../"
  return prefix ? "../".repeat(prefix.split("/").filter(Boolean).length) : "";
}

function processPage(path, prefix) {
  let html = readFileSync(path, "utf8");
  const p = relPrefix(prefix);
  let changed = false;

  // manifest + theme-color
  if (!html.includes('rel="manifest"')) {
    html = html.replace(
      /(<link rel="canonical"[^>]*>)/,
      `$1\n    <link rel="manifest" href="${p}manifest.webmanifest">\n    <meta name="theme-color" content="${THEME_COLOR}">`,
    );
    changed = true;
  }

  // og:image
  if (!html.includes('property="og:image"')) {
    html = html.replace(
      /(<meta property="og:type"[^>]*>)/,
      `$1\n    <meta property="og:image" content="${p}assets/icons/og-image.png">`,
    );
    changed = true;
  }

  // footer trust links
  if (!html.includes("correction-process")) {
    html = html.replace(
      /<a href="(?!["])([^"]*)Contact<\/a>/i,
      (match) =>
        `${match}\n          <a href="${p}editorial-policy/">Editorial Policy</a>\n          <a href="${p}correction-process/">Correction Process</a>`,
    );
    changed = true;
  }

  // breadcrumb JSON-LD
  if (!html.includes('"BreadcrumbList"')) {
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "Halaman";
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];
    if (canonical) {
      const crumb = [
        "    <script type=\"application/ld+json\">",
        "      {",
        '        "@context": "https://schema.org",',
        '        "@type": "BreadcrumbList",',
        '        "itemListElement": [',
        "          {",
        '            "@type": "ListItem",',
        '            "position": 1,',
        '            "name": "Home",',
        '            "item": "https://webgame-bataktoba-indo.pages.dev/"',
        "          },",
        "          {",
        '            "@type": "ListItem",',
        '            "position": 2,',
        `            "name": ${JSON.stringify(title)},`,
        `            "item": ${JSON.stringify(canonical)}`,
        "          }",
        "        ]",
        "      }",
        "    </script>",
      ].join("\n");
      html = html.replace(/(<\/head>)/, `${crumb}\n  $1`);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(path, html, "utf8");
    console.log(`seo/pwa updated: ${path.replace(root, "")}`);
  }
}

walk(root);
