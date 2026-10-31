import { test, expect } from "@playwright/test";

test("progress privacy controls remain in place while local stats hydrate", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const entrypoint = "**/assets/js/progress-page.*.js";
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

  expect(Math.abs(hydratedTop - initialTop)).toBeLessThanOrEqual(1);
});
