import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 250)));
page.on("requestfailed", (r) => console.log("REQFAIL", r.url().slice(-60), r.failure()?.errorText));
await page.route("**/data/published/lessons.json", async (route) => {
  console.log("ROUTE HIT lessons.json");
  const real = await route.fetch();
  const json = await real.json();
  json.published = [
    {
      id: "lesson-keluarga",
      slug: "keluarga",
      title: "Kosakata keluarga Batak Toba",
      description: "Fixture lesson untuk pengujian.",
      level: 1,
      estMinutes: 5,
      reviewRollup: "corpus-derived-beta",
      publicationStatus: "published",
      counts: { poolItems: 4 },
      itemIds: ["word-0000000001", "word-0000000002", "word-0000000003", "word-0000000004"],
    },
    ...json.published,
  ];
  await route.fulfill({ json });
});
await page.goto("http://127.0.0.1:4183/learn/keluarga/");
await page.waitForTimeout(1500);
console.log("lesson-root:", (await page.locator("#lesson-root").textContent()).slice(0, 120));
await browser.close();
