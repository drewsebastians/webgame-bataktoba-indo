import { test, expect } from "@playwright/test";
import {
  installSyntheticContentRoutes,
  completeSyntheticLesson,
} from "./helpers/synthetic-content.mjs";

test("real synthetic lesson completion persists through home and offline/reconnect", async ({ page, context }) => {
  const pageErrors = [];
  const dataResponses = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.startsWith("/data/published/")) {
      dataResponses.push({ path: new URL(response.url()).pathname, status: response.status() });
    }
  });
  await installSyntheticContentRoutes(page);
  await completeSyntheticLesson(page);

  const completedAt = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    return progress.lessons?.angka?.completedAt ?? null;
  });
  expect(completedAt).toBeTruthy();

  await page.goto("/");
  await expect.poll(
    () => page.locator("#home-dynamic").innerText(),
    {
      message: `Home did not render the saved lesson after async data loading; ${JSON.stringify({ pageErrors, dataResponses })}`,
    },
  ).toContain("Lanjutkan Belajar");
  await expect(page.locator("[data-home-stats] .stat strong").nth(0)).toHaveText("8");
  await expect(page.locator("[data-home-stats] .stat strong").nth(1)).toHaveText("1");

  await context.setOffline(true);
  await expect(page.locator(".app-banner.offline-banner")).toBeVisible();
  await expect(page.locator("#home-dynamic")).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator(".app-banner.offline-banner")).toHaveCount(0);
});
