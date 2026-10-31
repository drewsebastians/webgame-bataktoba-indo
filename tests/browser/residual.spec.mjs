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

test("memory game keeps cards face-down until revealed", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Memory/ }).click();
  await expect(page.locator(".match-card")).toHaveCount(12, { timeout: 10000 });
  expect(await page.locator(".match-card.face-down").count()).toBeGreaterThanOrEqual(10);
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
