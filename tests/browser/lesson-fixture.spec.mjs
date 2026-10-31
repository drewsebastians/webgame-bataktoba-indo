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

  test("synthetic fixture completes recognition, recall, mistake review, and summary", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await completeSyntheticLesson(page);

    const stored = await page.evaluate(() => JSON.parse(
      localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}",
    ));
    expect(stored.lessons?.angka?.completedAt).toBeTruthy();
    expect(Object.keys(stored.items ?? {})).toHaveLength(SYNTHETIC_WEBGAME_ITEMS.length);
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
