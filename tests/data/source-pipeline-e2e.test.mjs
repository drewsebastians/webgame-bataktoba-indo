import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const root=process.cwd(),file=join(root,"tests/fixtures/source-synthetic-angka.json"),fixture=JSON.parse(readFileSync(file,"utf8"));
function blocked(script,...args){return spawnSync(process.execPath,[script,...args],{cwd:root,encoding:"utf8"});}
describe("public corpus workflows fail closed",()=>{
 it("synthetic fixture carries no rights claim or real translation",()=>{assert.equal(fixture.licenseStatus,"SYNTHETIC_TEST_ONLY");for(const r of fixture.records){assert.match(r.batak,/^SYNTHETIC_BT_\d{3}$/);assert.match(r.indonesian,/^SYNTHETIC_ID_\d{3}$/);}assert.equal(JSON.stringify(fixture).includes("human-reviewed"),false);});
 it("blocks import, review import, canonical build, and publication",()=>{for(const s of ["tools/source-import.mjs","tools/review-import.mjs","tools/content-publish.mjs","tools/build-from-canonical.mjs"]){const x=blocked(s,file,"--apply");assert.equal(x.status,2,s+" should fail closed");assert.match(x.stderr,/restricted to the private Data Engine/);}for(const p of ["data/sources/ingested","data/candidates","data/reports"])assert.equal(existsSync(join(root,p)),false);});
 it("leaves public data and lesson threshold unchanged",()=>{const t=JSON.parse(readFileSync(join(root,"data/published/topics.json"),"utf8")).topics;assert.equal(t.find(x=>x.slug==="angka").poolItems,0);assert.equal(JSON.parse(readFileSync(join(root,"data/published/lessons.json"),"utf8")).published.length,0);});
});
