import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
  SYNTHETIC_WEBGAME_ITEMS,
} from "./helpers/synthetic-content.mjs";

async function expectNoSeriousAccessibilityViolations(page) {
  const scan = await new AxeBuilder({ page }).analyze();
  const serious = scan.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious.map((violation) => `${violation.id}:${violation.nodes.length}`)).toEqual([]);
}

test.describe("published lesson flow with isolated synthetic fixture", () => {
  test("production empty state stays honest without fixture data", async ({ page, request }) => {
    const words = await request.get("/data/published/word-pairs.json").then((response) => response.json());
    const lessons = await request.get("/data/published/lessons.json").then((response) => response.json());
    const sentences = await request.get("/data/published/sample-sentences.json").then((response) => response.json());
    expect(words.items).toHaveLength(0);
    expect(lessons.published).toHaveLength(0);
    expect(sentences.items).toHaveLength(0);

    await page.goto("/learn/sapaan/");
    await expect(page.getByText(/belum terbit/i).first()).toBeVisible();

    await page.goto("/games/");
    await page.locator('.mode-button[data-mode="sentence"]').click();
    await expect(page.getByRole("alert")).toHaveText("Data soal belum tersedia untuk mode ini. Coba mode lain.");
  });

  test("synthetic lesson feedback, mistake review, and summary pass axe checks", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/learn/angka/");
    await page.getByRole("button", { name: "Mulai belajar", exact: true }).click();

    for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
      expect(item, `synthetic lesson prompt ${prompt}`).toBeTruthy();

      const labels = (await page.locator(".option").allTextContents()).map((label) => label.trim());
      const answer = index === 0
        ? labels.find((label) => label !== item.indonesia)
        : item.indonesia;
      expect(answer, "lesson answer must be a visible option").toBeTruthy();
      await page.getByRole("button", { name: answer, exact: true }).click();
      await expect(page.locator(".feedback").first()).not.toBeEmpty();
      if (index === 0) await expectNoSeriousAccessibilityViolations(page);

      const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
      await expect(continuation).toBeEnabled();
      await continuation.click();
      if (index < SYNTHETIC_WEBGAME_ITEMS.length - 1) {
        await expect(page.locator(".prompt-text")).toBeVisible();
      } else {
        await expect(page.locator(".typed-answer-input")).toBeVisible();
      }
    }

    for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
      const item = SYNTHETIC_WEBGAME_ITEMS[index];
      await page.locator(".typed-answer-input").fill(item.indonesia);
      await page.getByRole("button", { name: "Periksa", exact: true }).click();
      await expect(page.locator(".feedback").first()).toContainText("Benar");
      if (index === 0) await expectNoSeriousAccessibilityViolations(page);

      const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
      await expect(continuation).toBeEnabled();
      await continuation.click();
    }

    await expect(page.getByText("Review kesalahan")).toBeVisible();
    await expectNoSeriousAccessibilityViolations(page);
    await page.getByRole("button", { name: "Lanjut ke ringkasan", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible();
    await expectNoSeriousAccessibilityViolations(page);
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

test("320px touch lesson completes through mistake review and summary", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/learn/angka/");

  const start = page.getByRole("button", { name: "Mulai belajar", exact: true });
  await expect(start).toBeVisible();
  await start.tap();
  await expect(page.locator(".prompt-text")).toBeFocused();

  const assertNoHorizontalOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(dimensions.document, `horizontal overflow at ${dimensions.viewport}px`).toBeLessThanOrEqual(dimensions.viewport);
  };
  await assertNoHorizontalOverflow();

  for (let index = 0; index < SYNTHETIC_WEBGAME_ITEMS.length; index += 1) {
    const prompt = (await page.locator(".prompt-text").textContent())?.trim();
    const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
    expect(item, `synthetic lesson prompt ${prompt}`).toBeTruthy();

    const options = page.locator(".option");
    const labels = (await options.allTextContents()).map((label) => label.trim());
    const answer = index === 0
      ? labels.find((label) => label !== item.indonesia)
      : item.indonesia;
    expect(answer, "touch target must be a visible option").toBeTruthy();
    await page.getByRole("button", { name: answer, exact: true }).tap();

    const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
    await expect(continuation).toBeEnabled();
    await expect(continuation).toBeFocused();
    await continuation.tap();
    await assertNoHorizontalOverflow();
  }

  for (const item of SYNTHETIC_WEBGAME_ITEMS) {
    const input = page.locator(".typed-answer-input");
    await expect(input).toBeVisible();
    await input.tap();
    await input.fill(item.indonesia);
    await page.getByRole("button", { name: "Periksa", exact: true }).tap();
    await expect(page.locator(".feedback").first()).toContainText("Benar");

    const continuation = page.getByRole("button", { name: "Lanjut", exact: true });
    await expect(continuation).toBeFocused();
    await continuation.tap();
    await assertNoHorizontalOverflow();
  }

  await expect(page.getByText("Review kesalahan")).toBeVisible();
  await expect(page.locator(".vocab-row")).toHaveCount(1);
  await assertNoHorizontalOverflow();
  await page.getByRole("button", { name: "Lanjut ke ringkasan", exact: true }).tap();
  await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeFocused();
  await assertNoHorizontalOverflow();
});
