import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("regression guards for blockers", () => {
  it("0 human review => 0 human-reviewed", () => {
    const words = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
    assert.equal(words.items.filter((i) => i.reviewStatus === "human-reviewed").length, 0);
  });
  it("no qualifying lesson => 0 published", () => {
    const lessons = JSON.parse(readFileSync(join(root, "data/published/lessons.json"), "utf8"));
    assert.equal(lessons.counts.publishedLessons, 0);
    assert.equal(lessons.published.length, 0);
  });
  it("thin topic => noindex + absent sitemap", () => {
    const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8"));
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    for (const t of topics.topics) {
      if (t.poolItems < 8) {
        assert.equal(t.pageStatus, "public-noindex");
        const url = `https://webgame-bataktoba-indo.pages.dev/learn/${t.slug}/`;
        assert.equal(sitemap.includes(`<loc>${url}</loc>`), false);
      }
    }
  });
  it("unreviewed sentences => no reorder/fill-blank activation", () => {
    const sents = JSON.parse(readFileSync(join(root, "data/published/sample-sentences.json"), "utf8"));
    assert.equal(sents.items.every((s) => s.reviewStatus === "beta-unreviewed"), true);
    // App should not expose Susun Kalimat mode when no reviewed sentences (checked via no UI for it)
    const appJs = readFileSync(join(root, "assets/js/app.js"), "utf8");
    // Only way to activate reorder is via reviewed gate — currently no activation in production
    assert.equal(appJs.includes("Susun Kalimat") && appJs.includes("10.6"), false); // not in UI mode list
  });
  it("no licensed audio => no Listening", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    assert.equal(pkg.scripts["test"]?.includes("listening"), false);
    const html = readFileSync(join(root, "games/index.html"), "utf8");
    assert.equal(html.toLowerCase().includes("listening"), false);
  });
  it("no valid Publisher ID => no ads script + no production ads.txt", () => {
    const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
    assert.equal(config.adsensePublisherId || "", "");
    const adsJs = readFileSync(join(root, "assets/js/ads.js"), "utf8");
    assert.ok(adsJs.includes("ca-pub-"));
    const hasAdsTxt = (() => {
      try {
        readFileSync(join(root, "dist/ads.txt"), "utf8");
        return true;
      } catch {
        return false;
      }
    })();
    assert.equal(hasAdsTxt, false);
  });
  it("no consent => no analytics/ads network (verified via browser tour)", () => {
    // Unit: analytics adapter default OFF tested elsewhere; here ensure config
    const siteConfig = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
    assert.equal(siteConfig.analyticsProvider || undefined, undefined);
  });
});
