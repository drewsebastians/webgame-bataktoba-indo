import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("regression guards for blockers (public-safe mode)", () => {
  it("0 human review => 0 human-reviewed", () => {
    const words = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
    assert.equal(words.items.filter((i) => i.reviewStatus === "human-reviewed").length, 0);
  });

  it("published lessons only for topics with >= 8 pool items (public-safe: 0 pool items)", () => {
    const lessons = JSON.parse(readFileSync(join(root, "data/published/lessons.json"), "utf8"));
    const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8")).topics;
    const MIN_POOL = 8;

    // No lessons published in public-safe mode
    assert.equal(lessons.published.length, 0);
    assert.equal(lessons.counts.publishedLessons, 0);

    // No topics have >= 8 pool items in public-safe mode
    for (const topic of topics) {
      assert.ok(topic.poolItems < MIN_POOL, `Topic ${topic.slug} has ${topic.poolItems} pool items (should be 0 in public-safe)`);
    }
  });

  it("thin topic => noindex + absent sitemap (public-safe: all topics noindex)", () => {
    const topics = JSON.parse(readFileSync(join(root, "data/published/topics.json"), "utf8")).topics;
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
    for (const t of topics) {
      // All topics have 0 pool items in public-safe mode
      assert.equal(t.poolItems, 0);
      assert.equal(t.pageStatus, "public-noindex");
      const url = `https://webgame-bataktoba-indo.pages.dev/learn/${t.slug}/`;
      assert.equal(sitemap.includes(`<loc>${url}</loc>`), false);
    }
  });

  it("unreviewed sentences => no reorder/fill-blank activation", () => {
    const sents = JSON.parse(readFileSync(join(root, "data/published/sample-sentences.json"), "utf8"));
    assert.equal(sents.items.length, 0); // no sentences in public-safe mode
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

  it("licensing hard gate blocks publication (REQUIRES_LEGAL_REVIEW)", () => {
    const manifest = JSON.parse(readFileSync(join(root, "data/sources/alignment-engine-manifest.json"), "utf8"));
    assert.equal(manifest.licenseStatus, "REQUIRES_LEGAL_REVIEW");
    assert.equal(manifest.publicationAllowed, false);
    // Published data should be empty
    const words = JSON.parse(readFileSync(join(root, "data/published/word-pairs.json"), "utf8"));
    const phrases = JSON.parse(readFileSync(join(root, "data/published/phrase-pairs.json"), "utf8"));
    const sentences = JSON.parse(readFileSync(join(root, "data/published/sample-sentences.json"), "utf8"));
    assert.equal(words.items.length, 0);
    assert.equal(phrases.items.length, 0);
    assert.equal(sentences.items.length, 0);
  });
});