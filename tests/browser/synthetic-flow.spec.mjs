import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
  SYNTHETIC_WEBGAME_ITEMS,
  SYNTHETIC_TOPICS,
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
  const continuation = page.locator("#next-question");
  await expect(continuation).toBeEnabled();
  await expect(continuation).toBeFocused();
  await continuation.click();
  if (await page.locator(".prompt-text").count()) {
    await expect(page.locator(".prompt-text")).toBeFocused();
  } else {
    await expect(page.locator("#session-summary-heading")).toBeFocused();
  }
  return prompt;
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
  await expect(page.locator(".prompt-text")).toBeFocused();

  await page.goto("/");
  const dailyPracticeLink = page.getByRole("link", { name: "Latihan Harian", exact: true });
  await expect(dailyPracticeLink).toHaveAttribute("href", "games/?practice=daily");
  await dailyPracticeLink.click();

  await page.waitForURL((url) => url.pathname === "/games/" && !url.searchParams.has("practice"));
  await expect(page.locator(".prompt-text")).toHaveText(dueItem.batak);
  await expect(page.locator(".prompt-text")).toBeFocused();
});

test("starting a quiz mode moves focus to its first question", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");

  for (const mode of ["reverse", "truefalse"]) {
    await page.locator(`.mode-button[data-mode="${mode}"]`).click();
    await expect(page.locator(".prompt-text")).toBeVisible();
    await expect(page.locator(".prompt-text")).toBeFocused();
  }
});

test("multiple-choice answers support arrow-key navigation before activation", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");

  const options = page.locator(".option");
  await expect(options).toHaveCount(4);
  await expect(page.getByRole("group", { name: "Pilihan jawaban" })).toBeVisible();
  await options.nth(0).focus();

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(options.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(options.nth(3)).toBeFocused();
  await expect(page.locator("#next-question")).toBeDisabled();
  await expect(options.nth(3)).toBeEnabled();

  await page.keyboard.press("Enter");
  const continuation = page.locator("#next-question");
  await expect(continuation).toBeEnabled();
  await expect(continuation).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".prompt-text")).toBeFocused();
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

  const deliberateMistakes = [];
  for (let index = 0; index < 5; index += 1) {
    const prompt = await answerMeaningQuestion(page, { wrong: index < 2 });
    if (index < 2) deliberateMistakes.push(prompt);
  }
  await expect(page.getByRole("heading", { name: "Sesi selesai" })).toBeVisible();
  await expect(page.locator("#review-mistakes")).toBeVisible();
  await page.locator("#review-mistakes").click();
  await expect(page.locator(".prompt-text")).toBeFocused();

  const firstReviewPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  expect(deliberateMistakes).toContain(firstReviewPrompt);
  const firstReviewItem = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === firstReviewPrompt);
  expect(firstReviewItem).toBeTruthy();
  await page.getByRole("button", { name: firstReviewItem.indonesia, exact: true }).click();
  const reviewContinuation = page.locator("#next-question");
  await expect(reviewContinuation).toBeEnabled();
  await expect(reviewContinuation).toBeFocused();
  await reviewContinuation.click();
  await expect(page.locator(".prompt-text")).toBeFocused();

  const secondReviewPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  expect(deliberateMistakes).toContain(secondReviewPrompt);
  expect(secondReviewPrompt).not.toBe(firstReviewPrompt);
  const secondReviewItem = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === secondReviewPrompt);
  expect(secondReviewItem).toBeTruthy();
  await page.getByRole("button", { name: secondReviewItem.indonesia, exact: true }).click();
  await expect(reviewContinuation).toBeEnabled();
  await expect(reviewContinuation).toBeFocused();
  await reviewContinuation.click();
  await expect(page.getByRole("heading", { name: "Review kesalahan selesai" })).toBeVisible();
  await expect(page.locator("#session-summary-heading")).toBeFocused();

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

