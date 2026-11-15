import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("progress privacy controls stay in place while local stats hydrate", async ({ page }) => {
  const entrypoint = "**/assets/js/progress-page.*.js";
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.route(entrypoint, (route) => route.abort());
    await page.goto("/progres/");

    const root = page.locator("#progress-root");
    const privacy = page.locator("#privacy-settings");
    await expect(root).toHaveAttribute("aria-busy", "true");
    await expect(privacy.getByRole("heading", { name: "Preferensi privasi" })).toBeVisible();
    await expect(page.getByRole("switch", { name: /Analytics produk/ })).toBeDisabled();
    const initialTop = await privacy.evaluate((node) => node.getBoundingClientRect().top);

    await page.unroute(entrypoint);
    await page.reload();
    await expect(page.getByRole("button", { name: "Ekspor progress (JSON)" })).toBeVisible();
    await expect(root).toHaveAttribute("aria-busy", "false");
    await expect(page.getByRole("switch", { name: /Analytics produk/ })).toBeEnabled();
    const hydratedTop = await privacy.evaluate((node) => node.getBoundingClientRect().top);

    expect(
      Math.abs(hydratedTop - initialTop),
      `privacy section moved at viewport width ${width}px`,
    ).toBeLessThanOrEqual(1);
  }
});

test("progress import rejects a file above the shared 1 MB limit", async ({ page }) => {
  await page.goto("/progres/");
  await page.locator("#import-file").setInputFiles({
    name: "oversized-progress.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(1024 * 1024 + 1, 0x20),
  });

  await page.getByRole("button", { name: "Impor progress" }).click();
  await expect(page.getByRole("status")).toContainText("maksimal 1 MB");
});

test("progress export downloads a sanitized backup before revoking its object URL", async ({ page }) => {
  await page.addInitScript(() => {
    window.__revokedBlobUrls = [];
    const revokeObjectURL = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = (url) => {
      window.__revokedBlobUrls.push(url);
      return revokeObjectURL(url);
    };
    localStorage.setItem(
      "batakTobaPlay.progress.v2",
      JSON.stringify({
        schemaVersion: 3,
        answered: 2,
        correct: 9,
        lastMode: "meaning",
        items: {},
        lessons: {},
        sessions: [],
        email: "private@example.invalid",
        rawSourceText: "SYNTHETIC_PRIVATE_FIXTURE",
      }),
    );
  });

  await page.goto("/progres/");
  const exportButton = page.getByRole("button", { name: "Ekspor progress (JSON)" });
  const [download] = await Promise.all([page.waitForEvent("download"), exportButton.click()]);

  expect(download.suggestedFilename()).toMatch(/^batak-toba-progress-\d{4}-\d{2}-\d{2}\.json$/);
  const backup = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(backup.answered).toBe(2);
  expect(backup.correct).toBe(2);
  expect(backup).not.toHaveProperty("email");
  expect(backup).not.toHaveProperty("rawSourceText");
  expect(JSON.stringify(backup)).not.toContain("SYNTHETIC_PRIVATE_FIXTURE");
  expect(await page.evaluate(() => window.__revokedBlobUrls)).toEqual([]);

  await expect.poll(() => page.evaluate(() => window.__revokedBlobUrls.length), { timeout: 3000 }).toBe(1);
});
