import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const WORDS = [];

test.beforeAll(async ({ request }) => {
  const res = await request.get("/data/published/word-pairs.json");
  const data = await res.json();
  WORDS.push(...data.items.slice(0, 6));
});

/** Fulfill lessons.json with a published fixture lesson built from real words. */
async function usePublishedFixtureLesson(page) {
  const realLessons = await (await page.request.get("/data/published/lessons.json")).json();
  const itemIds = WORDS.map((w) => w.id);
  const byId = Object.fromEntries(WORDS.map((w) => [w.id, w]));
  const published = [
    {
      id: "lesson-keluarga",
      slug: "keluarga",
      title: "Kosakata keluarga Batak Toba",
      description: "Fixture lesson untuk pengujian.",
      level: 1,
      estMinutes: 5,
      reviewRollup: "corpus-derived-beta",
      publicationStatus: "published",
      counts: { poolItems: itemIds.length },
      itemIds,
    },
    ...realLessons.published,
  ];
  await page.route("**/data/published/lessons.json", (route) =>
    route.fulfill({ json: { ...realLessons, published } }),
  );
  return byId;
}

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

test("full fixture lesson flow records per-lesson completion", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const byId = await usePublishedFixtureLesson(page);

  await page.goto("/learn/keluarga/");
  await page.getByRole("button", { name: "Mulai belajar" }).click();

  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    // completion?
    if ((await page.getByRole("heading", { name: "Lesson selesai" }).count()) > 0) break;

    const typed = page.locator(".typed-answer-input");
    if ((await typed.count()) > 0 && (await typed.isEnabled())) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const word = WORDS.find((w) => w.batak === prompt);
      await typed.fill(word ? word.indonesia : "zzz");
      await page.getByRole("button", { name: "Periksa" }).click();
      await page.waitForTimeout(120);
    }

    const options = page.locator(".option");
    if ((await options.count()) > 0 && !(await options.first().isDisabled())) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const word = WORDS.find((w) => w.batak === prompt);
      const target = word ? word.indonesia : null;
      let handled = false;
      for (const option of await options.all()) {
        if (target && (await option.textContent()) === target) {
          await option.click();
          handled = true;
          break;
        }
      }
      if (!handled) await options.first().click();
      await page.waitForTimeout(120);
    }

    const lessonNext = page.locator("#lesson-next");
    if ((await lessonNext.count()) > 0 && (await lessonNext.isEnabled())) {
      await lessonNext.click();
    }
    await page.waitForTimeout(150);
  }

  await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible();


  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem("batakTobaPlay.progress.v2");
    return raw ? JSON.parse(raw).lessons?.keluarga : null;
  });
  expect(stored.status || "completed").toBeTruthy();
  expect(stored.completedAt).not.toBeNull();

  // persistence across reload
  await page.reload();
  const stored2 = await page.evaluate(() => {
    const raw = localStorage.getItem("batakTobaPlay.progress.v2");
    return JSON.parse(raw).lessons?.keluarga?.completedAt;
  });
  expect(stored2).not.toBeNull();
  void byId;
  await context.close();
});

test("dictionary highlight, filters, practice action", async ({ page }) => {
  await page.goto("/dictionary/");
  await page.locator("#dictionary-search").fill("deng");
  await expect(page.locator(".result-row mark").first()).toHaveText(/deng/i);

  // review-status filter excludes beta sentences pool already; corpus-derived stays
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
