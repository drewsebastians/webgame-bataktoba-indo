import { test, expect } from "@playwright/test";

// This file exercises the actual cache strategy with production's empty data.
// Synthetic content routes stay in the other browser tests, where service workers
// are blocked so fixtures cannot be persisted in a browser cache.
test.use({ serviceWorkers: "allow" });

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
  await expect(page.locator(".app-banner.offline-banner")).toBeVisible();

  await page.goto("/dictionary/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Kamu sedang offline" })).toBeVisible();

  await context.setOffline(false);
  await page.goto("/dictionary/");
  await expect(page.getByRole("heading", { name: "Cari kata Batak Toba atau Indonesia" })).toBeVisible();
  await expect(page.locator(".app-banner.offline-banner")).toHaveCount(0);
});
