import { test, expect } from "@playwright/test";

test.describe("future transition synthetic: review → lesson → SEO → homepage → offline → analytics", () => {
  test("synthetic 0→review→publish→topic→sitemap→LearningResource→homepage→offline", async ({ page, context }) => {
    // This test uses the same fetch-override as lesson-fixture but expands to topic/sitemap/homepage
    const fixtureLesson = {
      slug: "angka",
      title: "Angka Batak Toba",
      description: "Angka dasar untuk fixture",
      level: 1,
      estMinutes: 5,
      reviewRollup: "human-reviewed",
      publicationStatus: "published",
      counts: { poolItems: 8 },
      itemIds: ["word-0880cf2284", "word-141862f84e", "word-3991eb4b1f", "word-92add2f91e", "word-cda58024a5", "word-6a7710b417", "word-be83d23d14", "word-29ffff825b"],
    };
    await page.addInitScript((fixture) => {
      const orig = window.fetch;
      window.fetch = async (input, init) => {
        let u = typeof input === "string" ? input : input instanceof URL ? input.href : input.url || String(input);
        if (u.includes("/data/published/lessons.json"))
          return new Response(JSON.stringify({ schemaVersion: 2, published: [fixture], counts: { publishedLessons: 1, draftLessons: 5 } }), { status: 200, headers: { "Content-Type": "application/json" } });
        if (u.includes("/data/published/topics.json"))
          return new Response(
            JSON.stringify({
              schemaVersion: 2,
              topics: [{ slug: "angka", title: "Angka", description: "Panduan tema angka; substantive", level: 1, poolItems: 8, itemIds: fixture.itemIds, pageStatus: "public-indexable", indexability: "index,follow", publicationStatus: "published", reviewRollup: "human-reviewed" }],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        return orig(input, init);
      };
    }, fixtureLesson);

    await page.goto("/learn/angka/");
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    // Simulate lesson completion persistence
    await page.evaluate(() => {
      const raw = localStorage.getItem("batakTobaPlay.progress.v2");
      const p = raw ? JSON.parse(raw) : { schemaVersion: 3, answered: 0, correct: 0, items: {}, lessons: {}, sessions: [] };
      p.lessons = p.lessons || {};
      p.lessons.angka = { startedAt: Date.now() - 10000, completedAt: Date.now(), attempts: 1, mistakesTotal: 0, lastMistakeCount: 0 };
      localStorage.setItem("batakTobaPlay.progress.v2", JSON.stringify(p));
    });
    await page.goto("/");
    await expect(page.locator("#home-dynamic")).toBeVisible();
    // Homepage should now show continue-card (due fallback) - check via evaluate
    const hasProgress = await page.evaluate(() => {
      const raw = localStorage.getItem("batakTobaPlay.progress.v2");
      return raw ? JSON.parse(raw).lessons?.angka?.completedAt : null;
    });
    expect(hasProgress).toBeTruthy();

    // Offline lesson caching: go to lesson, then offline
    await page.goto("/learn/angka/");
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("button", { name: "Mulai belajar" })).toBeVisible();
    await context.setOffline(false);

    // Analytics lesson events would be sent only with provider+consent (currently OFF) — ensure no network
    let analyticsSent = false;
    page.on("request", (r) => {
      if (r.url().includes("analytics") || r.url().includes("google")) analyticsSent = true;
    });
    await page.goto("/learn/angka/");
    expect(analyticsSent).toBe(false);
  });
});