test("flashcard topic and deck filters refresh counts without losing keyboard focus", async ({ page }) => {
  const splitAt = 3;
  const themedItems = SYNTHETIC_WEBGAME_ITEMS.map((item, index) => ({
    ...item,
    themes: [index < splitAt ? "angka" : "keluarga"],
  }));
  const itemIds = themedItems.map((item) => item.id);
  const topics = {
    ...SYNTHETIC_TOPICS,
    topics: [
      { ...SYNTHETIC_TOPICS.topics[0], itemIds: itemIds.slice(0, splitAt), poolItems: splitAt },
      {
        ...SYNTHETIC_TOPICS.topics[0],
        slug: "keluarga",
        title: "Synthetic Fixture Family Topic",
        itemIds: itemIds.slice(splitAt),
        poolItems: itemIds.length - splitAt,
      },
    ],
  };
  const payloads = {
    "word-pairs.json": { schemaVersion: 1, items: themedItems },
    "topics.json": topics,
  };
  await installSyntheticContentRoutes(page, payloads);

  await page.goto("/flashcards/");
  await expect(page.locator("#flashcard-toolbar .pill")).toHaveText("8 kartu");
  const theme = page.locator("#fc-theme");
  await theme.focus();
  await theme.selectOption("keluarga");
  await expect(page.locator("#fc-theme")).toBeFocused();
  await expect(page.locator("#flashcard-toolbar .pill")).toHaveText("5 kartu");
  await expect(page.locator("#flashcard-card")).toContainText(SYNTHETIC_WEBGAME_ITEMS[splitAt].batak);

  const filter = page.locator("#fc-filter");
  await filter.focus();
  await filter.selectOption("saved");
  await expect(page.locator("#fc-filter")).toBeFocused();
  await expect(page.locator("#flashcard-toolbar .pill")).toHaveText("0 kartu");

  await page.locator("#fc-shuffle").click();
  await expect(page.locator("#fc-shuffle")).toBeFocused();
  await expect(page.locator("#fc-shuffle")).toHaveAttribute("aria-pressed", "true");
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

test("mobile due flashcard review removes mastered cards and keeps focus on progress", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 375, height: 812 });
  const dueItems = SYNTHETIC_WEBGAME_ITEMS.slice(0, 2);
  await page.addInitScript(({ itemIds }) => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    const items = Object.fromEntries(itemIds.map((itemId) => [itemId, {
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
    }]));
    localStorage.setItem("batakTobaPlay.progress.v2", JSON.stringify({
      schemaVersion: 3,
      answered: 2,
      correct: 0,
      lastMode: "flashcards",
      items,
      sessions: [],
    }));
  }, { itemIds: dueItems.map((item) => item.id) });

  await page.goto("/flashcards/");
  await page.locator("#fc-filter").selectOption("due");
  const card = page.locator("#flashcard");
  await expect(card).toContainText(dueItems[0].batak);
  await expect(page.locator("#flashcard-card .pill").first()).toHaveText("1/2");

  await card.tap();
  await expect(page.locator("#flashcard")).toContainText(dueItems[0].indonesia);
  await page.getByRole("button", { name: "3 Benar", exact: true }).tap();
  await expect(page.locator("#flashcard")).toContainText(dueItems[1].batak);
  await expect(page.locator("#flashcard")).toBeFocused();
  await expect(page.locator("#flashcard-toolbar")).toContainText("1 kartu");

  await page.locator("#flashcard").tap();
  await page.getByRole("button", { name: "3 Benar", exact: true }).tap();
  const emptyState = page.locator("#flashcard-card [role='status']");
  await expect(emptyState).toContainText("Tidak ada kartu untuk filter ini");
  await expect(emptyState).toBeFocused();
  await expect(page.locator("#flashcard-toolbar")).toContainText("0 kartu");

  const scheduledItems = await page.evaluate((itemIds) => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return itemIds.map((itemId) => progress.items?.[itemId]);
  }, dueItems.map((item) => item.id));
  expect(scheduledItems).toHaveLength(2);
  for (const stats of scheduledItems) {
    expect(stats?.reviewStage).toBe(1);
    expect(stats?.nextReviewAt).toBeGreaterThan(Date.now());
  }
});

