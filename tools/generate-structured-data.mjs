import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { learningResource } from "./lib/learning-resource.mjs";

const root = join(fileURLToPath(new URL("../", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
const distLessons = join(root, "dist/data/published/lessons.json");

if (!existsSync(distLessons)) {
  console.error("Run npm run build first (dist/data/published/lessons.json missing).");
  process.exit(1);
}
const registry = JSON.parse(readFileSync(distLessons, "utf8"));
const out = {};
for (const lesson of registry.published ?? []) {
  const resource = learningResource(lesson, config.baseUrl);
  if (resource) out[lesson.slug] = resource;
}
const target = join(root, "dist/data/published/structured-data.json");
writeFileSync(target, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`structured-data.json written with ${Object.keys(out).length} published lesson(s).`);
