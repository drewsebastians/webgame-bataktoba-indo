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

  await page.goto("/progres/");
  await expect(page.getByRole("status")).toContainText("1 materi siap untuk latihan harian.");
  const reviewLink = page.getByRole("link", { name: "Mulai latihan harian", exact: true });
  await expect(reviewLink).toHaveAttribute("href", "../games/?practice=daily");
  await reviewLink.click();

  await page.waitForURL((url) => url.pathname === "/games/" && !url.searchParams.has("practice"));
  await expect(page.locator(".prompt-text")).toHaveText(dueItem.batak);

  await page.goto("/");
  const dailyPracticeLink = page.getByRole("link", { name: "Latihan Harian", exact: true });
  await expect(dailyPracticeLink).toHaveAttribute("href", "games/?practice=daily");
  await dailyPracticeLink.click();

  await page.waitForURL((url) => url.pathname === "/games/" && !url.searchParams.has("practice"));
  await expect(page.locator(".prompt-text")).toHaveText(dueItem.batak);
});

test("game and lesson prompts render context notes as inert text", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");

  const context = page.locator(".prompt-context");
  await expect(context).toBeVisible();
  await expect(context).toContainText("Konteks");
  await expect(context).toContainText("SYNTHETIC_TEST_ONLY_CONTEXT");
  await expect(page.locator("#synthetic-context-probe")).toHaveCount(0);

  for (const mode of ["typed", "truefalse"]) {
    await page.locator(`.mode-button[data-mode="${mode}"]`).click();
    await expect(page.locator(".prompt-context")).toBeVisible();
    await expect(page.locator(".prompt-context")).toContainText("SYNTHETIC_TEST_ONLY_CONTEXT");
  }

  await page.goto("/learn/angka/");
  await page.getByRole("button", { name: "Mulai belajar" }).click();
  await expect(page.locator(".prompt-context")).toBeVisible();
  await expect(page.locator(".prompt-context")).toContainText("SYNTHETIC_TEST_ONLY_CONTEXT");
  await expect(page.locator("#synthetic-context-probe")).toHaveCount(0);
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

test("flashcard keyboard activation preserves focus and native rating buttons", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/flashcards/");
  await page.locator("#fc-filter").selectOption("all");

  const card = page.locator("#flashcard");
  await expect(card).toContainText("SYNTHETIC_BT_001");
  await card.focus();
  await page.keyboard.press("Space");

  const flippedCard = page.locator("#flashcard");
  await expect(flippedCard).toContainText("SYNTHETIC_ID_001");
  await expect(flippedCard).toBeFocused();

  const firstCardText = (await flippedCard.textContent())?.trim();
  const correctButton = page.getByRole("button", { name: "3 Benar", exact: true });
  await correctButton.focus();
  await page.keyboard.press("Space");

  await expect.poll(async () => page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return progress.answered;
  })).toBe(1);
  const nextCard = page.locator("#flashcard");
  await expect(nextCard).toBeFocused();
  await expect(nextCard).not.toHaveText(firstCardText ?? "");
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

test("keyboard-only five-question session reviews a deliberate mistake", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");

  const fiveQuestionSession = page.locator('.session-size-button[data-size="5"]');
  await fiveQuestionSession.focus();
  await page.keyboard.press("Enter");

  for (let index = 0; index < 5; index += 1) {
    const prompt = (await page.locator(".prompt-text").textContent())?.trim();
    const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
    expect(item, `synthetic quiz prompt ${prompt}`).toBeTruthy();

    const answers = (await page.locator(".option").allTextContents()).map((label) => label.trim());
    const answer = index === 0
      ? answers.find((label) => label !== item.indonesia)
      : item.indonesia;
    const answerIndex = answers.indexOf(answer);
    expect(answerIndex, "the keyboard answer key must map to a visible option").toBeGreaterThanOrEqual(0);

    await page.keyboard.press(String(answerIndex + 1));
    const nextQuestion = page.locator("#next-question");
    await expect(nextQuestion).toBeEnabled();
    await expect(nextQuestion).toBeFocused();
    await page.keyboard.press("Enter");
  }

  await expect(page.getByRole("heading", { name: "Sesi selesai" })).toBeVisible();
  await expect(page.locator("#session-summary-heading")).toBeFocused();
  const reviewMistakes = page.locator("#review-mistakes");
  await expect(reviewMistakes).toBeVisible();
  await reviewMistakes.focus();
  await page.keyboard.press("Enter");

  const reviewPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  const reviewItem = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === reviewPrompt);
  expect(reviewItem, `synthetic mistake-review prompt ${reviewPrompt}`).toBeTruthy();
  const reviewAnswers = (await page.locator(".option").allTextContents()).map((label) => label.trim());
  const reviewAnswerIndex = reviewAnswers.indexOf(reviewItem.indonesia);
  expect(reviewAnswerIndex).toBeGreaterThanOrEqual(0);

  await page.keyboard.press(String(reviewAnswerIndex + 1));
  const finishReview = page.locator("#next-question");
  await expect(finishReview).toBeEnabled();
  await expect(finishReview).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Review kesalahan selesai" })).toBeVisible();
  await expect(page.locator("#session-summary-heading")).toBeFocused();
});

