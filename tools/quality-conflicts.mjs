#!/usr/bin/env node
import { loadPublishedWords } from "./lib/review-lib.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)));

const words = loadPublishedWords().items;

console.log("quality:conflicts");

// Exact duplicates
const seen = new Map();
let exactDupes = 0;
for (const w of words) {
  const key = `${w.batak}|${w.indonesia}`;
  if (hasOwnProperty.call(seen, key)) {
    exactDupes++;
  } else {
    seen.set(key, 1);
  }
}
console.log(`Exact duplicate pairs: ${exactDupes}`);

// Normalized duplicates
const normSeen = new Map();
let normDupes = 0;
for (const w of words) {
  const key = `${w.batak.toLowerCase()}|${w.indonesia.toLowerCase()}`;
  if (normSeen.has(key)) {
    normDupes++;
  } else {
    normSeen.set(key, 1);
  }
}
console.log(`Normalized duplicate pairs: ${normDupes}`);

// Conflicts: same Batak -> different Indonesian
const batakMap = new Map();
for (const w of words) {
  if (!batakMap.has(w.batak)) batakMap.set(w.batak, []);
  batakMap.get(w.batak).push(w.indonesia);
}
let batakConflicts = 0;
for (const [batak, indos] of batakMap) {
  const unique = new Set(indos);
  if (unique.size > 1) batakConflicts++;
}
console.log(`Same Batak -> different Indonesian: ${batakConflicts}`);

// Same Indonesian -> different Batak
const indoMap = new Map();
for (const w of words) {
  if (!indoMap.has(w.indonesia)) indoMap.set(w.indonesia, []);
  indoMap.get(w.indonesia).push(w.batak);
}
let indoConflicts = 0;
for (const [indo, bataks] of indoMap) {
  const unique = new Set(bataks);
  if (unique.size > 1) indoConflicts++;
}
console.log(`Same Indonesian -> different Batak: ${indoConflicts}`);

// Stable ID collisions
const idMap = new Map();
let idCollisions = 0;
for (const w of words) {
  if (idMap.has(w.id)) idCollisions++;
  else idMap.set(w.id, 1);
}
console.log(`Stable ID collisions: ${idCollisions}`);

// Items with alternatives that could cause confusion
let altConflicts = 0;
for (const w of words) {
  const alts = [...(w.indonesianAlternatives || []), ...(w.batakAlternatives || [])];
  if (alts.length > 0) altConflicts++;
}
console.log(`Items with recorded alternatives: ${altConflicts}`);