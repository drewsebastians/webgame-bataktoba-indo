const DATA_BASE = new URL("../../data/", import.meta.url);

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

export async function loadLearningItems() {
  return loadDataset("learning-items.json");
}

export async function loadWordPairs() {
  return loadDataset("word-pairs.json");
}

export async function loadSentences() {
  return loadDataset("sample-sentences.json");
}

