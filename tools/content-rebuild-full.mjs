#!/usr/bin/env node
import { spawnSync } from "node:child_process";
console.log("content:rebuild-full: invoking historical full corpus rebuild (requires 1.6GB master DB) …");
const res = spawnSync("python", ["tools/build-learning-data.py"], { stdio: "inherit" });
if (res.status !== 0) {
  console.error("Full rebuild failed — see docs/DATA_REPRODUCIBILITY.md for DB requirements.");
  process.exit(res.status ?? 1);
}
console.log("content:rebuild-full: completed — run npm run build && npm run verify:release");
