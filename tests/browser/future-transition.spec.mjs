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
  const homeState = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("batakTobaPlay.progress.v2") ?? "{}");
    const lesson = progress.lessons?.angka ?? {};
    return {
      dynamicText: document.querySelector("#home-dynamic")?.innerText ?? "",
      statsText: document.querySelector("[data-home-stats]")?.innerText ?? "",
      lessonProgress: { startedAt: Boolean(lesson.startedAt), completedAt: Boolean(lesson.completedAt) },
      onboardingStored: localStorage.getItem("batakTobaPlay.onboarding") !== null,
      appScripts: [...document.querySelectorAll("script[src]")].map((script) => script.getAttribute("src")),
    };
  });
  expect(homeState.dynamicText, `Home init diagnostic: ${JSON.stringify({ homeState, pageErrors, dataResponses })}`)
    .toContain("Lanjutkan Belajar");

  await context.setOffline(true);
  await expect(page.locator(".app-banner.offline-banner")).toBeVisible();
  await expect(page.locator("#home-dynamic")).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator(".app-banner.offline-banner")).toHaveCount(0);
});
