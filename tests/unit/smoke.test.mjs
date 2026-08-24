import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = new URL("../../", import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));

describe("project harness", () => {
  it("exposes the core npm scripts", () => {
    for (const script of ["build:data", "check", "test", "verify"]) {
      assert.ok(packageJson.scripts[script], `missing npm script: ${script}`);
    }
  });

  it("has zero runtime dependencies (static-first architecture)", () => {
    assert.equal(packageJson.dependencies, undefined);
  });
});

describe("browser modules import cleanly in Node", async () => {
  const data = await import("../../assets/js/data.js");

  it("data.js exports dataset loaders", () => {
    for (const loader of [
      "loadDataset",
      "loadLearningItems",
      "loadWordPairs",
      "loadPhrasePairs",
      "loadSentences",
    ]) {
      assert.equal(typeof data[loader], "function");
    }
  });

  it("progress.js exposes the progress API surface", async () => {
    const progress = await import("../../assets/js/progress.js");
    for (const fn of ["getProgress", "saveProgress", "recordAnswer", "markFlashcard"]) {
      assert.equal(typeof progress[fn], "function");
    }
  });
});
