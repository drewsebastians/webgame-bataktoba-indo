import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { installSyntheticContentRoutes } from "./helpers/synthetic-content.mjs";

test.describe.configure({ mode: "serial" });

async function getSavedFlags(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("batakTobaPlay.progress.v2");
    if (!raw) return [];
    const items = JSON.parse(raw).items ?? {};
    return Object.values(items).filter((stats) => stats.saved);
  });
}


test.describe("core learning flows", () => {
  test("empty public dataset keeps dictionary and flashcards honest without layout injection", async ({ page }) => {
    await page.goto("/flashcards/");
    await expect(page.locator("#flashcard-root")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("#flashcard-root")).toContainText("Belum ada kartu belajar yang siap ditampilkan");
    await expect(page.locator("#flashcard")).toHaveCount(0);
    await expect(page.locator("#fc-filter")).toHaveCount(0);
    await expect(page.locator("#flashcard-root")).not.toContainText("SYNTHETIC_");

    await page.goto("/dictionary/");
    await expect(page.locator("#app-error")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("#dictionary-empty-state")).toBeVisible();
    await expect(page.locator("#dictionary-search")).toBeDisabled();
    await expect(page.locator("#dictionary-filters")).toBeHidden();
    await expect(page.locator("#dictionary-results")).toBeHidden();
    await expect(page.locator(".result-row")).toHaveCount(0);
    await expect(page.locator("#dictionary-search")).not.toHaveAttribute("placeholder", /pogos|podang/i);
    await expect(page.locator("#app-error")).not.toContainText("SYNTHETIC_");
  });

  test("home: onboarding appears for new users and can be skipped", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("button", { name: "Lewati", exact: true });
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(page.getByRole("button", { name: "Lewati", exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Mulai Latihan Harian" })).toBeVisible();
  });

  test("quiz: keyboard answer marks exactly one correct option; no duplicate labels", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/games/");
    await expect(page.locator(".option")).toHaveCount(4);
    const labels = await page.locator(".option").allTextContents();
    const normalized = labels.map((label) => label.trim().toLowerCase());
    expect(new Set(normalized).size).toBe(normalized.length);

    await page.keyboard.press("1");
    await expect(page.locator(".option.correct")).toHaveCount(1);
    for (const option of await page.locator(".option").all()) {
      await expect(option).toBeDisabled();
    }
    await expect(page.locator("#next-question")).toBeEnabled();
  });

  test("typed answer: grades input and shows feedback", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/games/");
    await page.getByRole("button", { name: /Ketik Jawaban/ }).click();
    await expect(page.locator(".typed-answer-input")).toBeVisible();
    await page.locator(".typed-answer-input").fill("zzzz-tidak-ada");
    await page.getByRole("button", { name: "Periksa" }).click();
    await expect(page.locator("#feedback")).toContainText(/Belum tepat|Benar/);
    await expect(page.locator("#next-question")).toBeEnabled();
  });

  test("true/false mode renders two options and records an answer", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/games/");
    await page.getByRole("button", { name: /Benar \/ Salah/ }).click();
    await expect(page.getByRole("button", { name: /Pasangan BENAR/ })).toBeVisible();
    await page.getByRole("button", { name: /Pasangan SALAH/ }).click();
    await expect(page.locator(".feedback").first()).not.toBeEmpty();
  });

  test("memory: size selector builds the board", async ({ page }) => {
    await installSyntheticContentRoutes(page);
    await page.goto("/games/");
    await page.getByRole("button", { name: /^Memory/ }).click();
    await expect(page.locator(".match-card")).toHaveCount(12); // default 6 pairs
    await page.getByRole("button", { name: "4 pasang", exact: true }).click();
    await expect(page.locator(".match-card")).toHaveCount(8);
    await page.getByRole("button", { name: "8 pasang", exact: true }).click();
    await expect(page.locator(".match-card")).toHaveCount(16);
  });

  test("flashcards: isolated entrypoint, keyboard flip, actions and filters work", async ({ page }) => {
    const scripts = [];
    const browserErrors = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });

    await installSyntheticContentRoutes(page);
    await page.goto("/flashcards/");
    const card = page.locator("#flashcard");
    try {
      await expect(card).toBeVisible();
    } catch (error) {
      const appError = await page.locator(".app-error").textContent().catch(() => "");
      throw new Error(
        `Flashcards entrypoint failed to render. App error: ${appError || "none"}. Browser errors: ${browserErrors.join(" | ") || "none"}. Loaded scripts: ${scripts.join(", ") || "none"}. ${error.message}`,
      );
    }
    expect(scripts.some((path) => /\/assets\/js\/flashcards-page\.[\da-f]{8}\.js$/.test(path))).toBe(true);
    expect(scripts.some((path) => /\/assets\/js\/app\.[\da-f]{8}\.js$/.test(path))).toBe(false);
    expect(scripts.some((path) => /\/assets\/js\/game\/(lesson-engine|modes)\.[\da-f]{8}\.js$/.test(path))).toBe(false);
    expect(scripts.some((path) => /\/assets\/js\/onboarding\.[\da-f]{8}\.js$/.test(path))).toBe(false);

    const before = await card.textContent();
    await page.keyboard.press("Space");
    const after = await card.textContent();
    expect(before).not.toBe(after);

    await page.getByRole("button", { name: "3 Benar" }).click();
    await expect(card).toBeVisible();

    await page.locator("#fc-filter").selectOption("difficult");
    await expect(page.locator("#flashcard-card")).toContainText(/Tidak ada kartu|Tahap/);
  });

  test("dictionary: isolated entrypoint searches synthetic fixture, opens detail and saves", async ({ page }) => {
    const scripts = [];
    const browserErrors = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });

    await installSyntheticContentRoutes(page);
    await page.goto("/dictionary/");
    await expect(page.locator("#dictionary-search")).toBeVisible();

    expect(scripts.some((path) => /\/assets\/js\/dictionary-page\.[\da-f]{8}\.js$/.test(path))).toBe(true);
    expect(scripts.some((path) => /\/assets\/js\/app\.[\da-f]{8}\.js$/.test(path))).toBe(false);
    expect(scripts.some((path) => /\/assets\/js\/game\/(question-engine|lesson-engine|modes)\.[\da-f]{8}\.js$/.test(path))).toBe(false);
    expect(scripts.some((path) => /\/assets\/js\/onboarding\.[\da-f]{8}\.js$/.test(path))).toBe(false);

    // This is an isolated synthetic browser fixture; it is never bundled for production.
    await page.locator("#dictionary-search").fill("SYNTHETIC_BT_001");
    const firstRow = page.locator(".result-row").first();
    await expect(firstRow).toContainText("SYNTHETIC_BT_001");
    await firstRow.click();
    const correction = page.getByRole("link", { name: "Lapor koreksi" }).first();
    await expect(correction).toBeVisible();
    const href = await correction.getAttribute("href");
    expect(href).toContain("github.com");
    expect(href).toContain("issues/new");

    const expandedRow = page.locator('.result-row[aria-expanded="true"]');
    await expandedRow.getByRole("button", { name: "Simpan ke daftar latihan" }).click();
    await expect(expandedRow.getByRole("button", { name: "Tersimpan" })).toBeVisible();
    await expect.poll(async () => getSavedFlags(page)).toHaveLength(1);
    expect(browserErrors).toEqual([]);
  });

  test("progres: loads the focused entrypoint without game engines", async ({ page }) => {
    const scripts = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
    });

    await page.goto("/progres/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[role=list] .pill").first()).toBeVisible();

    expect(scripts.some((path) => path.includes("/assets/js/progress-page."))).toBe(true);
    expect(scripts.some((path) => path.includes("/assets/js/app."))).toBe(false);
    for (const chunk of ["game/question-engine.", "game/lesson-engine.", "game/modes."]) {
      expect(scripts.some((path) => path.includes(chunk))).toBe(false);
    }
  });

  test("progres: stats render, consent toggle works, reset is two-step", async ({ page }) => {
    await page.goto("/progres/");
    await expect(page.locator("[role=list] .pill").first()).toBeVisible();

    const analyticsToggle = page.locator("#consent-analytics");
    await analyticsToggle.check();
    await expect(analyticsToggle).toBeChecked();

    const statusLine = page.locator(".feedback[role=status]");
    const resetButton = page
      .locator("#progress-root")
      .getByRole("button", { name: /Reset progress|Yakin\?/ });
    await resetButton.click();
    await expect(resetButton).toContainText("Yakin?");
    await resetButton.click();
    await expect(statusLine).toContainText("dihapus");

    const exportButton = page.getByRole("button", { name: /Ekspor progress/ });
    await exportButton.click();
    await expect(statusLine).toContainText("diekspor");
  });
});

