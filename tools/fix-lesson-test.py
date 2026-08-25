#!/usr/bin/env python3
"""Rewrite the fixture-lesson test loop to be phase-agnostic and robust."""
from pathlib import Path
import re

p = Path("tests/browser/residual.spec.mjs")
s = p.read_text(encoding="utf-8")

start = s.index("  await page.goto(\"/learn/keluarga/\");")
end_marker = "  await context.close();"
end = s.index(end_marker)

new_block = '''  await page.goto("/learn/keluarga/");
  await page.getByRole("button", { name: "Mulai belajar" }).click();

  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    // completion?
    if ((await page.getByRole("heading", { name: "Lesson selesai" }).count()) > 0) break;

    const typed = page.locator(".typed-answer-input");
    if ((await typed.count()) > 0 && (await typed.isEnabled())) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const word = WORDS.find((w) => w.batak === prompt);
      await typed.fill(word ? word.indonesia : "zzz");
      await page.getByRole("button", { name: "Periksa" }).click();
      await page.waitForTimeout(120);
    }

    const options = page.locator(".option");
    if ((await options.count()) > 0 && !(await options.first().isDisabled())) {
      const prompt = (await page.locator(".prompt-text").textContent())?.trim();
      const word = WORDS.find((w) => w.batak === prompt);
      const target = word ? word.indonesia : null;
      let handled = false;
      for (const option of await options.all()) {
        if (target && (await option.textContent()) === target) {
          await option.click();
          handled = true;
          break;
        }
      }
      if (!handled) await options.first().click();
      await page.waitForTimeout(120);
    }

    const lessonNext = page.locator("#lesson-next");
    if ((await lessonNext.count()) > 0 && (await lessonNext.isEnabled())) {
      await lessonNext.click();
    }
    await page.waitForTimeout(150);
  }

  await expect(page.getByRole("heading", { name: "Lesson selesai" })).toBeVisible();

'''

# Replace from goto line up to (but excluding) the storage-eval section
storage_anchor = "  const stored = await page.evaluate(() => {"
end2 = s.index(storage_anchor)
s = s[:start] + new_block + "\n" + s[end2:]

p.write_text(s, encoding="utf-8", newline="\n")
print("lesson test rewritten")
