import { test, expect } from "@playwright/test";
import { installSyntheticContentRoutes } from "./helpers/synthetic-content.mjs";

test("onboarding preference applies to the synthetic browser session and stays local", async ({ page }) => {
  await installSyntheticContentRoutes(page);
  await page.goto("/");

  const group = page.getByRole("group", { name: "Pilih jumlah soal untuk sesi awal." });
  await expect(group).toBeVisible();
  await group.getByRole("button", { name: "5 soal", exact: true }).click();
  await expect(page.locator(".onboarding-panel [aria-live='polite']")).toContainText("5 soal tersimpan");

  let preference = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("batakTobaPlay.onboarding")),
  );
  expect(preference).toMatchObject({ version: 2, sessionSize: 5, skipped: false });
  expect(preference).not.toHaveProperty("familiarity");
  expect(preference).not.toHaveProperty("goal");

  await page.goto("/games/");
  await expect(page.locator(".prompt-text")).toBeVisible();
  const five = page.locator('.session-size-button[data-size="5"]');
  await expect(five).toHaveAttribute("aria-pressed", "true");

  await page.locator('.session-size-button[data-size="20"]').click();
  preference = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("batakTobaPlay.onboarding")),
  );
  expect(preference.sessionSize).toBe(20);
});