test("keyboard due review advances through wrong, difficult and correct ratings", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  const dueItems = SYNTHETIC_WEBGAME_ITEMS.slice(0, 3);
  await page.addInitScript(({ itemIds }) => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    const items = Object.fromEntries(itemIds.map((itemId) => [itemId, {
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
    }]));
    localStorage.setItem("batakTobaPlay.progress.v2", JSON.stringify({
      schemaVersion: 3,
      answered: 2,
      correct: 0,
      lastMode: "flashcards",
      items,
      sessions: [],
    }));
  }, { itemIds: dueItems.map((item) => item.id) });

  await page.goto("/flashcards/");
  await page.locator("#fc-filter").selectOption("due");
  const card = page.locator("#flashcard");
  await expect(card).toContainText(dueItems[0].batak);
  await card.focus();
  await page.keyboard.press("1");
  await expect(page.locator("#flashcard")).toContainText(dueItems[1].batak);
  await expect(page.locator("#flashcard")).toBeFocused();
  const afterWrong = await page.evaluate((itemId) => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return { answered: progress.answered, item: progress.items?.[itemId] };
  }, dueItems[0].id);
  expect(afterWrong.answered).toBe(3);
  expect(afterWrong.item?.lastResult).toBe("incorrect");

  await page.keyboard.press("2");
  await expect(page.locator("#flashcard")).toContainText(dueItems[2].batak);
  await expect(page.locator("#flashcard")).toBeFocused();
  const afterDifficult = await page.evaluate((itemId) => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return { answered: progress.answered, difficult: progress.items?.[itemId]?.difficult };
  }, dueItems[1].id);
  expect(afterDifficult).toEqual({ answered: 3, difficult: true });

  await page.keyboard.press("3");
  await expect(page.locator("#flashcard")).toContainText(dueItems[1].batak);
  await expect(page.locator("#flashcard-card .pill").first()).toHaveText("2/2");
  await expect(page.locator("#flashcard")).toBeFocused();
  await page.keyboard.press("3");
  await expect(page.locator("#flashcard")).toContainText(dueItems[0].batak);
  await expect(page.locator("#flashcard-card .pill").first()).toHaveText("1/1");
  await expect(page.locator("#flashcard")).toBeFocused();
  await page.keyboard.press("3");
  const emptyState = page.locator("#flashcard-card [role='status']");
  await expect(emptyState).toContainText("Tidak ada kartu untuk filter ini");
  await expect(emptyState).toBeFocused();
  await expect(page.locator("#flashcard-toolbar")).toContainText("0 kartu");
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

test("True/False continuation moves keyboard focus to the next prompt", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.locator('.session-size-button[data-size="5"]').click();
  await page.locator('.mode-button[data-mode="truefalse"]').click();

  const progress = page.getByRole("progressbar", { name: "Kemajuan sesi" });
  await expect(progress).toHaveAttribute("value", "1");
  await expect(page.locator(".prompt-text")).toContainText("SYNTHETIC_");

  await page.locator(".option").first().focus();
  await page.keyboard.press("Enter");
  const nextQuestion = page.locator("#next-question");
  await expect(nextQuestion).toBeEnabled();
  await expect(nextQuestion).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.locator(".prompt-text")).toBeFocused();
  await expect(progress).toHaveAttribute("value", "2");
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



test("mobile touch completes a five-question quiz and reviews a mistake at 320px", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/games/");
  await page.locator('.session-size-button[data-size="5"]').tap();

  const progress = page.getByRole("progressbar", { name: "Kemajuan sesi" });
  const assertNoHorizontalOverflow = async () => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  };

  await expect(progress).toHaveAttribute("max", "5");
  await expect(progress).toHaveAttribute("value", "1");
  await assertNoHorizontalOverflow();

  for (let index = 0; index < 5; index += 1) {
    const prompt = (await page.locator(".prompt-text").textContent())?.trim();
    const item = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === prompt);
    expect(item, `synthetic quiz prompt ${prompt}`).toBeTruthy();

    const visibleAnswers = (await page.locator(".option").allTextContents()).map((label) => label.trim());
    const answer = index === 0
      ? visibleAnswers.find((label) => label !== item.indonesia)
      : item.indonesia;
    expect(answer).toBeTruthy();
    await page.getByRole("button", { name: answer, exact: true }).tap();

    const continuation = page.locator("#next-question");
    await expect(continuation).toBeEnabled();
    await expect(progress).toHaveAttribute("value", String(index + 1));
    await assertNoHorizontalOverflow();

    if (index < 4) {
      await continuation.tap();
      await expect(page.locator(".prompt-text")).toBeVisible();
      await expect(progress).toHaveAttribute("value", String(index + 2));
      await assertNoHorizontalOverflow();
    } else {
      await continuation.tap();
    }
  }

  await expect(page.getByRole("heading", { name: "Sesi selesai" })).toBeVisible();
  const reviewMistakes = page.locator("#review-mistakes");
  await expect(reviewMistakes).toBeVisible();
  await reviewMistakes.tap();

  const reviewPrompt = (await page.locator(".prompt-text").textContent())?.trim();
  const reviewItem = SYNTHETIC_WEBGAME_ITEMS.find((entry) => entry.batak === reviewPrompt);
  expect(reviewItem, `synthetic review prompt ${reviewPrompt}`).toBeTruthy();
  await page.getByRole("button", { name: reviewItem.indonesia, exact: true }).tap();

  const reviewContinuation = page.locator("#next-question");
  await expect(reviewContinuation).toBeEnabled();
  await assertNoHorizontalOverflow();
  await reviewContinuation.tap();
  await expect(page.getByRole("heading", { name: "Review kesalahan selesai" })).toBeVisible();
  await assertNoHorizontalOverflow();
});