test("fixed-length practice exposes accessible progress across quiz modes", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.locator('.session-size-button[data-size="5"]').click();

  for (const mode of ["meaning", "typed", "truefalse"]) {
    if (mode !== "meaning") await page.locator(".mode-button[data-mode=\"" + mode + "\"]").click();
    const progress = page.getByRole("progressbar", { name: "Kemajuan sesi" });
    await expect(progress).toHaveAttribute("max", "5");
    await expect(progress).toHaveAttribute("value", "1");
    await expect(progress).toHaveAttribute("aria-valuetext", "1 dari 5 soal");

    if (mode === "typed") {
      await page.locator(".typed-answer-input").fill("jawaban latihan");
      await page.keyboard.press("Enter");
    } else {
      await page.locator(".option").first().click();
    }
    await page.locator("#next-question").click();
    await expect(progress).toHaveAttribute("value", "2");
    await expect(progress).toHaveAttribute("aria-valuetext", "2 dari 5 soal");
  }
});

test("published lesson exposes accessible phase progress", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/learn/angka/");
  const progress = page.getByRole("progressbar", { name: "Kemajuan lesson" });
  await expect(progress).toBeVisible();
  await expect(progress).toHaveAttribute("max", "5");
  await expect(progress).toHaveAttribute("value", "1");
  await expect(progress).toHaveAttribute("aria-valuetext", "1 dari 5 langkah");
  await page.getByRole("button", { name: "Mulai belajar" }).click();
  await expect(progress).toHaveAttribute("value", "2");
  await expect(progress).toHaveAttribute("aria-valuetext", "2 dari 5 langkah");
});

test("lesson quiz moves keyboard focus to the next prompt", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/learn/angka/");
  await page.getByRole("button", { name: "Mulai belajar" }).click();

  const firstPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === firstPrompt);
  expect(item, `synthetic lesson prompt ${firstPrompt}`).toBeTruthy();

  await page.getByRole("button", { name: item.indonesia, exact: true }).focus();
  await page.keyboard.press("Enter");
  const next = page.locator("#lesson-next");
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.locator(".prompt-text")).not.toHaveText(firstPrompt);
  await expect(page.locator(".prompt-text")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".option").first()).toBeFocused();
});

test("mobile game targets keep a 44px minimum", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/games/");
  await expect(page.locator(".option").first()).toBeVisible();

  const assertVisibleTargetsMeetMinimum = async (selector) => {
    const targets = await page.locator(selector).evaluateAll((elements) =>
      elements
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        })
        .map((element) => ({
          classes: typeof element.className === "string" ? element.className : element.tagName,
          height: element.getBoundingClientRect().height,
        })),
    );

    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(target.height, `${target.classes} touch target height`).toBeGreaterThanOrEqual(44);
    }
    return targets;
  };

  const quizTargets = await assertVisibleTargetsMeetMinimum(".mode-button, .option, .button");
  expect(quizTargets.some((target) => target.classes.includes("option"))).toBe(true);

  await page.locator('.mode-button[data-mode="matching"]').click();
  await expect(page.locator(".match-card").first()).toBeVisible();
  const matchingTargets = await assertVisibleTargetsMeetMinimum(".mode-button, .match-card, .button");
  expect(matchingTargets.some((target) => target.classes.includes("match-card"))).toBe(true);
});

