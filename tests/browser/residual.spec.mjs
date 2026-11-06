import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  SYNTHETIC_WEBGAME_ITEMS,
} from "./helpers/synthetic-content.mjs";

test.describe.configure({ mode: "serial" });

test("matching pairs is a distinct open-board mode", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Matching Pairs/ }).click();
  await expect(page.getByText(/\/6 cocok/)).toBeVisible();
  const cards = page.locator(".match-card");
  await expect(cards).toHaveCount(12);
  expect((await cards.first().textContent()).length).toBeGreaterThan(0);
});

test("starting Matching Pairs with the keyboard focuses the first playable card", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");

  const modeButton = page.getByRole("button", { name: /^Matching Pairs/ });
  await modeButton.focus();
  await page.keyboard.press("Enter");

  const firstCard = page.locator(".match-card:not(:disabled)").first();
  await expect(firstCard).toBeFocused();
  await expect(firstCard).toHaveAttribute("aria-pressed", "false");
});

test("matching cards expose selection state and restore keyboard focus through completion and reset", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Matching Pairs/ }).click();

  const cards = page.locator(".match-card");
  await expect(cards).toHaveCount(12);
  await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(0);

  const textToId = new Map(SYNTHETIC_WEBGAME_ITEMS.flatMap((item) => [
    [item.batak, item.id],
    [item.indonesia, item.id],
  ]));
  const groups = new Map();
  for (const [index, text] of (await cards.allTextContents()).entries()) {
    const id = textToId.get(text.trim());
    expect(typeof id).toBe("string");
    groups.set(id, [...(groups.get(id) ?? []), index]);
  }
  expect(groups.size).toBe(6);
  for (const indexes of groups.values()) expect(indexes).toHaveLength(2);

  const [firstGroup, secondGroup] = [...groups.values()];
  const firstMismatch = cards.nth(firstGroup[0]);
  const secondMismatch = cards.nth(secondGroup[0]);
  await firstMismatch.focus();
  await firstMismatch.press("Enter");
  await expect(firstMismatch).toHaveAttribute("aria-pressed", "true");
  await secondMismatch.press("Space");
  await expect(firstMismatch).toHaveAttribute("aria-pressed", "false");
  await expect(secondMismatch).toHaveAttribute("aria-pressed", "false");
  const focusAfterMismatch = page.locator(".match-card:focus:not(:disabled)");
  await expect(focusAfterMismatch).toHaveCount(1);
  await expect(focusAfterMismatch).toHaveAttribute("data-index", "0");

  const resolvedIndexes = new Set();
  let pairNumber = 0;
  for (const indexes of groups.values()) {
    const [firstIndex, secondIndex] = indexes;
    const first = cards.nth(firstIndex);
    await first.focus();
    await first.press("Enter");
    await expect(first).toHaveAttribute("aria-pressed", "true");

    // A selected card cannot be selected twice to create a false pair.
    await first.press("Enter");
    await expect(first).toHaveAttribute("aria-pressed", "true");

    const second = cards.nth(secondIndex);
    await second.focus();
    await second.press("Space");
    await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(0);
    resolvedIndexes.add(firstIndex);
    resolvedIndexes.add(secondIndex);
    pairNumber += 1;

    if (pairNumber < groups.size) {
      const nextIndex = Array.from({ length: 12 }, (_, index) => index)
        .find((index) => !resolvedIndexes.has(index));
      const focusedCard = page.locator(".match-card:focus:not(:disabled)");
      await expect(focusedCard).toHaveCount(1);
      await expect(focusedCard).toHaveAttribute("data-index", String(nextIndex));
    }
  }

  await expect(cards).toHaveCount(12);
  await expect(page.locator(".match-card:disabled")).toHaveCount(12);
  const newRound = page.locator("#new-matching");
  await expect(newRound).toBeFocused();
  await newRound.press("Enter");
  await expect(page.locator(".match-card:disabled")).toHaveCount(0);
  await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(0);
  const firstActiveCard = page.locator(".match-card:focus:not(:disabled)");
  await expect(firstActiveCard).toHaveCount(1);
  await expect(firstActiveCard).toHaveAttribute("data-index", "0");
});

test("memory game keeps cards face-down until revealed", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Memory/ }).click();
  await expect(page.locator(".match-card")).toHaveCount(12, { timeout: 10000 });
  expect(await page.locator(".match-card.face-down").count()).toBeGreaterThanOrEqual(10);
});

