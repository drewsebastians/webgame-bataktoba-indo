import { SITE_CONFIG } from "./config.4b18e606.js";

const DATA_BASE = new URL(SITE_CONFIG.dataDir, import.meta.url);

const cache = new Map();

export async function loadDataset(name) {
  if (!cache.has(name)) {
    const response = await fetch(new URL(name, DATA_BASE));
    if (!response.ok) {
      throw new Error(`Gagal memuat ${name}`);
    }
    cache.set(name, response.json());
  }
  return cache.get(name);
}

/**
 * All loaders read ONLY the published data layer.
 * raw/candidates/reviewed layers are never fetched by the public app.
 */
export async function loadLearningItems() {
  return loadDataset("learning-items.json");
}

export async function loadWordPairs() {
  return loadDataset("word-pairs.json");
}

export async function loadPhrasePairs() {
  return loadDataset("phrase-pairs.json");
}

export async function loadSentences() {
  return loadDataset("sample-sentences.json");
}

export async function loadLessons() {
  return loadDataset("lessons.json");
}

export async function loadTopics() {
  return loadDataset("topics.json");
}
