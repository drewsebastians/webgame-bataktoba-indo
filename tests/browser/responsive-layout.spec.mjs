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

const CURRENT_NAV_BY_ROUTE = {
  "/": "home",
  "/games/": "games",
  "/flashcards/": "flashcards",
  "/dictionary/": "dictionary",
  "/progres/": "progres",
};

test("main navigation identifies the current top-level page without marking topic pages as Home", async ({ page }) => {
  for (const route of PRIMARY_ROUTES) {
    await page.goto(route);

    const currentLinks = page.locator('#nav-links-list a[aria-current="page"]');
    const expectedCurrentPage = CURRENT_NAV_BY_ROUTE[route];
    if (expectedCurrentPage) {
      await expect(currentLinks, route + " should have one current navigation item").toHaveCount(1);
      await expect(currentLinks).toHaveAttribute("data-nav", expectedCurrentPage);
    } else {
      await expect(currentLinks, route + " should not mark an unrelated top-level page as current").toHaveCount(0);
    }
  }
});

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

test("mobile navigation closes on outside interaction and resets when returning to desktop", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/");

  const menu = page.getByRole("button", { name: "Menu" });
  const navigation = page.getByRole("navigation", { name: "Navigasi utama" });
  const heading = page.locator("#main-content h1").first();

  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await heading.click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");

  await menu.click();
  await heading.evaluate((node) => {
    node.setAttribute("tabindex", "-1");
    node.focus();
  });
  await expect(menu).toHaveAttribute("aria-expanded", "false");

  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();

  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(navigation.getByRole("link", { name: "Home" })).toBeVisible();

  await page.setViewportSize({ width: 640, height: 900 });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation.getByRole("link", { name: "Home" })).toBeHidden();
});

test("dictionary filters meet mobile touch target size in an isolated synthetic fixture", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/dictionary/");

  const filters = page.locator("#dictionary-filters");
  await expect(filters, "the production dictionary stays empty before the isolated fixture is added").toBeHidden();
  await filters.evaluate((container) => {
    const label = document.createElement("label");
    label.className = "filter-field";
    const caption = document.createElement("span");
    caption.textContent = "Topic";

    const select = document.createElement("select");
    select.className = "filter-select";
    select.setAttribute("aria-label", "Synthetic filter fixture");
    const option = document.createElement("option");
    option.value = "synthetic-topic";
    option.textContent = "Synthetic topic";
    select.append(option);

    label.append(caption, select);
    container.replaceChildren(label);
    container.dataset.testFixture = "synthetic";
    container.hidden = false;
  });

  const control = page.getByRole("combobox", { name: "Synthetic filter fixture" });
  await expect(control).toBeVisible();
  const target = await control.boundingBox();
  expect(target?.height ?? 0, "dictionary filter should be at least 44px tall for touch use").toBeGreaterThanOrEqual(44);

  await control.focus();
  await expect(control).toBeFocused();
  await control.selectOption("synthetic-topic");
  await expect(control).toHaveValue("synthetic-topic");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, "synthetic filter overflowed the 320px viewport").toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body, "synthetic filter overflowed the body").toBeLessThanOrEqual(dimensions.viewport);
});