test("memory cards expose reveal state and restore keyboard focus through a round", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Memory/ }).click();

  const cards = page.locator(".match-card");
  await expect(cards).toHaveCount(12);
  await expect(cards.nth(0)).toHaveAccessibleName("Kartu 1 dari 12, tertutup");
  await expect(cards.nth(11)).toHaveAccessibleName("Kartu 12 dari 12, tertutup");
  const initialCardFocus = page.locator(".match-card:focus:not(:disabled)");
  await expect(initialCardFocus).toHaveAttribute("data-index", "0");
  await expect(page.locator(".match-card[aria-pressed='false']")).toHaveCount(12);
  await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(0);

  const textToId = new Map(SYNTHETIC_WEBGAME_ITEMS.flatMap((item) => [
    [item.batak, item.id],
    [item.indonesia, item.id],
  ]));
  const idsByIndex = new Map();
  const matchedIndexes = new Set();
  let focusMovementChecked = false;

  for (let index = 0; index < 12; index += 1) {
    const first = cards.nth(index);
    if (await first.isDisabled()) continue;

    await first.focus();
    await first.press("Enter");
    const firstId = textToId.get((await first.textContent()).trim());
    expect(typeof firstId).toBe("string");
    await expect(first).toHaveAccessibleName(new RegExp(`^Kartu ${index + 1} dari 12, .+`));
    idsByIndex.set(index, firstId);
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(first).not.toHaveClass(/face-down/);

    if (index === 0) {
      await first.press("Enter");
      await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(1);
    }

    let knownMateIndex = -1;
    for (const [candidateIndex, candidateId] of idsByIndex) {
      if (candidateIndex === index || candidateId !== firstId || matchedIndexes.has(candidateIndex)) continue;
      if (!(await cards.nth(candidateIndex).isDisabled())) {
        knownMateIndex = candidateIndex;
        break;
      }
    }

    let resolvedIndexes = [];
    let mismatchIndexes = [];
    if (knownMateIndex >= 0) {
      const second = cards.nth(knownMateIndex);
      await second.press("Space");
      await expect(first).toBeDisabled();
      await expect(second).toBeDisabled();
      resolvedIndexes = [index, knownMateIndex];
    } else {
      let unknownIndex = -1;
      for (let candidateIndex = 0; candidateIndex < 12; candidateIndex += 1) {
        if (candidateIndex === index || idsByIndex.has(candidateIndex) || matchedIndexes.has(candidateIndex)) continue;
        if (!(await cards.nth(candidateIndex).isDisabled())) {
          unknownIndex = candidateIndex;
          break;
        }
      }
      expect(unknownIndex).toBeGreaterThanOrEqual(0);

      const second = cards.nth(unknownIndex);
      await second.click();
      const secondId = textToId.get((await second.textContent()).trim());
      expect(typeof secondId).toBe("string");
      idsByIndex.set(unknownIndex, secondId);

      if (secondId === firstId) {
        await expect(first).toBeDisabled();
        await expect(second).toBeDisabled();
        resolvedIndexes = [index, unknownIndex];
      } else {
        mismatchIndexes = [index, unknownIndex];
        const expectedFocusIndex =
          Array.from({ length: 12 }, (_, candidateIndex) => candidateIndex)
            .find((candidateIndex) =>
              !matchedIndexes.has(candidateIndex) && !mismatchIndexes.includes(candidateIndex),
            ) ??
          Array.from({ length: 12 }, (_, candidateIndex) => candidateIndex)
            .find((candidateIndex) => !matchedIndexes.has(candidateIndex));
        await expect(first).toHaveAttribute("aria-pressed", "true");
        await expect(second).toHaveAttribute("aria-pressed", "true");
        const focusDuringMismatch = page.locator(".match-card:focus:not(:disabled)");
        await expect(focusDuringMismatch).toHaveAttribute("data-index", String(expectedFocusIndex));

        const shouldKeepMovedFocus = !focusMovementChecked;
        const movedFocusTarget = page.locator(".memory-size-button").first();
        if (shouldKeepMovedFocus) await movedFocusTarget.focus();

        await expect(first).toHaveAttribute("aria-pressed", "false", { timeout: 2000 });
        await expect(second).toHaveAttribute("aria-pressed", "false");
        await expect(first).toHaveAccessibleName(new RegExp(`^Kartu ${mismatchIndexes[0] + 1} dari 12, tertutup$`));
        await expect(second).toHaveAccessibleName(new RegExp(`^Kartu ${mismatchIndexes[1] + 1} dari 12, tertutup$`));
        await expect(first).toHaveClass(/face-down/);
        if (shouldKeepMovedFocus) {
          await expect(movedFocusTarget).toBeFocused();
          focusMovementChecked = true;
        } else {
          const focusAfterHide = page.locator(".match-card:focus:not(:disabled)");
          await expect(focusAfterHide).toHaveAttribute("data-index", String(expectedFocusIndex));
        }
      }
    }

    for (const resolvedIndex of resolvedIndexes) matchedIndexes.add(resolvedIndex);
    if (resolvedIndexes.length > 0 && matchedIndexes.size < 12) {
      const nextIndex = Array.from({ length: 12 }, (_, candidateIndex) => candidateIndex)
        .find((candidateIndex) => !matchedIndexes.has(candidateIndex));
      const focusedCard = page.locator(".match-card:focus:not(:disabled)");
      await expect(focusedCard).toHaveCount(1);
      await expect(focusedCard).toHaveAttribute("data-index", String(nextIndex));
    }
  }

  await expect(page.locator(".match-card:disabled")).toHaveCount(12);
  const newRound = page.locator("#new-memory");
  await expect(newRound).toBeFocused();
  await newRound.press("Enter");
  await expect(page.locator(".match-card:disabled")).toHaveCount(0);
  await expect(page.locator(".match-card[aria-pressed='true']")).toHaveCount(0);
  const firstActiveCard = page.locator(".match-card:focus:not(:disabled)");
  await expect(firstActiveCard).toHaveAttribute("data-index", "0");

  await page.locator(".memory-size-button").first().click();
  await expect(page.locator(".memory-size-button[aria-pressed='true']")).toBeFocused();
  await expect(page.locator(".match-card")).toHaveCount(8);
});