test.describe("security & privacy invariants", () => {
  test("zero third-party requests across a full tour while ads/analytics are off", async ({ page }) => {
    const thirdPartyHosts = new Set();
    page.on("request", (request) => {
      const host = new URL(request.url()).host;
      if (!host.startsWith("127.0.0.1")) thirdPartyHosts.add(host);
    });
    for (const path of ["/", "/games/", "/flashcards/", "/dictionary/", "/progres/", "/learn/angka/"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect([...thirdPartyHosts]).toEqual([]);
  });

  test("production responses carry security headers from _headers", async ({ page }) => {
    const response = await page.request.get("/");
    const csp = response.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).not.toContain("unsafe-eval");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("draft vocabulary never renders publicly", async ({ page }) => {
    // Use 'sapaan' which has 1 pool item and is not published
    await page.goto("/learn/sapaan/");
    const body = (await page.textContent("body"))?.toLowerCase() ?? "";
    for (const banned of ["anggi", "namboru", "hula-hula"]) {
      expect(body).not.toContain(banned);
    }
    await expect(
      page.getByText(/menunggu review penutur|Lesson latihan penuh belum terbit/i).first(),
    ).toBeVisible();
  });
});

test.describe("accessibility (axe)", () => {
  const pages = ["/", "/games/", "/flashcards/", "/dictionary/", "/progres/", "/learn/angka/"];
  for (const path of pages) {
    test(`no serious/critical violations: ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      );
      expect(serious.map((violation) => `${violation.id}:${violation.nodes.length}`)).toEqual([]);
    });
  }
});
