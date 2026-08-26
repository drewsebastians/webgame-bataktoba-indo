import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const require_shim = () => ({ execFileSync });

/**
 * Deterministic production build -> dist/.
 * Copies ONLY public runtime resources, stamps the service worker cache
 * version with a content hash of the built tree, and emits dist/_headers.
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));

const COPY_PATHS = [
  "index.html",
  "games",
  "dictionary",
  "flashcards",
  "learn",
  "about",
  "contact",
  "privacy",
  "methodology",
  "data-source",
  "editorial-policy",
  "correction-process",
  "progres",
  "assets",
  "data/published",
  "data/migration",
  "sw.js",
  "manifest.webmanifest",
  "offline.html",
  "robots.txt",
  "sitemap.xml",
  "_redirects",
  ".nojekyll",
];

const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const rel of COPY_PATHS) {
  const src = join(root, rel);
  if (!existsSync(src)) {
    console.warn(`build: skipping missing ${rel}`);
    continue;
  }
  const dest = join(dist, rel);
  if (statSync(src).isDirectory()) {
    cpSync(src, dest, { recursive: true });
  } else {
    cpSync(src, dest);
  }
}

// Stamp service worker cache version from a hash of the built tree.
function hashTree(dir) {
  const hash = createHash("sha256");
  function walk(path) {
    for (const name of readdirSync(path).sort()) {
      const full = join(path, name);
      if (statSync(full).isDirectory()) walk(full);
      else hash.update(name).update(readFileSync(full));
    }
  }
  walk(dir);
  return hash.digest("hex").slice(0, 12);
}

const version = `btp-${hashTree(dist)}`;
const swPath = join(dist, "sw.js");
let sw = readFileSync(swPath, "utf8");
sw = sw.replace(/CACHE_VERSION = "[^"]+"/, `CACHE_VERSION = "${version}"`);
writeFileSync(swPath, sw, "utf8");

// Production headers (CSP + caching) for Cloudflare Pages / test server.
const headers = readFileSync(join(root, "_headers"), "utf8");
writeFileSync(join(dist, "_headers"), headers, "utf8");


// ---------------------------------------------------------------------------
// Asset revisioning: hash every JS/CSS asset, rename, and rewrite references.
// Deterministic: identical inputs produce identical hashes.
// ---------------------------------------------------------------------------

function revisionAssets(distDir) {
  const manifest = new Map(); // "assets/js/app.js" -> "assets/js/app.<hash>.js"
  const assetRoot = join(distDir, "assets");

  function collect(dir, relBase) {
    const found = [];
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = relBase ? `${relBase}/${name}` : name;
      if (statSync(full).isDirectory()) found.push(...collect(full, rel));
      else if (/\.(js|mjs|css)$/.test(name)) found.push([full, `assets/${rel}`]);
    }
    return found;
  }

  const files = collect(assetRoot, "");
  for (const [full, rel] of files) {
    const hash = createHash("sha256").update(readFileSync(full)).digest("hex").slice(0, 8);
    const ext = extname(full);
    const hashedRel = rel.replace(new RegExp(`\\${ext}$`), `.${hash}${ext}`);
    const hashedFull = join(distDir, hashedRel);
    renameSync(full, hashedFull);
    manifest.set(rel, hashedRel);
  }

  // Rewrite ES module imports (static + dynamic strings) inside hashed JS.
  function relOf(full) {
    return full.slice(distDir.length + 1).replace(/\\/g, "/");
  }

  for (const [full] of files) {
    const rel = relOf(full);
    const target = join(distDir, manifest.get(rel));
    let code = readFileSync(target, "utf8");
    code = code.replace(
      /((?:from\s*|import\s*\(\s*|import\s+)["'])(\.\.?\/[^"']+)(["'])/g,
      (match, head, spec, quote) => {
        const base = join(dirname(target), spec)
          .slice(distDir.length + 1)
          .replace(/\\/g, "/");
        const mapped = manifest.get(base);
        if (!mapped) return match;
        let relSpec = relative(dirname(target), join(distDir, mapped)).replace(/\\/g, "/");
        if (!relSpec.startsWith(".")) relSpec = "./" + relSpec;
        return `${head}${relSpec}${quote}`;
      },
    );
    writeFileSync(target, code, "utf8");
  }


  // Rewrite references in HTML pages (handles ./ and ../ prefixes).
  function walkHtml(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walkHtml(full);
      else if (name.endsWith(".html")) {
        let html = readFileSync(full, "utf8");
        for (const [oldRel, newRel] of manifest) {
          html = html.split(oldRel).join(newRel);
        }
        writeFileSync(full, html, "utf8");
      }
    }
  }
  walkHtml(distDir);

  return manifest;
}

const manifest = revisionAssets(dist);
console.log(`Revised ${manifest.size} asset files.`);

// Truthful per-page last-modified from git history (deterministic).
function injectLastModified(distDir) {
  const { execFileSync } = require_shim();
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = full.slice(distDir.length + 1);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".html")) {
        let iso;
        try {
          iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", rel], {
            cwd: root,
          })
            .toString()
            .trim();
        } catch {}
        if (!iso) continue;
        let html = readFileSync(full, "utf8");
        if (html.includes('name="last-modified"')) continue;
        html = html.replace(
          /(<\/head>)/,
          `    <meta name="last-modified" content="${iso}">\n  $1`,
        );
        writeFileSync(full, html, "utf8");
      }
    }
  }
  walk(distDir);
}
injectLastModified(dist);

// Hashed assets are immutable; HTML/data keep their revalidation strategies.
let headersOut = readFileSync(join(dist, "_headers"), "utf8");
headersOut = headersOut.replace(
  /\/assets\/\*\n\s*Cache-Control:[^\n]+/,
  "/assets/*\n  Cache-Control: public, max-age=31536000, immutable",
);
// The service worker itself must never be cached.
headersOut = headersOut.replace(
  /(\/sw\.js\n\s*Cache-Control:\s*)[^\n]+/,
  "$1no-cache",
);
writeFileSync(join(dist, "_headers"), headersOut, "utf8");

// Normalize text files to LF so committed dist matches Linux CI builds.
function normalizeEol(dir) {
  const textExt = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".webmanifest"]);
  function walk(d) {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (textExt.has(extname(full))) {
        const buf = readFileSync(full);
        const normalized = Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
        if (!buf.equals(normalized)) writeFileSync(full, normalized);
      }
    }
  }
  walk(dist);
}
normalizeEol(dist);

console.log(`dist/ built. SW cache version: ${version}`);
