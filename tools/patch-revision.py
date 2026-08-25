#!/usr/bin/env python3
"""Add deterministic asset revisioning to build-dist.mjs."""
from pathlib import Path

p = Path("tools/build-dist.mjs")
s = p.read_text(encoding="utf-8")

if "revisionAssets" in s:
    print("already patched")
    raise SystemExit(0)

addition = '''
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
      else if (/\\.(js|mjs|css)$/.test(name)) found.push([full, `assets/${rel}`]);
    }
    return found;
  }

  const files = collect(assetRoot, "");
  for (const [full, rel] of files) {
    const hash = createHash("sha256").update(readFileSync(full)).digest("hex").slice(0, 8);
    const ext = extname(full);
    const hashedRel = rel.replace(new RegExp(`\\\\${ext}$`), `.${hash}${ext}`);
    const hashedFull = join(distDir, hashedRel);
    renameSync(full, hashedFull);
    manifest.set(rel, hashedRel);
  }

  // Rewrite ES module imports (static + dynamic strings) inside hashed JS.
  function relOf(full) {
    return full.slice(distDir.length + 1).replace(/\\\\/g, "/");
  }

  for (const [full] of files) {
    const rel = relOf(full);
    const target = join(distDir, manifest.get(rel));
    let code = readFileSync(target, "utf8");
    code = code.replace(
      /((?:from\\s*|import\\s*\\(\\s*|import\\s+)["'])(\\.\\.?\\/[^"']+)(["'])/g,
      (match, head, spec, quote) => {
        const base = join(dirname(target), spec).slice(distDir.length + 1).replace(/\\\\/g, "/");
        const mapped = manifest.get(base);
        return mapped ? `${head}${specifyRelative(dirname(target), mapped)}${quote}` : match;
      },
    );
    writeFileSync(target, code, "utf8");
  }

  function specifyRelative(fromDir, targetRel) {
    const fromParts = fromDir.split("/");
    const toParts = targetRel.split("/");
    let common = 0;
    while (
      common < fromParts.length - 1 &&
      common < toParts.length - 1 &&
      fromParts[common] === toParts[common]
    ) common += 1;
    const ups = fromParts.length - 1 - common;
    const downs = toParts.slice(common).join("/");
    return `${ups ? "../".repeat(ups) : "./"}${downs}`;
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

// Hashed assets are immutable; HTML/data keep their revalidation strategies.
let headersOut = readFileSync(join(dist, "_headers"), "utf8");
headersOut = headersOut.replace(
  /\\/assets\\/\\*\\n\\s*Cache-Control:[^\\n]+/,
  "/assets/*\\n  Cache-Control: public, max-age=31536000, immutable",
);
// The service worker itself must never be cached.
headersOut = headersOut.replace(
  /(\\/sw\\.js\\n\\s*Cache-Control:\\s*)[^\\n]+/,
  "$1no-cache",
);
writeFileSync(join(dist, "_headers"), headersOut, "utf8");
'''

# Insert before the final console.log of main build summary
anchor = 'console.log(`dist/ built.'
assert anchor in s
idx = s.index(anchor)
line_start = s.rfind("\n", 0, idx) + 1
s = s[:line_start] + addition + "\n" + s[line_start:]

# needed imports
s = s.replace(
    'import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";',
    'import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";',
)
s = s.replace(
    'import { dirname, join } from "node:path";',
    'import { dirname, extname, join } from "node:path";',
)

p.write_text(s, encoding="utf-8", newline="\n")
print("revisioning added")
