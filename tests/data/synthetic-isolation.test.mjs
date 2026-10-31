import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const distRoot = join(repoRoot, "dist");
const textExtensions = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".webmanifest"]);
const forbiddenFixtureMarkers = [
  "SYNTHETIC_TEST_ONLY",
  "SYNTHETIC_BT_",
  "SYNTHETIC_ID_",
  "synthetic-test-only",
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (textExtensions.has(extname(entry.name))) files.push(target);
  }
  return files;
}

test("synthetic test fixture markers never appear in public dist", async () => {
  const files = await walk(distRoot);
  const leaked = [];
  for (const file of files) {
    const body = await readFile(file, "utf8");
    for (const marker of forbiddenFixtureMarkers) {
      if (body.includes(marker)) leaked.push(`${file}:${marker}`);
    }
  }
  assert.deepEqual(leaked, []);
});
