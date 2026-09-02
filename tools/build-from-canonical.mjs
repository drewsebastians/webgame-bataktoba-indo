#!/usr/bin/env node
/**
 * Build learning data from canonical corpus with quality gates.
 * Replaces the old Python build script with canonical-source pipeline.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { qualifyWord, qualifyPhrase, qualifySentence } from "./quality-gate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const ARTIFACTS_DIR = join(REPO_ROOT, "artifacts", "canonical-corpus");
const DATA_DIR = join(REPO_ROOT, "data");
const CONTENT_DIR = join(REPO_ROOT, "content");

const SCHEMA_VERSION = 2;
const MIN_LESSON_POOL_ITEMS = 8;

function utcNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function normalizeLabel(value) {
  if (!value) return "";
  return String(value).toLowerCase().trim().replace(/\s+/g, " ");
}

function tokenizeLabel(value) {
  const normalized = normalizeLabel(value);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function loadContent(name) {
  const path = join(CONTENT_DIR, name);
  if (!existsSync(path)) {
    throw new Error(`Missing content file: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function applyThemeTags(items, themeKeywords) {
  let tagged = 0;
  for (const item of items) {
    const batakLabel = normalizeLabel(item.batak);
    const indonesiaLabel = normalizeLabel(item.indonesia);
    const tags = new Set();
    for (const [themeId, entry] of Object.entries(themeKeywords)) {
      const keywordsBatak = new Set(entry.batak?.map(normalizeLabel) || []);
      const keywordsIndo = new Set(entry.indonesia?.map(normalizeLabel) || []);
      if (keywordsBatak.has(batakLabel) || keywordsIndo.has(indonesiaLabel)) {
        tags.add(themeId);
      }
    }
    item.themes = [...tags].sort();
    if (tags.size > 0) tagged++;
  }
  return tagged;
}

function buildLessonRegistry(publishedWords, publishedPhrases, curated) {
  const pool = [...publishedWords, ...publishedPhrases];
  const byTheme = {};
  for (const item of pool) {
    for (const theme of item.themes || []) {
      byTheme[theme] = byTheme[theme] || [];
      byTheme[theme].push(item);
    }
  }

  const publishedLessons = [];
  const draftLessons = [];
  const internalDraftSupplements = [];
  const existingPairs = new Set(pool.map(i => `${normalizeLabel(i.batak)}|${normalizeLabel(i.indonesia)}`));

  for (const [themeId, entry] of Object.entries(curated.lessons)) {
    const themeItems = byTheme[themeId] || [];
    const supplements = [];
    let skippedSupplements = 0;

    for (const s of curated.themes[themeId] || []) {
      const pairKey = `${normalizeLabel(s.batak)}|${normalizeLabel(s.indonesia)}`;
      if (existingPairs.has(pairKey)) {
        skippedSupplements++;
        continue;
      }
      supplements.push({
        lessonSlug: themeId,
        batak: s.batak,
        indonesia: s.indonesia,
        reviewStatus: "needs-review",
        sourceType: "editorial-draft",
      });
      internalDraftSupplements.push(supplements[supplements.length - 1]);
    }

    const isPublished = themeItems.length >= MIN_LESSON_POOL_ITEMS;

    const statuses = new Set(themeItems.map(i => i.reviewStatus || "corpus-derived"));
    let rollup;
    if (!statuses.size) rollup = "no-pool-items";
    else if (statuses.size === 1 && statuses.has("human-reviewed")) rollup = "human-reviewed";
    else rollup = "corpus-derived-beta";

    const lesson = {
      id: `lesson-${themeId}`,
      slug: themeId,
      title: entry.title,
      description: entry.description,
      theme: themeId,
      level: entry.level || 1,
      estMinutes: Math.max(3, Math.min(10, Math.floor((themeItems.length + 5) / 5))),
      itemIds: themeItems.map(i => i.id),
      counts: {
        poolItems: themeItems.length,
        supplementItems: supplements.length,
        supplementSkippedAlreadyInPool: skippedSupplements,
      },
      reviewRollup: rollup,
      publicationStatus: isPublished ? "published" : "draft",
      generatedAt: utcNow(),
    };

    if (isPublished) publishedLessons.push(lesson);
    else draftLessons.push(lesson);
  }

  const publicRegistry = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    minPoolItemsForPublication: MIN_LESSON_POOL_ITEMS,
    note: "Published lessons only. Draft definitions live in data/candidates/lesson-drafts.json (internal editorial input); public topic pages are driven by topics.json.",
    published: publishedLessons,
    counts: { publishedLessons: publishedLessons.length, draftLessons: draftLessons.length },
  };

  const internalDrafts = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    reviewStatusNote: "All entries are needs-review editorial inputs; never publish or render publicly.",
    supplements: internalDraftSupplements,
    draftLessons,
  };

  return { publicRegistry, internalDrafts };
}

function buildTopicsRegistry(publishedWords, publishedPhrases, lessonDefs) {
  const themeItemsMap = {};
  for (const item of [...publishedWords, ...publishedPhrases]) {
    for (const theme of item.themes || []) {
      themeItemsMap[theme] = themeItemsMap[theme] || [];
      themeItemsMap[theme].push(item.id);
    }
  }

  const topics = [];
  for (const [slug, entry] of Object.entries(lessonDefs.lessons)) {
    const ids = [...new Set(themeItemsMap[slug] || [])].sort();
    topics.push({
      slug,
      title: entry.title,
      description: entry.description,
      level: entry.level || 1,
      poolItems: ids.length,
      itemIds: ids,
      pageStatus: ids.length >= MIN_LESSON_POOL_ITEMS ? "public-indexable" : "public-noindex",
      indexability: ids.length >= MIN_LESSON_POOL_ITEMS ? "index" : "noindex,follow",
      reviewRollup: "corpus-derived-beta",
    });
  }
  return { schemaVersion: SCHEMA_VERSION, topics };
}

function writeJson(path, payload) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

function main() {
  // Licensing hard gate — allow internal build, block publication
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, "data/sources/alignment-engine-manifest.json"), "utf8"));
  const isInternalBuild = process.argv.includes("--internal") || process.env.INTERNAL_BUILD === "true";
  if (manifest.licenseStatus === "REQUIRES_LEGAL_REVIEW" || manifest.publicationAllowed === false) {
    if (!isInternalBuild) {
      console.error("build-from-canonical blocked — upstream license REQUIRES_LEGAL_REVIEW, publicationAllowed=false");
      console.error("Resolve licensing (see docs/CORPUS_LICENSING_STATUS.md) before publishing.");
      console.error("For internal validation only, use: node tools/build-from-canonical.mjs --internal");
      process.exit(1);
    }
    console.warn("License check: UPSTREAM REQUIRES_LEGAL_REVIEW — building for INTERNAL VALIDATION ONLY, not for publication.");
  }

  // Load canonical recomputation data
  const fullRecompute = JSON.parse(readFileSync(join(ARTIFACTS_DIR, "full-recompute.json"), "utf8"));

  const wordCandidates = fullRecompute.publishedWords;
  const phraseCandidates = fullRecompute.publishedPhrases;
  const sentenceCandidates = fullRecompute.publishedSentences;

  // Apply quality gates
  console.log("Applying quality gates...");
  const wordResults = wordCandidates.map(w => qualifyWord(w, wordCandidates));
  const phraseResults = phraseCandidates.map(p => qualifyPhrase(p, phraseCandidates));
  const sentenceResults = sentenceCandidates.map(s => qualifySentence(s, sentenceCandidates));

  const qualifiedWords = wordCandidates.filter((_, i) => wordResults[i].status === "source-evidence-qualified");
  const qualifiedPhrases = phraseCandidates.filter((_, i) => phraseResults[i].status === "source-evidence-qualified");
  const qualifiedSentences = sentenceCandidates.filter((_, i) => sentenceResults[i].status === "source-evidence-qualified");

  const conflictedWords = wordCandidates.filter((_, i) => wordResults[i].status === "source-evidence-conflicted");
  const conflictedPhrases = phraseCandidates.filter((_, i) => phraseResults[i].status === "source-evidence-conflicted");
  const conflictedSentences = sentenceCandidates.filter((_, i) => sentenceResults[i].status === "source-evidence-conflicted");

  const insufficientWords = wordCandidates.filter((_, i) => wordResults[i].status === "evidence-insufficient");
  const insufficientPhrases = phraseCandidates.filter((_, i) => phraseResults[i].status === "evidence-insufficient");
  const insufficientSentences = sentenceCandidates.filter((_, i) => sentenceResults[i].status === "evidence-insufficient");

  console.log(`Words: ${qualifiedWords.length} qualified, ${conflictedWords.length} conflicted, ${insufficientWords.length} insufficient`);
  console.log(`Phrases: ${qualifiedPhrases.length} qualified, ${conflictedPhrases.length} conflicted, ${insufficientPhrases.length} insufficient`);
  console.log(`Sentences: ${qualifiedSentences.length} qualified, ${conflictedSentences.length} conflicted, ${insufficientSentences.length} insufficient`);

  // Only qualified items go to published
  const publishedWords = qualifiedWords.map(w => ({ ...w, publicationStatus: "published" }));
  const publishedPhrases = qualifiedPhrases.map(p => ({ ...p, publicationStatus: "published" }));
  const publishedSentences = qualifiedSentences.map(s => ({ ...s, publicationStatus: "published" }));

  // Theme tagging
  const themeKeywords = loadContent("themes/keywords.json").themes;
  const taggedCount = applyThemeTags([...publishedWords, ...publishedPhrases], themeKeywords);
  console.log(`Theme tags applied to ${taggedCount} items.`);

  // Lesson registry
  const lessonDefs = loadContent("lessons.json");
  const curatedDrafts = loadContent("curated/draft-vocabulary.json");
  const { publicRegistry, internalDrafts } = buildLessonRegistry(publishedWords, publishedPhrases, {
    ...lessonDefs,
    themes: curatedDrafts.themes,
  });

  // Topics registry
  const topicsRegistry = buildTopicsRegistry(publishedWords, publishedPhrases, lessonDefs);

  // Metadata
  const counts = {
    rawWords: fullRecompute.stageCounts.rawWords,
    rawPhrases: fullRecompute.stageCounts.rawPhrases,
    rawSentences: fullRecompute.stageCounts.rawSentences,
    wordCandidates: wordCandidates.length,
    phraseCandidates: phraseCandidates.length,
    sentenceCandidates: sentenceCandidates.length,
    wordPairs: publishedWords.length,
    phrasePairs: publishedPhrases.length,
    sampleSentences: publishedSentences.length,
    learningItems: publishedWords.length + publishedPhrases.length + publishedSentences.length,
    qualifiedWords: qualifiedWords.length,
    qualifiedPhrases: qualifiedPhrases.length,
    qualifiedSentences: qualifiedSentences.length,
    conflictedWords: conflictedWords.length,
    conflictedPhrases: conflictedPhrases.length,
    conflictedSentences: conflictedSentences.length,
    insufficientWords: insufficientWords.length,
    insufficientPhrases: insufficientPhrases.length,
    insufficientSentences: insufficientSentences.length,
  };

  const metadata = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    sourceRepository: "https://github.com/drewsebastians/batak-indo-alignment-engine",
    sourceFiles: ["batak_alignment_canonical.sqlite"],
    sourceSha256: "3a34a54ddbe23d9d7368a03dd9bf903b2ce8e2c7a222dd2f67af7e99e8434238",
    counts,
    filtering: [
      "Source: batak_alignment_canonical.sqlite (1.69GB, SHA 3a34a54ddbe2)",
      "Quality gate: source-evidence-v2 with tier-based thresholds",
      "Words: high_confidence>=0.85, medium_confidence>=0.70, min 2 distinct source tables",
      "Phrases: high_confidence>=0.75, medium_confidence>=0.60, >=2 tokens per side",
      "Sentences: high_confidence>=0.70, medium_confidence>=0.55, min 5 cooccurrence",
      "Conflict detection: competing translations within 0.15 (words), 0.20 (phrases) margin",
      "Alternatives preserved as polysemy, not treated as conflicts",
    ],
    editorialNotes: [
      "Confidence is a statistical signal, not a linguistic guarantee.",
      "All word data is corpus-derived; no item claims human review.",
      "Sentence subset is beta-unreviewed parallel-corpus material.",
      "Phrases must have at least two meaningful tokens per side.",
      "Licensing: REQUIRES_LEGAL_REVIEW - publicationAllowed: false",
    ],
    qualityPolicyVersion: "source-evidence-v2",
    qualityReport: {
      words: { qualified: qualifiedWords.length, conflicted: conflictedWords.length, insufficient: insufficientWords.length },
      phrases: { qualified: qualifiedPhrases.length, conflicted: conflictedPhrases.length, insufficient: insufficientPhrases.length },
      sentences: { qualified: qualifiedSentences.length, conflicted: conflictedSentences.length, insufficient: insufficientSentences.length },
    },
  };

  // Write outputs
  writeJson(join(DATA_DIR, "published", "word-pairs.json"), { metadata, items: publishedWords });
  writeJson(join(DATA_DIR, "published", "phrase-pairs.json"), { metadata, items: publishedPhrases });
  writeJson(join(DATA_DIR, "published", "sample-sentences.json"), { metadata, items: publishedSentences });
  writeJson(join(DATA_DIR, "published", "learning-items.json"), { metadata, items: [...publishedWords, ...publishedPhrases, ...publishedSentences] });
  writeJson(join(DATA_DIR, "published", "lessons.json"), publicRegistry);
  writeJson(join(DATA_DIR, "candidates", "lesson-drafts.json"), internalDrafts);
  writeJson(join(DATA_DIR, "published", "topics.json"), topicsRegistry);

  // Quality status report
  const qualityStatus = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    qualityPolicyVersion: "source-evidence-v2",
    canonicalSource: "batak_alignment_canonical.sqlite (SHA 3a34a54ddbe2)",
    totals: {
      wordCandidates: wordCandidates.length,
      phraseCandidates: phraseCandidates.length,
      sentenceCandidates: sentenceCandidates.length,
      publishedWords: publishedWords.length,
      publishedPhrases: publishedPhrases.length,
      publishedSentences: publishedSentences.length,
    },
    qualityGateResults: {
      words: { qualified: qualifiedWords.length, conflicted: conflictedWords.length, insufficient: insufficientWords.length },
      phrases: { qualified: qualifiedPhrases.length, conflicted: conflictedPhrases.length, insufficient: insufficientPhrases.length },
      sentences: { qualified: qualifiedSentences.length, conflicted: conflictedSentences.length, insufficient: insufficientSentences.length },
    },
    conflictDetails: {
      words: conflictedWords.map(w => ({ id: w.id, batak: w.batak, indonesia: w.indonesia, conflicts: wordResults[wordCandidates.indexOf(w)].conflicts })),
      phrases: conflictedPhrases.map(p => ({ id: p.id, batak: p.batak, indonesia: p.indonesia, conflicts: phraseResults[phraseCandidates.indexOf(p)].conflicts })),
      sentences: conflictedSentences.map(s => ({ id: s.id, batak: s.batak, indonesia: s.indonesia, conflicts: sentenceResults[sentenceCandidates.indexOf(s)].conflicts })),
    },
  };
  writeJson(join(DATA_DIR, "reports", "quality-status.json"), qualityStatus);

  // data-quality-report.json (for check-site.mjs compatibility)
  const qualityReport = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    stageCounts: {
      rawWordRows: fullRecompute.stageCounts.rawWords,
      rawPhraseRows: fullRecompute.stageCounts.rawPhrases,
      rawSentenceRows: fullRecompute.stageCounts.rawSentences,
      wordCandidates: wordCandidates.length,
      phraseCandidates: phraseCandidates.length,
      sentenceCandidates: sentenceCandidates.length,
      wordPairs: publishedWords.length,
      phrasePairs: publishedPhrases.length,
      sampleSentences: publishedSentences.length,
      learningItems: publishedWords.length + publishedPhrases.length + publishedSentences.length,
      publishedLessons: publicRegistry.published.length,
      draftLessons: publicRegistry.counts.draftLessons,
    },
    excludedByReason: {
      "evidence-insufficient": insufficientWords.length + insufficientPhrases.length + insufficientSentences.length,
      "source-evidence-conflicted": conflictedWords.length + conflictedPhrases.length + conflictedSentences.length,
    },
    mergedDuplicateLabels: [],
    phraseRejections: {},
    notes: [
      `Canonical corpus: batak_alignment_canonical.sqlite (SHA 3a34a54ddbe2)`,
      `Quality gate: source-evidence-v2 tier-based`,
      `Words: ${qualifiedWords.length} qualified, ${conflictedWords.length} conflicted, ${insufficientWords.length} insufficient`,
      `Phrases: ${qualifiedPhrases.length} qualified, ${conflictedPhrases.length} conflicted, ${insufficientPhrases.length} insufficient`,
      `Sentences: ${qualifiedSentences.length} qualified, ${conflictedSentences.length} conflicted, ${insufficientSentences.length} insufficient`,
      `Theme tags applied to ${taggedCount} items.`,
    ],
    migration: { mapped: 0, unmapped: 0 },
  };
  writeJson(join(DATA_DIR, "reports", "data-quality-report.json"), qualityReport);

  // Also write gaps report
  const gaps = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    themes: {},
  };
  for (const [themeId, themeEntry] of Object.entries(lessonDefs.lessons)) {
    const topicItems = [...publishedWords, ...publishedPhrases].filter(i => (i.themes || []).includes(themeId));
    const needed = MIN_LESSON_POOL_ITEMS;
    gaps.themes[themeId] = {
      title: themeEntry.title,
      poolItems: topicItems.length,
      needed: needed,
      shortfall: Math.max(0, needed - topicItems.length),
      publishable: topicItems.length >= needed,
      itemIds: topicItems.map(i => i.id),
    };
  }
  writeJson(join(DATA_DIR, "reports", "quality-gaps.json"), gaps);

  // Conflict report
  const conflicts = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: utcNow(),
    items: [
      ...conflictedWords.map(w => ({ ...w, type: "word" })),
      ...conflictedPhrases.map(p => ({ ...p, type: "phrase" })),
      ...conflictedSentences.map(s => ({ ...s, type: "sentence" })),
    ],
  };
  writeJson(join(DATA_DIR, "reports", "quality-conflicts.json"), conflicts);

  console.log("Build complete.");
  console.log(JSON.stringify(counts, null, 2));
}

main();