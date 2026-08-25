#!/usr/bin/env python3
"""Wave 4: og:absolute, checker rules, verify/CI contract, last-modified."""
from pathlib import Path
import re

ROOT = Path(".")
BASE = "https://webgame-bataktoba-indo.pages.dev/"

# --- A) source HTML: absolute og:image + twitter:image -----------------------
count = 0
for page in ROOT.glob("**/index.html"):
    if "node_modules" in str(page) or "dist" in str(page):
        continue
    s = page.read_text(encoding="utf-8")
    orig = s
    s = re.sub(
        r'content="(\.\./)?assets/icons/og-image\.png"',
        f'content="{BASE}assets/icons/og-image.png"',
        s,
    )
    if 'property="og:image"' in s and "twitter:image" not in s:
        s = s.replace(
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:card" content="summary_large_image">\n'
            f'    <meta name="twitter:image" content="{BASE}assets/icons/og-image.png">',
        )
    if s != orig:
        page.write_text(s, encoding="utf-8", newline="\n")
        count += 1
print("og pages patched:", count)

# --- B) checker rule ---------------------------------------------------------
c = Path("tools/check-site.mjs")
cs = c.read_text(encoding="utf-8")
if 'property="og:image"' not in cs:
    cs = cs.replace(
        """      'name="twitter:card"',""",
        """      'property="og:image"',
      'name="twitter:card"',""",
        1,
    )
    # absolute-url enforcement
    cs = cs.replace(
        "    if (!/<html[^>]*\\slang=/.test(text)) {",
        """    const ogImage = text.match(/property="og:image" content="([^"]*)"/)?.[1];
    if (ogImage && !/^https:\\/\\//.test(ogImage)) {
      failures.push(`og:image must be an absolute URL in ${page}`);
    }
    if (!/<html[^>]*\\slang=/.test(text)) {""",
        1,
    )
    c.write_text(cs, encoding="utf-8", newline="\n")
print("checker updated")

# --- C) verify contract + remove alias ---------------------------------------
pkg = Path("package.json")
pj = pkg.read_text(encoding="utf-8")
pj = pj.replace(
    '"verify": "npm run check && npm run test && npm run build && npm run e2e",\n'
    '    "verify:full": "npm run verify && npm run test:browser",',
    '"verify":\n'
    '      "npm run check && npm run test && npm run build && npm run e2e && npm run test:browser",',
)
pkg.write_text(pj, encoding="utf-8", newline="\n")
print("package verify updated")

# --- D) CI strict ------------------------------------------------------------
wf = Path(".github/workflows/verify.yml")
ws = wf.read_text(encoding="utf-8")
ws = ws.replace("run: npm ci || npm install", "run: npm ci")
old_steps = """      - name: Site check (links, schema, SEO, sitemap, draft-leak guard)
        run: npm run check

      - name: Unit / data / migration tests
        run: npm test

      - name: Production build
        run: npm run build

      - name: E2E smoke against dist
        run: npm run e2e

      - name: Browser E2E + axe accessibility (against dist)
        run: npx playwright test"""
new_steps = """      - name: Full verification (check + unit + build + smoke + browser + axe)
        run: npm run verify"""
assert old_steps in ws
ws = ws.replace(old_steps, new_steps, 1)
wf.write_text(ws, encoding="utf-8", newline="\n")
print("ci strict single-command")

# --- E) build-dist: truthful per-page last-modified meta from git ------------
b = Path("tools/build-dist.mjs")
bs = b.read_text(encoding="utf-8")
if "last-modified" not in bs:
    bs = bs.replace(
        "// Hashed assets are immutable",
        """// Truthful per-page last-modified from git history (deterministic).
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
            cwd: process.env.BUILD_REPO_ROOT,
          })
            .toString()
            .trim();
        } catch {}
        if (!iso) continue;
        let html = readFileSync(full, "utf8");
        if (html.includes('name="last-modified"')) continue;
        html = html.replace(
          /(<\\/head>)/,
          `    <meta name="last-modified" content="${iso}">\\n  $1`,
        );
        writeFileSync(full, html, "utf8");
      }
    }
  }
  walk(distDir);
}
injectLastModified(dist);

// Hashed assets are immutable""",
        1,
    )

    # tiny CommonJS shim so the tool stays ESM without top-level require
    bs = bs.replace(
        'import { fileURLToPath } from "node:url";',
        'import { fileURLToPath } from "node:url";\n'
        'import { createRequire } from "node:module";\n'
        'function require_shim() { return { execFileSync: null }; }',
    )

# real implementation: replace shim body with working execFileSync via child_process
bs = bs.replace(
    'import { createRequire } from "node:module";\n'
    'function require_shim() { return { execFileSync: null }; }',
    'import { execFileSync } from "node:child_process";\n'
    "const require_shim = () => ({ execFileSync });",
)
bs = bs.replace("cwd: process.env.BUILD_REPO_ROOT,", "cwd: root,")
b.write_text(bs, encoding="utf-8", newline="\n")
print("build-dist last-modified injected")

# --- F) visible updated-line snippet in app ---------------------------------
a = Path("assets/js/app.js")
asrc = a.read_text(encoding="utf-8")
if "Diperbarui:" not in asrc:
    asrc = asrc.replace(
        "async function main() {\n  await initProgress();",
        """async function main() {
  await initProgress();
  showLastModified();""",
        1,
    )
    asrc = asrc.replace(
        "function registerServiceWorker() {",
        """function showLastModified() {
  const meta = document.querySelector('meta[name="last-modified"]');
  const footer = document.querySelector(".footer-inner");
  if (!meta || !footer) return;
  footer.prepend(el("span", { text: `Diperbarui: ${meta.content.slice(0, 10)}` }));
}

function registerServiceWorker() {""",
        1,
    )
    a.write_text(asrc, encoding="utf-8", newline="\n")
print("visible last-modified snippet added")
