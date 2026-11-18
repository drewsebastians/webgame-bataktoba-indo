import AxeBuilder from "@axe-core/playwright";
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

test("primary routes have no WCAG A/AA accessibility violations with the published empty catalog", async ({ page }) => {
  for (const route of PRIMARY_ROUTES) {
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const violations = results.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map(({ target }) => target),
    }));
    expect(violations, `${route} should pass the WCAG A/AA audit`).toEqual([]);
  }
});
