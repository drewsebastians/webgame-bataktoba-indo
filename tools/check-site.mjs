import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "games/index.html",
  "dictionary/index.html",
  "flashcards/index.html",
  "about/index.html",
  "methodology/index.html",
  "data-source/index.html",
  "learn/index.html",
  "sitemap.xml",
  "robots.txt",
  "data/learning-items.json",
  "data/word-pairs.json",
  "data/sample-sentences.json",
];

const failures = [];

for (const file of requiredFiles) {
  try {
    statSync(join(root, file));
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(path);
    } else if ([".html", ".js", ".css", ".json", ".xml", ".txt"].includes(extname(path))) {
      const text = readFileSync(path, "utf8");
      if (text.includes("href=\"/") || text.includes("src=\"/")) {
        failures.push(`Root-absolute asset/link found in ${path}`);
      }
      if (extname(path) === ".html") {
        checkHtmlReferences(path, text);
      }
    }
  }
}

function checkHtmlReferences(path, text) {
  const referencePattern = /\b(?:href|src)="([^"]+)"/g;
  for (const match of text.matchAll(referencePattern)) {
    const value = match[1];
    if (
      value.startsWith("http:") ||
      value.startsWith("https:") ||
      value.startsWith("mailto:") ||
      value.startsWith("#")
    ) {
      continue;
    }
    const withoutHash = value.split("#")[0];
    if (!withoutHash) continue;
    let target = normalize(join(dirname(path), withoutHash));
    if (value.endsWith("/")) {
      target = join(target, "index.html");
    }
    if (!extname(target) && !existsSync(target)) {
      target = join(target, "index.html");
    }
    if (!existsSync(target)) {
      failures.push(`Broken local reference in ${path}: ${value}`);
    }
  }
}

walk(root);

const learning = JSON.parse(readFileSync(join(root, "data/learning-items.json"), "utf8"));
if (!Array.isArray(learning.items) || learning.items.length < 100) {
  failures.push("learning-items.json should contain at least 100 items.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Site check passed with ${learning.items.length} learning items.`);
