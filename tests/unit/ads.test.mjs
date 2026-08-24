import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);

describe("ads readiness", () => {
  it("no HTML page still contains an ad placeholder", async () => {
    const { readdirSync, statSync } = await import("node:fs");
    const offenders = [];
    function walk(url) {
      const base = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
      for (const name of readdirSync(url)) {
        const path = new URL(`${base}${name}`, url);
        if (statSync(path).isDirectory()) {
          if (name === ".git" || name === "node_modules") continue;
          walk(path);
        } else if (name.endsWith(".html")) {
          if (readFileSync(path, "utf8").includes("ad-slot")) {
            offenders.push(decodeURIComponent(path.pathname));
          }
        }
      }
    }
    walk(root);
    assert.deepEqual(offenders, []);
  });

  it("css no longer renders the placeholder text", () => {
    const css = readFileSync(new URL("assets/css/styles.css", root), "utf8");
    assert.ok(!css.includes("Ruang iklan"));
    assert.ok(!css.includes(".ad-slot"));
  });

  it("ads module is inert without publisher id and consent", async () => {
    const { adsActive, mountAd } = await import(`../../assets/js/ads.js?ts=${Date.now()}`);
    assert.equal(adsActive(), false);
    // mountAd on a fake container removes it instead of creating a slot
    const fake = { remove() { this.removed = true; }, removed: false, append() {} };
    const slot = mountAd(fake);
    assert.equal(slot, null);
    assert.equal(fake.removed, true);
  });

  it("ads.txt.example exists but real ads.txt is not deployed yet", () => {
    assert.ok(readFileSync(new URL("ads.txt.example", root)).length > 0);
    let exists = true;
    try {
      readFileSync(new URL("ads.txt", root));
    } catch {
      exists = false;
    }
    assert.equal(exists, false, "real ads.txt must only appear with a valid publisher ID");
  });
});
