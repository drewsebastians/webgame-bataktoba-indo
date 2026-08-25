#!/usr/bin/env python3
from pathlib import Path

p = Path("assets/js/app.js")
s = p.read_text(encoding="utf-8")

old = """      (() => {
        const wrapper = el("label", { className: "filter-field" }, "Kesulitan ");
        const selectEl = el("select", {
          className: "input filter-select",
          id: "dict-difficulty",
          attrs: {
            disabled: difficultyAvailable ? undefined : true,
            title: difficultyAvailable
              ? undefined
              : "Filter kesulitan aktif otomatis setelah corpus menyediakan metadata difficulty.",
          },
        });"""
new = """      (() => {
        const disabledTitle =
          "Filter kesulitan aktif otomatis setelah corpus menyediakan metadata difficulty.";
        const wrapper = el("label", { className: "filter-field" }, "Kesulitan ");
        const selectEl = el("select", {
          className: "input filter-select",
          id: "dict-difficulty",
          attrs: {
            disabled: difficultyAvailable ? undefined : true,
            title: difficultyAvailable ? undefined : disabledTitle,
          },
        });"""
assert old in s
s = s.replace(old, new, 1)

old2 = """        } else {
          wrapper.title = selectEl.attrs.title;
        }"""
new2 = """        } else {
          wrapper.title = disabledTitle;
        }"""
assert old2 in s
s = s.replace(old2, new2, 1)

# also remove temporary catch logging
s = s.replace("main().catch((error) => { console.error(error && error.stack || error);", "main().catch((error) => {")

p.write_text(s, encoding="utf-8", newline="\n")
print("difficulty filter fixed")
