import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
  SYNTHETIC_WEBGAME_ITEMS,
} from "./helpers/synthetic-content.mjs";

async function answerMeaningQuestion(page, { wrong = false } = {}) {
  const prompt = (await page.locator(".prompt-text").textContent())?.trim();
  const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
  expect(item, `quiz prompt ${prompt}`).toBeTruthy();
  const visibleAnswers = (await page.locator(".option").allTextContents()).map((label) => label.trim());
  const answer = wrong
    ? visibleAnswers.find((label) => label !== item.indonesia)
    : item.indonesia;
  expect(answer).toBeTruthy();
  await page.getByRole("button", { name: answer, exact: true }).click();
  await expect(page.locator("#next-question")).toBeEnabled();
  await page.locator("#next-question").click();
}

test("homepage daily practice link launches the due-first queue", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  const dueItem = SYNTHETIC_WEBGAME_ITEMS[2];
  await page.addInitScript(({ itemId }) => {
    const key = "batakTobaPlay.progress.v2";
    if (localStorage.getItem(key)) return;
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    localStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 3,
        answered: 1,
        correct: 0,
        lastMode: "meaning",
        items: {
          [itemId]: {
            seen: 1,
            correctCount: 0,
            incorrectCount: 1,
            consecutiveCorrect: 0,
            lastResult: "incorrect",
            lastReviewedAt: yesterday,
            nextReviewAt: yesterday,
            reviewStage: 0,
            bucket: "review",
            saved: false,
            difficult: false,
          },
        },
        sessions: [],
      }),
    );
  }, { itemId: dueItem.id });

  await page.goto("/");
  const dailyPracticeLink = page.getByRole("link", { name: "Latihan Harian", exact: true });
  await expect(dailyPracticeLink).toHaveAttribute("href", "games/?practice=daily");
  await dailyPracticeLink.click();

  await page.waitForURL((url) => url.pathname === "/games/" && !url.searchParams.has("practice"));
  await expect(page.locator(".prompt-text")).toHaveText(dueItem.batak);
});

test("five-minute lesson → quiz → mistake review → spaced repetition → dictionary", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await completeSyntheticLesson(page);

  await page.goto("/games/");
  await expect(page.locator(".prompt-text")).toBeVisible();
  await page.locator('.session-size-button[data-size="5"]').click();
  await expect(page.locator(".prompt-text")).toBeVisible();

  for (let index = 0; index < 5; index += 1) {
    await answerMeaningQuestion(page, { wrong: index === 0 });
  }
  await expect(page.getByRole("heading", { name: "Sesi selesai" })).toBeVisible();
  await expect(page.locator("#review-mistakes")).toBeVisible();
  await page.locator("#review-mistakes").click();

  const reviewPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  const reviewItem = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === reviewPrompt);
  expect(reviewItem).toBeTruthy();
  await page.getByRole("button", { name: reviewItem.indonesia, exact: true }).click();
  await expect(page.locator("#next-question")).toBeEnabled();
  await page.locator("#next-question").click();
  await expect(page.getByRole("heading", { name: "Review kesalahan selesai" })).toBeVisible();

  await page.goto("/flashcards/");
  await page.locator("#fc-filter").selectOption("all");
  const flashcard = page.locator("#flashcard-card");
  await expect(flashcard).toBeVisible();
  await expect(flashcard).toContainText("SYNTHETIC_BT_");
  await page.getByRole("button", { name: "3 Benar", exact: true }).click();
  const scheduled = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return Object.values(progress.items ?? {}).some((stats) =>
      stats.reviewStage > 0 && stats.nextReviewAt > Date.now(),
    );
  });
  expect(scheduled).toBe(true);

  await page.goto("/dictionary/");
  await page.locator("#dictionary-search").fill("SYNTHETIC_BT_001");
  const firstResult = page.locator(".result-row").first();
  await expect(firstResult).toContainText("SYNTHETIC_BT_001");
  await firstResult.click();
  await expect(page.locator(".result-detail")).toBeVisible();
});

test("keyboard, touch, 320px and desktop viewport cover the same synthetic quiz", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/games/");
  await expect(page.locator(".prompt-text")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await page.keyboard.press("1");
  await expect(page.locator("#next-question")).toBeEnabled();
  await page.locator(".session-size-button[data-size='5']").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".prompt-text")).toBeVisible();

  await page.locator(".option").first().tap();
  await expect(page.locator("#next-question")).toBeEnabled();

  await page.setViewportSize({ width: 1280, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});
