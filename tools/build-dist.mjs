import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Deterministic production build -> dist/.
 * Copies ONLY public runtime resources, stamps the service worker cache
 * version with a content hash of the built tree, and emits dist/_headers.
 * Last-modified data is explicit via tools/site.config.json (deterministic,
 * not git-history dependent). EOL is normalized to LF BEFORE hashing so
 * Windows/Linux produce identical artifacts.
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
  "contributors",
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

// Normalize text files to LF so committed dist matches Linux CI builds.
// MUST run BEFORE any hashing/revisioning so hashes are platform-independent.
function normalizeEol(dir) {
  const textExt = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".webmanifest"]);
  function walk(d) {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "_redirects" || name === ".nojekyll" || textExt.has(extname(full))) {
        const buf = readFileSync(full);
        // Zero-byte .nojekyll must stay zero-byte
        if (buf.length === 0) continue;
        const normalized = Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
        if (!buf.equals(normalized)) writeFileSync(full, normalized);
      }
    }
  }
  walk(dist);
}
normalizeEol(dist);

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
// Deterministic: identical inputs produce identical hashes (after LF normalize).
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

// Explicit last-modified from site config (deterministic, no git history).
function loadLastModifiedMap() {
  try {
    const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
    return config.lastModified ?? {};
  } catch {
    return {};
  }
}

const LAST_MODIFIED = loadLastModifiedMap();

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatIndonesianDate(isoDate) {
  // isoDate is "YYYY-MM-DD"
  const [y, m, d] = isoDate.split("-").map(Number);
  const month = INDONESIAN_MONTHS[m - 1] ?? "";
  return `${d} ${month} ${y}`;
}

function urlPathForDistFile(distFile) {
  const rel = distFile.slice(dist.length + 1).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel === "offline.html") return "/offline.html";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -11)}/`;
  if (rel.endsWith(".html")) return `/${rel.slice(0, -5)}/`;
  return `/${rel}`;
}

function injectLastModified(distDir) {
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".html")) {
        const urlPath = urlPathForDistFile(full);
        const isoDate = LAST_MODIFIED[urlPath];
        if (!isoDate) continue;
        // Skip progres dynamic page for editorial date semantics
        if (urlPath === "/progres/") continue;

        let html = readFileSync(full, "utf8");

        // --- meta last-modified (exact one) ---
        const isoDateTime = `${isoDate}T00:00:00+07:00`;
        // Remove any existing meta last-modified to ensure exactly one
        html = html.replace(/\s*<meta name="last-modified"[^>]*>\s*\n?/g, "\n");
        html = html.replace(
          /(<\/head>)/,
          `    <meta name="last-modified" content="${isoDate}">\n  $1`,
        );

        // --- visible <time> ---
        // Pages that should show visible date: all lastModified entries except excluded
        const shouldShowVisible = Boolean(isoDate) && urlPath !== "/progres/" && urlPath !== "/offline.html";
        if (shouldShowVisible) {
          const formatted = formatIndonesianDate(isoDate);
          const visible = `<p class="content-meta"><time datetime="${isoDate}">Terakhir diperbarui: ${formatted}</time></p>`;
          if (html.includes('class="content-meta"')) {
            // Update existing visible time deterministically
            html = html.replace(
              /<p class="content-meta">.*?<\/p>/s,
              visible,
            );
          } else {
            // Inject before </main> (deterministic location)
            if (html.includes("</main>")) {
              html = html.replace("</main>", `  ${visible}\n</main>`);
            } else if (html.includes("</body>")) {
              html = html.replace("</body>", `  ${visible}\n</body>`);
            }
          }
        }

        writeFileSync(full, html, "utf8");
      }
    }
  }
  walk(distDir);
}
injectLastModified(dist);

// LearningResource injection for published lessons (truthful, only when published).
function injectLearningResource(distDir) {
  let lessonsPayload;
  try {
    lessonsPayload = JSON.parse(readFileSync(join(root, "data/published/lessons.json"), "utf8"));
  } catch {
    return;
  }
  const published = lessonsPayload.published ?? [];
  if (!published.length) return;
  const siteConfig = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
  const baseUrl = siteConfig.baseUrl;
  for (const lesson of published) {
    if (lesson.publicationStatus !== "published") continue;
    const count = lesson.counts?.poolItems ?? lesson.itemIds?.length ?? 0;
    if (!lesson.slug || count === 0 || !Array.isArray(lesson.itemIds) || lesson.itemIds.length === 0) continue;
    const urlPath = `/learn/${lesson.slug}/`;
    const isoDate = LAST_MODIFIED[urlPath] ?? "2026-08-26";
    const resource = {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: lesson.title,
      description: lesson.description,
      inLanguage: "id",
      educationalLevel: String(lesson.level ?? 1),
      timeRequired: `PT${lesson.estMinutes ?? 5}M`,
      dateModified: isoDate,
      numberOfItems: count,
    };
    const distHtml = join(distDir, "learn", lesson.slug, "index.html");
    if (!existsSync(distHtml)) continue;
    let html = readFileSync(distHtml, "utf8");
    // Remove any existing LearningResource to ensure idempotence
    html = html.replace(
      /\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "LearningResource"[\s\S]*?<\/script>\s*/g,
      "\n",
    );
    const ld = `    <script type="application/ld+json">\n${JSON.stringify(resource, null, 2)}\n    </script>\n`;
    html = html.replace(/<\/head>/, `${ld}  </head>`);
    writeFileSync(distHtml, html, "utf8");
  }
}
injectLearningResource(dist);

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

console.log(`dist/ built. SW cache version: ${version}`);
