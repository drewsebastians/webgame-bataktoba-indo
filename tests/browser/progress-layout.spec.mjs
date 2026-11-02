import { test, expect } from "@playwright/test";

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
