import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
describe("synthetic source fixture isolation", () => {
 const f=JSON.parse(readFileSync(join(process.cwd(),"tests/fixtures/source-synthetic-angka.json"),"utf8"));
 it("is explicitly test-only and makes no rights claim",()=>{assert.equal(f.sourceId,"synthetic-test-only");assert.equal(f.licenseStatus,"SYNTHETIC_TEST_ONLY");assert.equal(f.records.length,3);for(const [i,r] of f.records.entries()){assert.equal(r.batak,"SYNTHETIC_BT_"+String(i+1).padStart(3,"0"));assert.equal(r.indonesian,"SYNTHETIC_ID_"+String(i+1).padStart(3,"0"));}});
 it("keeps production pools empty and topic pages noindex",()=>{const t=JSON.parse(readFileSync(join(process.cwd(),"data/published/topics.json"),"utf8"));assert.equal(t.topics.find(x=>x.slug==="angka").indexability,"noindex,follow");for(const n of ["word-pairs.json","phrase-pairs.json","sample-sentences.json","learning-items.json"])assert.equal(JSON.parse(readFileSync(join(process.cwd(),"data/published",n),"utf8")).items.length,0);});
 it("uses deterministic ids and does not leak markers",()=>{const ids=f.records.map(x=>createHash("sha256").update(x.batak+"\x1f"+x.indonesian).digest("hex").slice(0,10));assert.equal(new Set(ids).size,3);const p=JSON.parse(readFileSync(join(process.cwd(),"data/published/word-pairs.json"),"utf8")),d=JSON.parse(readFileSync(join(process.cwd(),"dist/data/published/learning-items.json"),"utf8"));assert.equal(JSON.stringify(p).includes("SYNTHETIC_"),false);assert.equal(JSON.stringify(d).includes("SYNTHETIC_"),false);});
});
