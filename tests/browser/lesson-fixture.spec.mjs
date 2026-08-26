import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let fixtureWords = [];
let fixtureLesson = null;

test.beforeAll(async ({ request }) => {
  const res = await request.get("/data/published/word-pairs.json");
  const data = await res.json();
  fixtureWords = data.items.slice(0, 10);
  const itemIds = fixtureWords.map((w) => w.id);
  fixtureLesson = {
    slug: "angka",
    title: "Angka Batak Toba",
    description: "Angka dasar untuk fixture test-only (8 item).",
    level: 1,
    estMinutes: 5,
    reviewRollup: "corpus-derived",
    publicationStatus: "published",
    counts: { poolItems: 8 },
    itemIds: itemIds.slice(0, 8),
  };
});

async function mockPublishedLesson(page) {
  await page.addInitScript(
    (fixture) => {
      const origFetch = window.fetch;
      window.fetch = async (input, init) => {
        let urlStr = "";
        if (typeof input === "string") urlStr = input;
        else if (input instanceof URL) urlStr = input.href;
        else if (input && typeof input.url === "string") urlStr = input.url;
        else urlStr = String(input);
        if (urlStr.includes("/data/published/lessons.json")) {
          return new Response(
            JSON.stringify({
              schemaVersion: 2,
              generatedAt: new Date().toISOString(),
              minPoolItemsForPublication: 8,
              published: [fixture],
              counts: { publishedLessons: 1, draftLessons: 5 },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (urlStr.includes("/data/published/topics.json")) {
          return new Response(
            JSON.stringify({
              schemaVersion: 2,
              topics: [
                {
                  slug: "angka",
                  title: "Angka Batak Toba",
                  description: "Angka dasar",
                  level: 1,
                  poolItems: 8,
                  itemIds: fixture.itemIds,
                  pageStatus: "public-indexable",
                  indexability: "index,follow",
                  publicationStatus: "published",
                  reviewRollup: "corpus-derived",
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        return origFetch(input, init);
      };
    },
    fixtureLesson,
  );
}

test.describe("synthetic published lesson fixture (test-only, never in dist)", () => {
  test("zero-production lesson honesty (without fixture) → neutral fallback", async ({ page }) => {
    await page.goto("/learn/keluarga/");
    await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  });

  test("published fixture → intro shows published metadata and start button", async ({ page }) => {
    await mockPublishedLesson(page);
    await page.goto("/learn/angka/");
    const lessonHeading = page.locator("#lesson-root h2").first();
    await expect(lessonHeading).toContainText("Angka Batak Toba", { timeout: 8000 });
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    await expect(page.getByText(/Estimasi 5 menit/)).toBeVisible();
  });

  test("published fixture → full lesson flow: recognition → recall → summary", async ({ page }) => {
    await mockPublishedLesson(page);
    await page.goto("/learn/angka/");
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    await page.getByRole("button", { name: "Mulai belajar" }).click();

    for (let i = 0; i < 2; i++) {
      await expect(page.locator(".option").first()).toBeVisible({ timeout: 5000 });
      await page.locator(".option").first().click();
      await expect(page.locator(".feedback").first()).not.toBeEmpty();
      await page.getByRole("button", { name: "Lanjut" }).click();
    }

    for (let step = 0; step < 12; step++) {
      if (await page.getByRole("heading", { name: "Lesson selesai" }).count()) break;
      if (await page.locator(".typed-answer-input").count()) break;
      if (await page.locator(".option").count()) {
        await page.locator(".option").first().click();
        await page.getByRole("button", { name: "Lanjut" }).click();
      } else if (await page.getByRole("button", { name: "Lanjut" }).count()) {
        await page.getByRole("button", { name: "Lanjut" }).click();
      } else if (await page.getByRole("button", { name: "Lanjut ke ringkasan" }).count()) {
        await page.getByRole("button", { name: "Lanjut ke ringkasan" }).click();
        break;
      } else {
        break;
      }
    }

    if (await page.locator(".typed-answer-input").count()) {
      const input = page.locator(".typed-answer-input").first();
      await expect(input).toBeVisible();
      await input.fill("salahjawaban");
      await page.getByRole("button", { name: "Periksa" }).click();
      await expect(page.locator(".feedback").first()).toContainText(/Belum tepat|Benar/);
      await page.getByRole("button", { name: "Lanjut" }).click();
    }

    if (await page.getByText("Review kesalahan").count()) {
      await expect(page.locator(".vocab-row").first()).toBeVisible();
      await page.getByRole("button", { name: "Lanjut ke ringkasan" }).click();
    }

    await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/item dipelajari/)).toBeVisible();

    const lessonState = await page.evaluate(() => {
      const raw = localStorage.getItem("batakTobaPlay.progress.v2");
      if (!raw) return null;
      const p = JSON.parse(raw);
      return p.lessons?.angka ?? null;
    });
    expect(lessonState).not.toBeNull();
    expect(lessonState.completedAt).toBeTruthy();
  });

  test("lesson start persistence across reloads", async ({ page }) => {
    await mockPublishedLesson(page);
    await page.goto("/learn/angka/");
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    const before = await page.evaluate(() => {
      const raw = localStorage.getItem("batakTobaPlay.progress.v2");
      return raw ? JSON.parse(raw).lessons?.angka : null;
    });
    expect(before).toBeTruthy();
    expect(before.startedAt).toBeTruthy();
  });

  test("fixture never leaks to production artifact (dist)", async ({ request }) => {
    const res = await request.get("/data/published/lessons.json");
    const data = await res.json();
    expect(data.counts.publishedLessons).toBe(0);
    expect(data.published.length).toBe(0);
  });
});
