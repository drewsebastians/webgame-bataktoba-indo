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
    await page.evaluate(() => {
      const menuButton = document.querySelector(".nav-toggle");
      const navLinks = document.querySelector("#nav-links-list");
      window.__navEscapeSnapshot = null;
      navLinks.addEventListener("keydown", (event) => {
        window.__navEscapeSnapshot = {
          key: event.key,
          code: event.code,
          keyCode: event.keyCode,
          expanded: menuButton.getAttribute("aria-expanded"),
        };
      });
    });
    await homeLink.press("Escape");
    await expect.poll(() => page.evaluate(() => window.__navEscapeSnapshot)).not.toBeNull();
    const escapeSnapshot = await page.evaluate(() => window.__navEscapeSnapshot);
    expect(escapeSnapshot.key).toBe("Escape");
    expect(escapeSnapshot.expanded).toBe("false");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await expect(homeLink).toBeHidden();
  }
});
