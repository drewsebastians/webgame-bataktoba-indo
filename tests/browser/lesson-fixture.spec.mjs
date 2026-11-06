import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
  SYNTHETIC_WEBGAME_ITEMS,
} from "./helpers/synthetic-content.mjs";

test.describe("published lesson flow with isolated synthetic fixture", () => {
  test("production empty state stays honest without fixture data", async ({ page, request }) => {
    const words = await request.get("/data/published/word-pairs.json").then((response) => response.json());
    const lessons = await request.get("/data/published/lessons.json").then((response) => response.json());
    expect(words.items).toHaveLength(0);
    expect(lessons.published).toHaveLength(0);

    await page.goto("/learn/sapaan/");
    await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  });

  test("synthetic mistake review focuses its continuation control", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await completeSyntheticLesson(page, { stopAtMistakeReview: true });

    const continuation = page.locator("#lesson-next");
    await expect(continuation).toBeVisible();
    await expect(continuation).toBeFocused();
  });

  test("synthetic fixture completes recognition, recall, mistake review, and summary", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await completeSyntheticLesson(page);

    const stored = await page.evaluate(() => JSON.parse(
      localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}",
    ));
    expect(stored.lessons?.angka?.completedAt).toBeTruthy();
    expect(Object.keys(stored.items ?? {})).toHaveLength(SYNTHETIC_WEBGAME_ITEMS.length);
  });

  test("keyboard-only synthetic lesson completes recognition, recall, mistake review and summary", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/learn/angka/");

    const start = page.getByRole("button", { name: "Mulai belajar", exact: true });
    await expect(start).toBeVisible();
    await start.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".prompt-text")).toBeFocused();

    for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
      expect(item, `synthetic lesson prompt ${prompt}`).toBeTruthy();

      const options = page.locator(".option");
      const labels = (await options.allTextContents()).map((label) => label.trim());
      const chosen = index === 0
        ? labels.find((label) => label !== item.indonesia)
        : item.indonesia;
      const chosenIndex = labels.indexOf(chosen);
      expect(chosenIndex, "keyboard target must be a visible option").toBeGreaterThanOrEqual(0);

      await page.keyboard.press("Tab");
      await expect(options.first()).toBeFocused();
      for (let tab = 0; tab < chosenIndex; tab += 1) await page.keyboard.press("Tab");
      await expect(options.nth(chosenIndex)).toBeFocused();
      await page.keyboard.press("Enter");

      const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
      await expect(continuation).toBeEnabled();
      await expect(continuation).toBeFocused();
      await page.keyboard.press("Enter");
      if (index < SYNTHETIC_WEBGAME_ITEMS.length - 1) {
        await expect(page.locator(".prompt-text")).toBeFocused();
      } else {
        await expect(page.locator(".typed-answer-input")).toBeFocused();
      }
    }

    for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
      const item = SYNTHETIC_WEBGAME_ITEMS[index];
      const input = page.locator(".typed-answer-input");
      await expect(input).toBeFocused();
      await page.keyboard.type(item.indonesia);
      await page.keyboard.press("Tab");

      const check = page.getByRole("button", { name: "Periksa", exact: true });
      await expect(check).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator(".feedback").first()).toContainText("Benar");

      const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
      await expect(continuation).toBeFocused();
      await page.keyboard.press("Enter");
      if (index < SYNTHETIC_WEBGAME_ITEMS.length - 1) {
        await expect(page.locator(".typed-answer-input")).toBeFocused();
      }
    }

    await expect(page.getByText("Review kesalahan")).toBeVisible();
    await expect(page.locator(".vocab-row")).toHaveCount(1);
    const reviewContinuation = page.getByRole("button", { name: "Lanjut ke ringkasan", exact: true });
    await expect(reviewContinuation).toBeFocused();
    await page.keyboard.press("Enter");
    const summary = page.getByRole("heading", { name: "Lesson selesai" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
  });

  test("synthetic fixture never appears in the production published endpoint", async ({ request }) => {
    const [lessons, words] = await Promise.all([
      request.get("/data/published/lessons.json").then((response) => response.json()),
      request.get("/data/published/word-pairs.json").then((response) => response.json()),
    ]);
    expect(lessons.published).toHaveLength(0);
    expect(words.items).toHaveLength(0);
  });
});
