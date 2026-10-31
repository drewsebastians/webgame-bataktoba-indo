import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
const root = new URL("../../", import.meta.url);
function load(name) { return JSON.parse(readFileSync(new URL("data/published/" + name, root), "utf8")); }
const lessons=load("lessons.json"),topics=load("topics.json"),learning=new Map(load("learning-items.json").items.map(x=>[x.id,x]));
describe("public lesson registry",()=>{
 it("contains published entries only",()=>{assert.equal(lessons.drafts,undefined);for(const x of lessons.published)assert.equal(x.publicationStatus,"published");const s=JSON.stringify(lessons);assert.ok(!s.includes('"publicationStatus": "draft"'));assert.ok(!s.includes('"needs-review"'));assert.ok(!s.includes('"editorial-draft"'));});
 it("has no candidate or editorial draft snapshot",()=>{assert.equal(existsSync(new URL("data/candidates",root)),false);assert.equal(existsSync(new URL("content/curated/draft-vocabulary.json",root)),false);});
 it("topics reference only published item ids",()=>{for(const t of topics.topics){assert.ok(t.slug&&t.title);assert.ok(["public-indexable","public-noindex"].includes(t.pageStatus));for(const id of t.itemIds)assert.ok(learning.has(id));}});
 it("published lessons meet minimum pool size",()=>{for(const x of lessons.published){assert.ok(x.counts.poolItems>=lessons.minPoolItemsForPublication);for(const id of x.itemIds)assert.ok(learning.has(id));}});
});
