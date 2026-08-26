import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function walkHtml(dir, cb) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === ".git" || name === "node_modules" || name === "test-results") continue;
      walkHtml(path, cb);
    } else if (name.endsWith(".html") && !path.includes(`${join(root, "dist")}`)) {
      cb(path);
    }
  }
}

const requiredMeta = [
  'rel="canonical"',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:type"',
  'property="og:url"',
  'property="og:image"',
  'property="og:site_name"',
  'property="og:locale"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image"',
];

function assertCardinality(html, filePath, checkDist = false) {
  const isNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html);
  if (isNoindex) return; // exempt per checker, but we still check no duplicates
  for (const marker of requiredMeta) {
    const count = html.split(marker).length - 1;
    assert.equal(count, 1, `${filePath}${checkDist ? " (dist)" : ""}: expected exactly one ${marker}, found ${count}`);
  }
  // title
  const titleCount = (html.match(/<title>/g) || []).length;
  assert.equal(titleCount, 1, `${filePath}: expected exactly one <title>`);
}

describe("metadata cardinality in source AND dist", () => {
  it("source HTML has exact cardinality (no duplicates, no blanks)", () => {
    walkHtml(root, (path) => {
      const html = readFileSync(path, "utf8");
      // progres has blank gaps fixed, ensure no 5+ consecutive newlines from patch residue
      assert.equal(/\n{5,}/.test(html), false, `${path}: should not contain large blank gaps`);
      assertCardinality(html, path, false);
      // check no duplicate last-modified (source should have 0 or 1; dist will have 1)
      const lastModCount = (html.match(/name="last-modified"/g) || []).length;
      assert.ok(lastModCount <= 1, `${path}: source should have at most one last-modified`);
    });
  });

  it("dist HTML has exact cardinality and visible time where applicable", () => {
    const dist = join(root, "dist");
    if (!existsSync(dist)) return;
    function walkDist(dir) {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walkDist(path);
        else if (name.endsWith(".html")) {
          const html = readFileSync(path, "utf8");
          assertCardinality(html, path, true);
          // progres should NOT have visible content-meta
          if (path.includes(`${join(dist, "progres")}`)) {
            assert.equal(html.includes('class="content-meta"'), false, "progres should not have visible last-modified");
          }
          // indexable pages with lastModified should have visible
          const isNoindex = /<meta[^>]+name="robots"[^>]+noindex/.test(html);
          const hasLastMod = html.includes('name="last-modified"');
          if (!isNoindex && hasLastMod) {
            // Should have visible time
            // Exception: offline.html maybe
            if (!path.endsWith("offline.html")) {
              assert.ok(html.includes('class="content-meta"'), `${path} should have visible last-modified`);
              assert.ok(/<time datetime="2026-08-26">/.test(html), `${path} time datetime should be 2026-08-26`);
            }
          }
        }
      }
    }
    walkDist(dist);
  });
});