test("topic page stays honest when zero lessons are published", async ({ page }) => {
  await page.goto("/learn/sapaan/");
  await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  await expect(page.getByText(/Data belum bisa dimuat/)).toHaveCount(0);
  await expect(page.locator(".vocab-row")).toHaveCount(0);
});

test("dictionary highlight, direction filter, and practice action use only synthetic fixture", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/dictionary/");
  await page.locator("#dict-direction").selectOption("indonesia");
  await page.locator("#dictionary-search").fill("SYNTHETIC_ID_001");
  await expect(page.locator(".result-row mark").first()).toHaveText("SYNTHETIC_ID_001");

  await page.locator("#dict-review").selectOption("all");
  await expect(page.locator("#dict-difficulty")).toBeDisabled();

  await page.locator("#dict-direction").selectOption("both");
  await page.locator("#dictionary-search").fill("SYNTHETIC_BT_001");
  const row = page.locator(".result-row").first();
  await row.click();
  await expect(page.locator(".result-detail")).toBeVisible();
  await Promise.all([
    page.waitForURL("**/games/"),
    page.getByRole("button", { name: "Latihan kata ini", exact: true }).click(),
  ]);
  expect(page.url()).toContain("/games/");
  expect(SYNTHETIC_WEBGAME_ITEMS).toHaveLength(8);
});

test("production assets are revisioned and referenced", async ({ page }) => {
  await page.goto("/");
  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((script) => script.getAttribute("src")),
  );
  expect(scripts.find((src) => src.includes("assets/js/app."))).toMatch(/app\.[0-9a-f]{8}\.js$/);
  expect(scripts.some((src) => src.endsWith("/assets/js/app.js"))).toBe(false);
  await expect(page.locator("link[rel=stylesheet]")).toHaveAttribute("href", /styles\.[0-9a-f]{8}\.css$/);
});

test("og:image uses absolute production URL on every visited page", async ({ page }) => {
  for (const path of ["/", "/games/", "/learn/keluarga/"]) {
    await page.goto(path);
    const content = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(content.startsWith("https://webgame-bataktoba-indo.pages.dev/assets/icons/og-image.png")).toBe(true);
  }
});


test("mobile touch plays Matching Pairs and reveals Memory cards at 320px", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Matching Pairs/ }).tap();

  const cards = page.locator(".match-card");
  await expect(cards).toHaveCount(12);
  await expect(page.getByText(/\/6 cocok/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  const textToId = new Map(SYNTHETIC_WEBGAME_ITEMS.flatMap((item) => [
    [item.batak, item.id],
    [item.indonesia, item.id],
  ]));
  const groups = new Map();
  for (const [index, text] of (await cards.allTextContents()).entries()) {
    const itemId = textToId.get(text.trim());
    expect(typeof itemId).toBe("string");
    groups.set(itemId, [...(groups.get(itemId) ?? []), index]);
  }
  const [firstIndex, secondIndex] = [...groups.values()][0];
  const first = cards.nth(firstIndex);
  const second = cards.nth(secondIndex);
  await first.tap();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await second.tap();
  await expect(first).toBeDisabled();
  await expect(second).toBeDisabled();
  await expect(page.getByText(/1\/6 cocok/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await page.goto("/games/");
  await page.getByRole("button", { name: /^Memory/ }).tap();
  const memoryCard = page.locator(".match-card").first();
  await expect(memoryCard).toHaveClass(/face-down/);
  await memoryCard.tap();
  await expect(memoryCard).not.toHaveClass(/face-down/);
  await expect(memoryCard).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
