import { test, expect } from "@playwright/test";

const PRIMARY_ROUTES = [
  "/",
  "/games/",
  "/flashcards/",
  "/dictionary/",
  "/progres/",
  "/learn/angka/",
  "/learn/sapaan/",
  "/learn/keluarga/",
];

test("primary routes reflow at the 640px width equivalent to 200% desktop zoom", async ({ page }) => {
  // At 200% zoom, a 1280 CSS-pixel desktop viewport exposes about 640 CSS pixels.
  // Keep this layout check on the real empty public catalog; fixture-bearing flows
  // remain isolated in their own tests with service workers blocked.
  await page.setViewportSize({ width: 640, height: 900 });

  for (const route of PRIMARY_ROUTES) {
    await page.goto(route);

    const main = page.locator("#main-content");
    await expect(main, route + " should expose its main landmark").toBeVisible();
    await expect(main.locator("h1").first(), route + " should expose its page heading").toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, route + " document overflowed at " + dimensions.viewport + "px").toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, route + " body overflowed at " + dimensions.viewport + "px").toBeLessThanOrEqual(dimensions.viewport);

    const menu = page.getByRole("button", { name: "Menu" });
    await expect(menu, route + " should show the mobile navigation control").toBeVisible();
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    const navigation = page.getByRole("navigation", { name: "Navigasi utama" });
    const homeLink = navigation.getByRole("link", { name: "Home" });
    await expect(homeLink).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(homeLink).toBeFocused();
    await homeLink.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await expect(homeLink).toBeHidden();
  }
});

test("primary routes fit a 320px touch viewport with usable mobile navigation targets", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });

  for (const route of PRIMARY_ROUTES) {
    await page.goto(route);

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, route + " document overflowed at " + dimensions.viewport + "px").toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, route + " body overflowed at " + dimensions.viewport + "px").toBeLessThanOrEqual(dimensions.viewport);

    const menu = page.getByRole("button", { name: "Menu" });
    await expect(menu, route + " should expose the mobile navigation toggle").toBeVisible();
    const menuTarget = await menu.boundingBox();
    expect(menuTarget?.width ?? 0, route + " menu target should be at least 44px wide").toBeGreaterThanOrEqual(44);
    expect(menuTarget?.height ?? 0, route + " menu target should be at least 44px tall").toBeGreaterThanOrEqual(44);

    await menu.tap();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    const navLinks = page.locator("#nav-links-list a");
    await expect(navLinks.first()).toBeVisible();
    for (const navLink of await navLinks.all()) {
      const target = await navLink.boundingBox();
      expect(target?.width ?? 0, route + " navigation link should be at least 44px wide").toBeGreaterThanOrEqual(44);
      expect(target?.height ?? 0, route + " navigation link should be at least 44px tall").toBeGreaterThanOrEqual(44);
    }

    await menu.tap();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    const closedDimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(closedDimensions.document, route + " document overflowed after closing navigation").toBeLessThanOrEqual(closedDimensions.viewport);
    expect(closedDimensions.body, route + " body overflowed after closing navigation").toBeLessThanOrEqual(closedDimensions.viewport);
  }
});
