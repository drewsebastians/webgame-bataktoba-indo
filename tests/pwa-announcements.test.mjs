import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const modules = [
  "assets/js/app.js",
  "assets/js/flashcards-page.js",
  "assets/js/dictionary-page.js",
  "assets/js/progress-page.js",
];

const liveRegion = /role: "status", "aria-live": "polite", "aria-atomic": "true"/g;

test("PWA offline and update announcements expose polite atomic status regions", async () => {
  for (const path of modules) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    assert.equal([...source.matchAll(liveRegion)].length, 2, `${path} must mark update and offline banners as status live regions`);
    assert.match(source, /className: "app-banner offline-banner"/, `${path} must keep its offline announcement`);
  }
});
