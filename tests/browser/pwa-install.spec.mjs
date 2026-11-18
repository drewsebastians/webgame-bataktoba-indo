import { test, expect } from "@playwright/test";

test.use({ serviceWorkers: "block" });

test("browser install action stays hidden until an explicit prompt and then reports the result", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  const installButton = page.locator("#install-pwa");
  const status = page.locator("#install-pwa-status");
  await expect(installButton).toBeHidden();
  await expect(status).toBeHidden();

  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.defineProperties(event, {
      prompt: {
        value: async () => {
          window.__pwaPromptCount = (window.__pwaPromptCount ?? 0) + 1;
        },
      },
      userChoice: { value: Promise.resolve({ outcome: "accepted" }) },
    });
    window.dispatchEvent(event);
  });

  await expect(installButton).toBeVisible();
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    installHeight: document.querySelector("#install-pwa").getBoundingClientRect().height,
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  expect(layout.installHeight).toBeGreaterThanOrEqual(44);
  await installButton.focus();
  await installButton.press("Enter");
  await expect(status).toContainText(/permintaan pemasangan diterima/i);
  await expect(installButton).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.__pwaPromptCount)).toBe(1);
});
