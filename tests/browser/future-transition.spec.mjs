import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
} from "./helpers/synthetic-content.mjs";

test("real synthetic lesson completion persists through home and offline/reconnect", async ({ page, context }) => {
  await installSyntheticContentRoutes(page);
  await completeSyntheticLesson(page);

  const completedAt = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return progress.lessons?.angka?.completedAt ?? null;
  });
  expect(completedAt).toBeTruthy();

  await page.goto("/");
  await expect(page.locator("#home-dynamic")).toContainText("Lanjutkan Belajar");

  await context.setOffline(true);
  await expect(page.locator(".app-banner.offline-banner")).toBeVisible();
  await expect(page.locator("#home-dynamic")).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator(".app-banner.offline-banner")).toHaveCount(0);
});
