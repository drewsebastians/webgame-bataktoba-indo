#!/usr/bin/env python3
from pathlib import Path

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

# filters state
old = '  const filters = { direction: "both", theme: "all" };'
new = (
    '  const filters = { direction: "both", theme: "all", type: "all", review: "all", '
    'difficulty: "all" };\n'
    '  const difficultyAvailable = searchable.some(\n'
    '    (item) => item.difficulty !== null && item.difficulty !== undefined,\n'
    "  );"
)
assert old in s
s = s.replace(old, new, 1)

# extra filter selects (append inside buildFilters replaceChildren list end)
old = """      select(
        "dict-theme",
        "Tema",
        [["all", "Semua tema"], ...themes.map((t) => [t, t])],
        filters.theme,
        (v) => {
          filters.theme = v;
          render();
        },
      ),
    );"""
new = """      select(
        "dict-theme",
        "Tema",
        [["all", "Semua tema"], ...themes.map((t) => [t, t])],
        filters.theme,
        (v) => {
          filters.theme = v;
          render();
        },
      ),
      select(
        "dict-type",
        "Tipe",
        [["all", "Semua tipe"], ["word", "Kata"], ["phrase", "Frasa"]],
        filters.type,
        (v) => {
          filters.type = v;
          render();
        },
      ),
      select(
        "dict-review",
        "Status",
        [
          ["all", "Semua status"],
          ["corpus-derived", "corpus-derived"],
          ["beta-unreviewed", "beta-unreviewed"],
          ["human-reviewed", "human-reviewed"],
        ],
        filters.review,
        (v) => {
          filters.review = v;
          render();
        },
      ),
      (() => {
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
        });
        for (const [val, text] of [
          ["all", "Semua level"],
          ["1", "Level 1"],
          ["2", "Level 2"],
          ["3", "Level 3"],
        ]) {
          selectEl.append(el("option", { text, attrs: { value: val } }));
        }
        selectEl.value = filters.difficulty;
        if (difficultyAvailable) {
          selectEl.addEventListener("change", () => {
            filters.difficulty = selectEl.value;
            render();
          });
        } else {
          wrapper.title = selectEl.attrs.title;
        }
        wrapper.append(selectEl);
        return wrapper;
      })(),
    );"""
assert old in s
s = s.replace(old, new, 1)

# predicates
old = """  function inSelectedTheme(item) {
    if (filters.theme === "all") return true;
    return (item.themes ?? []).includes(filters.theme);
  }"""
new = """  function inSelectedTheme(item) {
    if (filters.theme === "all") return true;
    return (item.themes ?? []).includes(filters.theme);
  }

  function matchesExtraFilters(item) {
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.review !== "all" && item.reviewStatus !== filters.review) return false;
    if (filters.difficulty !== "all") {
      const expected = Number(filters.difficulty);
      if (item.difficulty === null || item.difficulty === undefined) return false;
      if (Number(item.difficulty) !== expected) return false;
    }
    return true;
  }

  /** Safe DOM highlight: returns array of text/mark nodes. */
  function highlightNodes(label, query) {
    const raw = String(label ?? "");
    if (!query || query.length < 2) return [raw];
    const idx = raw.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return [raw];
    return [
      raw.slice(0, idx),
      el("mark", { text: raw.slice(idx, idx + query.length) }),
      raw.slice(idx + query.length),
    ];
  }"""
assert old in s
s = s.replace(old, new, 1)

# use predicates + practice button + highlighted labels
old = """    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item))
      .slice(0, 60);"""
new = """    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item) && matchesExtraFilters(item))
      .slice(0, 60);"""
assert old in s
s = s.replace(old, new, 1)

old = """    row.append(
      el("strong", { text: item.batak }),
      el("span", { text: item.indonesia }),
      pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
    );"""
new = """    const query = normalizeSearch(input.value.trim());
    row.append(
      el("strong", {}, ...highlightNodes(item.batak, query)),
      el("span", {}, ...highlightNodes(item.indonesia, query)),
      pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
    );"""
assert old in s
s = s.replace(old, new, 1)

old = """    const actionsRow = el("div", { className: "action-row" }, saveButton, correctionLink);"""
new = """    const practiceButton = el("button", {
      className: "button secondary",
      text: "Latihan kata ini",
      attrs: { type: "button" },
    });
    practiceButton.addEventListener("click", () => {
      setSaved(item.id, true);
      saveProgress({ practiceIds: [item.id], lastMode: "meaning" });
      window.location.href = "../games/";
    });

    const actionsRow = el(
      "div",
      { className: "action-row" },
      saveButton,
      practiceButton,
      correctionLink,
    );"""
assert old in s
s = s.replace(old, new, 1)

# games consumes practiceIds once at startup
old = """  $$(".session-size-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.size === String(state.sessionSize)));
  });"""
new = """  const pendingPractice = getProgress().practiceIds;
  if (Array.isArray(pendingPractice) && pendingPractice.length) {
    saveProgress({ practiceIds: [] });
    state.mode = "meaning";
    startSession({ mode: "meaning", size: Math.max(pendingPractice.length, 5) });
    getRunner("meaning", {
      fresh: true,
      initialIds: [...pendingPractice, ...shuffleWith(wordPool, Math.random).slice(0, 10).map((i) => i.id)],
    }).nextQuestion();
  }

  $$(".session-size-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.size === String(state.sessionSize)));
  });"""
assert old in s
s = s.replace(old, new, 1)

# import setSaved already present? ensure
if "setSaved," not in s.split('} from "./progress.js"')[0]:
    s = s.replace("  setDifficult,\n", "  setDifficult,\n  setSaved,\n")

app.write_text(s, encoding="utf-8", newline="\n")
print("dictionary extras applied")
