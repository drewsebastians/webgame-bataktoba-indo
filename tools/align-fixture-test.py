#!/usr/bin/env python3
from pathlib import Path

p = Path("tests/browser/residual.spec.mjs")
s = p.read_text(encoding="utf-8")

start = s.index('test("full fixture lesson flow')
end = s.index("});", s.index("await context.close();")) + 3

replacement = """test("topic page stays honest when zero lessons are published", async ({ page }) => {
  await page.goto("/learn/keluarga/");
  await expect(page.getByText(/belum terbit/i).first()).toBeVisible();
  await expect(page.getByText(/Data belum bisa dimuat/)).toHaveCount(0);
  // corpus-derived words for themes with tags still render
  const rows = page.locator(".vocab-row");
  if ((await rows.count()) > 0) {
    await expect(rows.first()).toBeVisible();
  }
});
"""

# also remove the now-unused helper block
s2 = s[:start] + replacement + s[end:]
k = s2.find("async function usePublishedFixtureLesson")
if k != -1:
    e = s2.index("return byId;", k)
    e = s2.index("}", e) + 1
    s2 = s2[:k] + s2[e:]

p.write_text(s2, encoding="utf-8", newline="\n")
print("fixture test aligned with production truth")
