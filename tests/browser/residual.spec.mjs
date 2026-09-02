import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const WORDS = [];

test.beforeAll(async ({ request }) => {
  const res = await request.get("/data/published/word-pairs.json");
  const data = await res.json();
  WORDS.push(...data.items.slice(0, 6));
});

/** Fulfill lessons.json with a published fixture lesson built from real words. */


test("matching pairs is a distinct open-board mode", async ({ page }) => {
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Matching Pairs/ }).click();
  await expect(page.getByText(/\/6 cocok/)).toBeVisible();
  const cards = page.locator(".match-card");
  await expect(cards).toHaveCount(12);
  // open board: texts visible without flipping
  const first = cards.nth(0);
  expect((await first.textContent()).length).toBeGreaterThan(0);
});

test("memory game keeps cards face-down until revealed", async ({ page }) => {
  await page.goto("/games/");
  await page.getByRole("button", { name: /^Memory/ }).click();
  await expect(page.locator(".match-card")).toHaveCount(12);
  const down = await page.locator(".match-card.face-down").count();
  expect(down).toBeGreaterThanOrEqual(10);
});

test("topic page stays honest when zero lessons are published", async ({ page }) => {
  // Use 'sapaan' which has 1 pool item and is not published
  await page.goto("/learn/sapaan/");
  await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  await expect(page.getByText(/Data belum bisa dimuat/)).toHaveCount(0);
  // corpus-derived words for themes with tags still render
  const rows = page.locator(".vocab-row");
  if ((await rows.count()) > 0) {
    await expect(rows.first()).toBeVisible();
  }
});


test("dictionary highlight, filters, practice action", async ({ page }) => {
  await page.goto("/dictionary/");
  await page.locator("#dictionary-search").fill("aek");
  await expect(page.locator(".result-row mark").first()).toHaveText(/aek/i);

  // review-status filter: corpus-derived items should show
  await page.locator("#dict-review").selectOption("corpus-derived");
  await expect(page.locator(".result-row").first()).toBeVisible();

  // difficulty filter exists but disabled while metadata is null
  await expect(page.locator("#dict-difficulty")).toBeDisabled();

  // practice action stores ids and navigates to games
  await page.locator("#dict-review").selectOption("all");
  await page.waitForTimeout(150);
  await page.locator(".result-row").first().click();
  await Promise.all([
    page.waitForURL("**/games/"),
    page.getByRole("button", { name: "Latihan kata ini", exact: true }).click(),
  ]);
  expect(page.url()).toContain("/games/");
});

test("production assets are revisioned and referenced", async ({ page }) => {
  await page.goto("/");
  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")),
  );
  const appScript = scripts.find((src) => src.includes("assets/js/app."));
  expect(appScript).toMatch(/app\.[0-9a-f]{8}\.js$/);
  expect(scripts.some((src) => src.endsWith("/assets/js/app.js"))).toBe(false);
  await expect(page.locator("link[rel=stylesheet]")).toHaveAttribute(
    "href",
    /styles\.[0-9a-f]{8}\.css$/,
  );
});

test("og:image uses absolute production URL on every visited page", async ({ page }) => {
  for (const path of ["/", "/games/", "/learn/keluarga/"]) {
    await page.goto(path);
    const content = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(content.startsWith("https://webgame-bataktoba-indo.pages.dev/assets/icons/og-image.png")).toBe(true);
  }
});
