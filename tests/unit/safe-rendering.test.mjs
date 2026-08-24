import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const jsRoot = new URL("../../assets/js/", import.meta.url);
const modules = ["app.js", "data.js", "progress.js", "config.js", "utils/dom.js", "utils/normalize.js"];

describe("safe rendering foundation", () => {
  it("no module assigns corpus data through innerHTML or insertAdjacentHTML", () => {
    for (const name of modules) {
      const source = readFileSync(new URL(name, jsRoot), "utf8");
      assert.ok(
        !source.includes("innerHTML"),
        `${name} must not use innerHTML (corpus data is untrusted)`,
      );
      assert.ok(
        !source.includes("insertAdjacentHTML"),
        `${name} must not use insertAdjacentHTML`,
      );
      assert.ok(!source.includes("document.write"), `${name} must not use document.write`);
    }
  });

  it("feature flags default to off in central config", async () => {
    const { SITE_CONFIG } = await import("../../assets/js/config.js");
    assert.equal(SITE_CONFIG.features.analytics, false);
    assert.equal(SITE_CONFIG.features.ads, false);
    assert.ok(Object.isFrozen(SITE_CONFIG));
    assert.ok(Object.isFrozen(SITE_CONFIG.features));
  });

  it("config exposes a stable absoluteUrl builder", async () => {
    const { absoluteUrl } = await import("../../assets/js/config.js");
    assert.match(absoluteUrl("about/"), /^https:\/\/.+\/about\/$/);
    assert.match(absoluteUrl(), /\/$/);
  });

  it("dom helpers never interpret text as markup", async () => {
    const source = readFileSync(new URL("utils/dom.js", jsRoot), "utf8");
    assert.ok(source.includes("textContent"), "dom helper should set textContent for text");
    assert.ok(!source.includes(".html("), "dom helper must not delegate to jQuery-style html()");
  });
});
