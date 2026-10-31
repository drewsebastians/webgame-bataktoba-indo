import { expect } from "@playwright/test";

export const SYNTHETIC_TEST_ONLY = "SYNTHETIC_TEST_ONLY";

export const SYNTHETIC_WEBGAME_ITEMS = Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  const id = `word-${String(index + 1).padStart(10, "0")}`;
  return {
    id,
    type: "word",
    batak: `SYNTHETIC_BT_${number}`,
    indonesia: `SYNTHETIC_ID_${number}`,
    indonesianAlternatives: index === 0 ? ["SYNTHETIC_ID_ALT_001"] : [],
    batakAlternatives: [],
    senseId: `synthetic-sense-${number}`,
    themes: ["angka"],
    difficulty: null,
    quality: SYNTHETIC_TEST_ONLY,
    reviewStatus: "synthetic-test-only",
    sourceType: "synthetic-test-only",
  };
});

export const SYNTHETIC_LESSON = {
  slug: "angka",
  title: "Synthetic Fixture Lesson",
  description: "Synthetic test-only flow; these placeholders are not language content.",
  level: 1,
  estMinutes: 5,
  reviewRollup: SYNTHETIC_TEST_ONLY,
  publicationStatus: "published",
  counts: { poolItems: SYNTHETIC_WEBGAME_ITEMS.length },
  itemIds: SYNTHETIC_WEBGAME_ITEMS.map((item) => item.id),
};

export const SYNTHETIC_TOPICS = {
  schemaVersion: 2,
  topics: [{
    slug: "angka",
    title: "Synthetic Fixture Topic",
    description: "Synthetic test-only topic; not language content.",
    level: 1,
    poolItems: SYNTHETIC_WEBGAME_ITEMS.length,
    itemIds: SYNTHETIC_LESSON.itemIds,
    pageStatus: "public-indexable",
    indexability: "index,follow",
    publicationStatus: "published",
    reviewRollup: SYNTHETIC_TEST_ONLY,
  }],
};

export const SYNTHETIC_LESSONS = {
  schemaVersion: 2,
  published: [SYNTHETIC_LESSON],
  counts: { publishedLessons: 1, draftLessons: 0 },
};

const learningItems = { schemaVersion: 1, items: SYNTHETIC_WEBGAME_ITEMS };
const wordPairs = { schemaVersion: 1, items: SYNTHETIC_WEBGAME_ITEMS };
const sampleSentences = { schemaVersion: 1, items: [] };

const TEST_DATASETS = new Map([
  ["learning-items.json", learningItems],
  ["word-pairs.json", wordPairs],
  ["phrase-pairs.json", { schemaVersion: 1, items: [] }],
  ["sample-sentences.json", sampleSentences],
  ["lessons.json", SYNTHETIC_LESSONS],
  ["topics.json", SYNTHETIC_TOPICS],
]);

/** Intercept only published content URLs; fixture values never enter dist. */
export async function installSyntheticContentRoutes(page) {
  await page.route("**/data/published/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const filename = pathname.split("/").at(-1);
    const payload = TEST_DATASETS.get(filename);
    if (!payload) return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify(payload),
    });
  });
}

export async function completeSyntheticLesson(page, { introduceMistake = true } = {}) {
  await page.goto("/learn/angka/");
  await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
  await page.getByRole("button", { name: "Mulai belajar" }).click();

  for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
    const prompt = (await page.locator(".prompt-text").textContent())?.trim();
    const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
    expect(item, `synthetic lesson prompt ${prompt}`).toBeTruthy();
    const visibleAnswers = (await page.locator(".option").allTextContents()).map((label) => label.trim());
    const answer = introduceMistake && index === 0
      ? visibleAnswers.find((label) => label !== item.indonesia)
      : item.indonesia;
    expect(answer, "a visible non-answer option for the deliberate mistake").toBeTruthy();
    await page.getByRole("button", { name: answer, exact: true }).click();
    await expect(page.getByRole("button", { name: "Lanjut", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  }

  for (const item of SYNTHETIC_WEBGAME_ITEMS) {
    const input = page.locator(".typed-answer-input");
    await expect(input).toBeVisible();
    await input.fill(item.indonesia);
    await page.getByRole("button", { name: "Periksa", exact: true }).click();
    await expect(page.locator(".feedback").first()).toContainText("Benar");
    await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  }

  if (introduceMistake) {
    await expect(page.getByText("Review kesalahan")).toBeVisible();
    await expect(page.locator(".vocab-row")).toHaveCount(1);
    await page.getByRole("button", { name: "Lanjut ke ringkasan" }).click();
  }
  await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible();
}
