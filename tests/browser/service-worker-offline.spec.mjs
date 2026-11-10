import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// This file exercises the actual cache strategy with production's empty data.
// Synthetic content routes stay in the other browser tests, where service workers
// are blocked so fixtures cannot be persisted in a browser cache.
test.use({ serviceWorkers: "allow" });

async function expectNoSeriousAccessibilityViolations(page) {
  const scan = await new AxeBuilder({ page }).analyze();
  const serious = scan.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious.map((violation) => `${violation.id}:${violation.nodes.length}`)).toEqual([]);
}

test("service worker restores a visited lesson offline and reconnects", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    { timeout: 15000, message: "service worker did not take control of the browser page" },
  ).toBe(true);

  await page.goto("/learn/angka/");
  await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  await expect.poll(
    () => page.evaluate(async () => {
      const shellName = (await caches.keys()).find((name) => name.startsWith("btp-") && name.endsWith("-shell"));
      if (!shellName) return 0;
      const cache = await caches.open(shellName);
      return (await cache.match(new URL("/learn/angka/", location.origin)))?.status ?? 0;
    }),
    { timeout: 15000, message: "the visited lesson was not saved to the shell cache" },
  ).toBe(200);

  await context.setOffline(true);
  await page.goto("/learn/angka/");
  await expect(page.getByText(/belum terbit/i).first()).toBeVisible();

  await page.goto("/dictionary/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Kamu sedang offline" })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);

  await context.setOffline(false);
  await page.goto("/dictionary/");
  await expect(page.getByRole("heading", { name: "Cari kata Batak Toba atau Indonesia" })).toBeVisible();
});


test("offline status is announced accessibly on every browser app route", async ({ page, context }) => {
  for (const route of ["/", "/flashcards/", "/dictionary/", "/progres/"]) {
    await page.goto(route);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await expect.poll(
      () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
      { timeout: 15000, message: `service worker did not control ${route}` },
    ).toBe(true);

    await context.setOffline(true);
    const offlineStatus = page.locator(".offline-banner");
    await expect(offlineStatus).toBeVisible();
    await expect(offlineStatus).toHaveAttribute("role", "status");
    await expect(offlineStatus).toHaveAttribute("aria-live", "polite");
    await expect(offlineStatus).toHaveAttribute("aria-atomic", "true");

    await context.setOffline(false);
    await expect(offlineStatus).toHaveCount(0);
  }
});

test("games route falls back offline before its first visit and restores the empty catalog after caching", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    { timeout: 15000, message: "service worker did not take control of the browser page" },
  ).toBe(true);

  // The games route has not been visited or cached yet.
  await context.setOffline(true);
  await page.goto("/games/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Kamu sedang offline" })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);

  await context.setOffline(false);
  await expect.poll(
    () => page.evaluate(() => navigator.onLine),
    { timeout: 5000, message: "browser did not return online before revisiting games" },
  ).toBe(true);
  await page.goto("/games/");
  await expect(page.getByRole("heading", { name: "Mode latihan Bahasa Batak Toba - Indonesia" })).toBeVisible();
  const emptyState = page.locator("#game-panel .feedback");
  await expect(emptyState).toHaveText("Data soal belum tersedia untuk mode ini. Coba mode lain.");
  await expect(page.locator("#game-panel .prompt-text")).toHaveCount(0);
  await expect(page.locator("#game-panel [data-answer]")).toHaveCount(0);
  await expect.poll(
    () => page.evaluate(async () => {
      const shellName = (await caches.keys()).find((name) => name.startsWith("btp-") && name.endsWith("-shell"));
      if (!shellName) return 0;
      const cache = await caches.open(shellName);
      return (await cache.match(new URL("/games/", location.origin)))?.status ?? 0;
    }),
    { timeout: 15000, message: "the visited games route was not saved to the shell cache" },
  ).toBe(200);

  await context.setOffline(true);
  await page.goto("/games/");
  await expect(page.getByRole("heading", { name: "Mode latihan Bahasa Batak Toba - Indonesia" })).toBeVisible();
  await expect(emptyState).toHaveText("Data soal belum tersedia untuk mode ini. Coba mode lain.");
  await expect(page.locator("#game-panel .prompt-text")).toHaveCount(0);
  await expect(page.locator("#game-panel [data-answer]")).toHaveCount(0);
  await context.setOffline(false);
});


test("uncached lesson route falls back offline accessibly", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    { timeout: 15000, message: "service worker did not take control of the browser page" },
  ).toBe(true);

  // A new test context has not visited or cached this topic route.
  await context.setOffline(true);
  await page.goto("/learn/angka/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Kamu sedang offline" })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});
