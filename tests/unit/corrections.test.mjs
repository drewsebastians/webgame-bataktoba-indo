import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { buildCorrectionUrl } = await import("../../assets/js/utils/corrections.js");
const { SITE_CONFIG } = await import("../../assets/js/config.js");

describe("correction workflow", () => {
  it("builds a valid prefilled GitHub issue URL", () => {
    const url = new URL(
      buildCorrectionUrl({
        itemId: "word-ab12cd34ef",
        batak: "panangko",
        indonesia: "pencuri",
        pagePath: "/dictionary/",
      }),
    );
    assert.equal(url.origin + url.pathname, SITE_CONFIG.repositoryIssuesUrl);
    assert.match(url.searchParams.get("title"), /word-ab12cd34ef/);
    const body = url.searchParams.get("body");
    assert.ok(body.includes("panangko"));
    assert.ok(body.includes("pencuri"));
    assert.ok(body.includes("/dictionary/"));
    assert.equal(url.searchParams.get("labels"), "correction");
  });

  it("safely escapes corpus text that contains URL-breaking characters", () => {
    const url = new URL(
      buildCorrectionUrl({
        itemId: "word-0000000001",
        batak: `kata "&?=#/`,
        indonesia: "arti\nmulti\nbaris",
        pagePath: "/dictionary/",
      }),
    );
    // URL parses -> encoding is intact; original values round-trip
    const body = url.searchParams.get("body");
    assert.ok(body.includes('kata "&?=#/'));
    assert.ok(body.includes("arti\nmulti\nbaris"));
  });

  it("dataDir points at the published layer only", () => {
    assert.match(SITE_CONFIG.dataDir, /published\/$/);
    assert.ok(!SITE_CONFIG.dataDir.includes("raw"));
    assert.ok(!SITE_CONFIG.dataDir.includes("candidates"));
  });
});
