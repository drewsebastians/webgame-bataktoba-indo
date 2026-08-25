import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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

console.log(`dist/ built. SW cache version: ${version}`);
