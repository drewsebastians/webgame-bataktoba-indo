import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";

const root = process.cwd();
const PUBLISHED_DIR = join(root, "data", "published");

const requiredFiles = [
  "index.html",
  "games/index.html",
  "dictionary/index.html",
  "flashcards/index.html",
  "about/index.html",
  "contact/index.html",
  "privacy/index.html",
  "methodology/index.html",
  "data-source/index.html",
  "learn/index.html",
  "sitemap.xml",
  "robots.txt",
  "data/published/learning-items.json",
  "data/published/word-pairs.json",
  "data/published/phrase-pairs.json",
  "data/published/sample-sentences.json",
  "data/reports/data-quality-report.json",
  "data/migration/id-map.json",
];

const failures = [];
const warnings = [];

for (const file of requiredFiles) {
  try {
    statSync(join(root, file));
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

function walk(dir, callback) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (name === ".git" || name === "node_modules" || name === "dist" || name === "test-results") continue;
      walk(path, callback);
    } else {
      callback(path);
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

walk(root, (path) => {
  if (path.includes(`${root}\\data\\raw`) || path.includes(`${root}/data/raw`)) return;
  const ext = extname(path);
  if (![".html", ".js", ".css", ".json", ".xml", ".txt"].includes(ext)) return;
  const text = readFileSync(path, "utf8");
  if (text.includes('href="/') || text.includes('src="/')) {
    failures.push(`Root-absolute asset/link found in ${path}`);
  }
  if (ext === ".html") {
    checkHtmlReferences(path, text);
  }
});

function normalizeLabel(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function loadPublished(name, { required = true } = {}) {
  try {
    const payload = JSON.parse(readFileSync(join(PUBLISHED_DIR, name), "utf8"));
    if (!Array.isArray(payload.items)) {
      failures.push(`data/published/${name} must contain an items array.`);
      return { metadata: {}, items: [] };
    }
    if (!payload.metadata || typeof payload.metadata !== "object") {
      failures.push(`data/published/${name} must contain a metadata object.`);
    }
    return payload;
  } catch (error) {
    if (required) failures.push(`data/published/${name} could not be read: ${error.message}`);
    return { metadata: {}, items: [] };
  }
}

const wordsPayload = loadPublished("word-pairs.json");
const phrasesPayload = loadPublished("phrase-pairs.json");
const sentencesPayload = loadPublished("sample-sentences.json");
const learningPayload = loadPublished("learning-items.json");
const words = wordsPayload.items;
const phrases = phrasesPayload.items;
const sentences = sentencesPayload.items;
const learning = learningPayload.items;

// --- Schema version ---------------------------------------------------------
for (const [name, payload] of [
  ["word-pairs.json", wordsPayload],
  ["phrase-pairs.json", phrasesPayload],
  ["sample-sentences.json", sentencesPayload],
  ["learning-items.json", learningPayload],
]) {
  const version = payload.metadata?.schemaVersion ?? payload.items[0]?.schemaVersion;
  if (version !== 2) {
    failures.push(`data/published/${name} must declare schemaVersion 2 (got ${version}).`);
  }
}

// --- Learning items minimum -------------------------------------------------
if (learning.length < 100) {
  failures.push("published learning-items.json should contain at least 100 items.");
}

// --- Unique stable IDs across all published files ---------------------------
{
  const seen = new Map();
  for (const [fileName, items] of [
    ["word-pairs.json", words],
    ["phrase-pairs.json", phrases],
    ["sample-sentences.json", sentences],
  ]) {
    for (const item of items) {
      if (!item.id) {
        failures.push(`Item without id in published ${fileName}.`);
        continue;
      }
      if (seen.has(item.id)) {
        failures.push(
          `Stable id collision across published datasets: ${item.id} in ${seen.get(item.id)} and ${fileName}.`,
        );
      }
      seen.set(item.id, fileName);
    }
  }
  // learning-items must not introduce new ids beyond its source pools
  const poolIds = new Set([...words, ...phrases, ...sentences].map((item) => item.id));
  for (const item of learning) {
    if (!poolIds.has(item.id)) {
      failures.push(`learning-items.json contains item ${item.id} missing from its source pools.`);
      break;
    }
  }
}

// --- Honest review statuses --------------------------------------------------
{
  const allowedReviewStatus = new Set([
    "candidate",
    "corpus-derived",
    "machine-reviewed",
    "human-reviewed",
    "needs-revision",
    "beta-unreviewed",
  ]);
  const humanReviewedClaims = [];
  for (const item of [...words, ...phrases, ...sentences]) {
    if (!allowedReviewStatus.has(item.reviewStatus)) {
      failures.push(`Item ${item.id} has invalid reviewStatus "${item.reviewStatus}".`);
    }
    if (item.reviewStatus === "human-reviewed" && !item.reviewedBy) {
      humanReviewedClaims.push(item.id);
    }
  }
  if (humanReviewedClaims.length) {
    failures.push(
      `${humanReviewedClaims.length} items claim human-reviewed without reviewer attribution (first: ${humanReviewedClaims[0]}).`,
    );
  }
}

// --- Phrase token rule (hard) -----------------------------------------------
{
  const badPhrases = phrases.filter(
    (item) => normalizeLabel(item.batak).split(" ").length < 2 ||
      normalizeLabel(item.indonesia).split(" ").length < 2,
  );
  if (badPhrases.length > 0) {
    failures.push(
      `phrase rule violated: ${badPhrases.length} published phrases have fewer than two tokens (first: ${badPhrases[0].id}).`,
    );
  }
}

// --- Duplicate visible labels inside pools (hard) ---------------------------
for (const [fileName, items] of [
  ["word-pairs.json", words],
  ["phrase-pairs.json", phrases],
]) {
  for (const side of ["batak", "indonesia"]) {
    const values = items.map((item) => normalizeLabel(item[side]));
    const duplicates = values.length - new Set(values).size;
    if (duplicates > 0) {
      failures.push(
        `published ${fileName}: ${duplicates} duplicate normalized ${side} labels. Options would look identical.`,
      );
    }
  }
}

// --- Metadata counts match reality ------------------------------------------
for (const [name, payload] of [
  ["word-pairs.json", wordsPayload],
  ["phrase-pairs.json", phrasesPayload],
  ["sample-sentences.json", sentencesPayload],
  ["learning-items.json", learningPayload],
]) {
  const counts = payload.metadata?.counts ?? {};
  const expected =
    name === "word-pairs.json"
      ? counts.wordPairs
      : name === "phrase-pairs.json"
        ? counts.phrasePairs
        : name === "sample-sentences.json"
          ? counts.sampleSentences
          : counts.learningItems;
  if (expected !== payload.items.length) {
    failures.push(
      `metadata.counts mismatch in published ${name}: declared ${expected}, actual ${payload.items.length}.`,
    );
  }
}

// --- Draft leakage guard: published layer must be free of internal states ---
{
  const banned = ['"needs-review"', '"editorial-draft"'];
  walk(join(root, "data", "published"), (path) => {
    if (extname(path) !== ".json") return;
    const text = readFileSync(path, "utf8");
    for (const marker of banned) {
      if (text.includes(marker)) {
        failures.push(
          `Draft leakage: data/published/${path.split("published").pop()} contains internal status ${marker}.`,
        );
      }
    }
  });
}

// --- Quality report sanity ---------------------------------------------------
try {
  const report = JSON.parse(readFileSync(join(root, "data/reports/data-quality-report.json"), "utf8"));
  if (report.stageCounts?.wordPairs !== words.length) {
    failures.push("data-quality-report stageCounts.wordPairs does not match published word pool.");
  }
} catch (error) {
  failures.push(`data-quality-report.json unreadable: ${error.message}`);
}

// --- Per-page SEO basics -----------------------------------------------------
{
  const pages = [];
  walk(root, (path) => {
    if (extname(path) === ".html") pages.push(path);
  });
  const seenTitles = new Map();
  for (const page of pages) {
    const text = readFileSync(page, "utf8");
    // utility pages marked noindex are exempt from SEO meta requirements
    const isNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(text);
    if (isNoindex) continue;
    const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/);
    if (!titleMatch) {
      failures.push(`Missing <title> in ${page}`);
    } else {
      const title = titleMatch[1].trim();
      if (seenTitles.has(title)) {
        failures.push(`Duplicate <title> "${title}" in ${page} and ${seenTitles.get(title)}`);
      }
      seenTitles.set(title, page);
    }
    if (!/name="description"/.test(text)) {
      failures.push(`Missing meta description in ${page}`);
    }
    if (!/rel="canonical"/.test(text)) {
      failures.push(`Missing canonical link in ${page}`);
    }
    for (const required of [
      'property="og:title"',
      'property="og:description"',
      'property="og:url"',
      'property="og:image"',
      'name="twitter:card"',
    ]) {
      if (!text.includes(required)) {
        failures.push(`Missing social meta ${required} in ${page}`);
      }
    }
    const ogImage = text.match(/property="og:image" content="([^"]*)"/)?.[1];
    if (ogImage && !/^https:\/\//.test(ogImage)) {
      failures.push(`og:image must be an absolute URL in ${page}`);
    }
    for (const marker of [
      'rel="canonical"',
      'name="description"',
      'property="og:title"',
      'property="og:description"',
      'property="og:type"',
      'property="og:url"',
      'property="og:image"',
      'name="twitter:card"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:image"',
    ]) {
      const occurrences = text.split(marker).length - 1;
      if (occurrences !== 1) {
        failures.push(
          `${page}: expected exactly one ${marker}, found ${occurrences}`,
        );
      }
    }
    if (!/<html[^>]*\slang=/.test(text)) {
      failures.push(`Missing html lang attribute in ${page}`);
    }
  }
}

// --- Sitemap coverage (must exactly match indexable pages) ------------------
{
  const siteConfig = JSON.parse(readFileSync(join(root, "tools/site.config.json"), "utf8"));
  const sitemapText = readFileSync(join(root, "sitemap.xml"), "utf8");
  const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const pages = [];
  walk(root, (path) => {
    if (extname(path) === ".html" && path.endsWith(join("index.html"))) pages.push(path);
  });
  const expectedUrls = new Set(
    pages
      .filter((page) => !/name="robots"\s+content="[^"]*noindex/.test(readFileSync(page, "utf8")))
      .map((page) => {
        const relative = page.slice(root.length).replace(/index\.html$/, "").replace(/\\/g, "/");
        return new URL(relative, siteConfig.baseUrl).toString();
      }),
  );
  const sitemapSet = new Set(urls);
  for (const expected of expectedUrls) {
    if (!sitemapSet.has(expected)) failures.push(`Sitemap missing page: ${expected}`);
  }
  for (const url of urls) {
    if (!expectedUrls.has(url)) failures.push(`Sitemap has stale/unknown URL: ${url}`);
    const path = url.replace(/^https?:\/\/[^/]+\//, "");
    if (path) {
      const candidate = path.endsWith("/") ? join(root, path, "index.html") : join(root, path);
      const resolved = extname(candidate) ? candidate : join(candidate, "index.html");
      if (!existsSync(resolved)) {
        failures.push(`Sitemap URL does not map to a local page: ${url}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Site check passed: ${learning.length} published learning items ` +
    `(${words.length} words, ${phrases.length} genuine phrases, ${sentences.length} sentences), ` +
    `${warnings.length} warnings.`,
);
for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}
