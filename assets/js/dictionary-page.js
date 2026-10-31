// Focused dictionary entrypoint keeps game and lesson engines off this route.
import { loadLearningItems, loadTopics } from "./data.js";
import { SITE_CONFIG } from "./config.js";
import { getBucketIds, getProgress, initProgress, saveProgress, setSaved } from "./progress.js";
import { el, replaceChildren, showError } from "./utils/dom.js";
import { normalizeSearch } from "./utils/normalize.js";
import { buildCorrectionUrl } from "./utils/corrections.js";
import { track } from "./analytics.js";
import { sweepPlaceholders } from "./ads.js";

const dictionaryQuery = (selector, root = document) => root.querySelector(selector);
const dictionaryQueryAll = (selector, root = document) => [...root.querySelectorAll(selector)];

function pill(text, extraClass = "", attrs = {}) {
  return el("span", { className: `pill ${extraClass}`.trim(), text, attrs });
}

function formatQuality(item) {
  if (item.reviewStatus === "beta-unreviewed") {
    return "Beta - sumber corpus keagamaan, belum direview";
  }
  return item.quality || item.reviewStatus || item.sourceType || "corpus-derived";
}

function initNavToggle() {
  const toggle = dictionaryQuery(".nav-toggle");
  const links = dictionaryQuery("#nav-links-list");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  dictionaryQueryAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  });
}

function updateProgressBadges() {
  const progress = getProgress();
  dictionaryQueryAll("[data-progress-answered]").forEach((node) => (node.textContent = progress.answered));
  dictionaryQueryAll("[data-progress-correct]").forEach((node) => (node.textContent = progress.correct));
  dictionaryQueryAll("[data-progress-known]").forEach((node) => (node.textContent = getBucketIds("known").length));
}

function showLastModified() {
  const meta = document.querySelector('meta[name="last-modified"]');
  const footer = document.querySelector(".footer-inner");
  if (!meta || !footer) return;
  const date = new Date(meta.content);
  if (Number.isNaN(date.getTime())) return;
  const long = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  footer.prepend(
    el("span", {}, "Terakhir diperbarui: ",
      el("time", { text: long, attrs: { datetime: meta.content } })),
  );
}

function showUpdateBanner() {
  if (dictionaryQuery(".app-banner.update-banner")) return;
  const banner = el("div", { className: "app-banner update-banner" });
  const label = el("span", { text: "Versi baru tersedia." });
  const button = el("button", { className: "button", text: "Muat ulang", attrs: { type: "button" } });
  button.addEventListener("click", () => window.location.reload());
  banner.append(label, button);
  document.body.append(banner);
  setTimeout(() => banner.remove(), 30000);
}

let offlineTracked = false;
function setOfflineBanner(offline) {
  if (offline && !offlineTracked) {
    offlineTracked = true;
    track("offline_session");
  }
  const existing = dictionaryQuery(".app-banner.offline-banner");
  if (offline && !existing) {
    document.body.append(el("div", {
      className: "app-banner offline-banner",
      text: "Anda sedang offline. Halaman yang pernah dibuka tetap tersedia.",
    }));
  } else if (!offline && existing) {
    existing.remove();
  }
}

function registerServiceWorker() {
  if (!SITE_CONFIG.features.pwa || !("serviceWorker" in navigator)) return;
  const swUrl = new URL("../../sw.js", import.meta.url);
  navigator.serviceWorker.register(swUrl).then((registration) => {
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) showUpdateBanner();
      });
    });
  }).catch(() => {
    // Offline support is progressive enhancement; it must not block the dictionary.
  });
  window.addEventListener("online", () => setOfflineBanner(false));
  window.addEventListener("offline", () => setOfflineBanner(true));
  if (navigator.onLine === false) setOfflineBanner(true);
}

async function initDictionary() {
  const input = dictionaryQuery("#dictionary-search");
  const results = dictionaryQuery("#dictionary-results");
  const filtersRoot = dictionaryQuery("#dictionary-filters");
  if (!input || !results) return;
  const { items } = await loadLearningItems();
  const topics = await loadTopics();
  const searchable = items.filter((item) => item.type !== "sentence");

  const themes = [...new Set(topics.topics.map((t) => t.slug))];
  const filters = { direction: "both", theme: "all", type: "all", review: "all", difficulty: "all" };
  const difficultyAvailable = searchable.some(
    (item) => item.difficulty !== null && item.difficulty !== undefined,
  );
  let expandedId = null;

  function buildFilters() {
    if (!filtersRoot) return;
    function select(id, label, options, value, onChange) {
      const wrapper = el("label", { className: "filter-field" }, label + " ");
      const selectEl = el("select", { className: "input filter-select", id });
      for (const [val, text] of options) {
        selectEl.append(el("option", { text, attrs: { value: val } }));
      }
      selectEl.value = value;
      selectEl.addEventListener("change", () => onChange(selectEl.value));
      wrapper.append(selectEl);
      return wrapper;
    }
    replaceChildren(
      filtersRoot,
      select(
        "dict-direction",
        "Arah",
        [
          ["both", "Kedua arah"],
          ["batak", "Batak Toba"],
          ["indonesia", "Indonesia"],
        ],
        filters.direction,
        (v) => {
          filters.direction = v;
          render();
        },
      ),
      select(
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
          ["source-evidence-qualified", "source-evidence-qualified"],
          ["beta-unreviewed", "beta-unreviewed"],
        ],
        filters.review,
        (v) => {
          filters.review = v;
          render();
        },
      ),
      (() => {
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
          wrapper.title = disabledTitle;
        }
        wrapper.append(selectEl);
        return wrapper;
      })(),
    );
  }

  function matchesQuery(item) {
    const query = normalizeSearch(input.value.trim());
    if (!query) return true;
    if (filters.direction === "batak") return normalizeSearch(item.batak).includes(query);
    if (filters.direction === "indonesia") return normalizeSearch(item.indonesia).includes(query);
    return normalizeSearch(item.batak).includes(query) || normalizeSearch(item.indonesia).includes(query);
  }

  function inSelectedTheme(item) {
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
  }

  function detailNode(item) {
    const container = el("div", { className: "result-detail" });
    container.append(el("p", {}, "Status: ", el("strong", { text: formatQuality(item) })));
    const alternatives = [...(item.indonesianAlternatives ?? []), ...(item.batakAlternatives ?? [])];
    if (alternatives.length > 0) {
      container.append(el("p", { text: `Alternatif tercatat: ${alternatives.join(", ")}` }));
    }
    if (item.confidenceScore != null) {
      container.append(
        el("p", { text: `Confidence corpus: ${item.confidenceScore} (${item.confidenceLabel ?? "-"})` }),
      );
    }

    const saveButton = el("button", {
      className: "button secondary",
      text: "Simpan ke daftar latihan",
      attrs: { type: "button" },
    });
    saveButton.addEventListener("click", () => {
      try {
        setSaved(item.id, true);
        saveButton.textContent = "Tersimpan";
        saveButton.disabled = true;
        track("word_saved");
      } catch (error) {
        saveButton.textContent = "Gagal menyimpan";
      }
    });

    const correctionLink = el("a", {
      className: "button secondary",
      text: "Lapor koreksi",
      attrs: {
        href: buildCorrectionUrl({
          itemId: item.id,
          batak: item.batak,
          indonesia: item.indonesia,
          pagePath: "/dictionary/",
        }),
        target: "_blank",
        rel: "noopener noreferrer",
      },
    });
    correctionLink.addEventListener("click", () => track("correction_opened"));

    const practiceButton = el("button", {
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
    );
    // keep clicks on actions from bubbling to the row's expand/collapse toggle
    actionsRow.addEventListener("click", (event) => event.stopPropagation());
    container.append(actionsRow);
    return container;
  }

  function resultRow(item) {
    const row = el("article", { className: "result-row" });
    const query = normalizeSearch(input.value.trim());
    row.append(
      el("strong", {}, ...highlightNodes(item.batak, query)),
      el("span", {}, ...highlightNodes(item.indonesia, query)),
      pill(formatQuality(item), "", { "data-source-flag": item.sourceType || "corpus-derived" }),
    );
    row.setAttribute("role", "button");
    row.tabIndex = 0;
    row.setAttribute("aria-expanded", String(expandedId === item.id));
    const toggle = () => {
      expandedId = expandedId === item.id ? null : item.id;
      render();
    };
    row.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest(".result-detail")) return; // action clicks must not collapse the detail
      toggle(event);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
    if (expandedId === item.id) row.append(detailNode(item));
    return row;
  }

  function render() {
    const matchesList = searchable
      .filter((item) => matchesQuery(item) && inSelectedTheme(item) && matchesExtraFilters(item))
      .slice(0, 60);

    const query = normalizeSearch(input.value.trim());
    if (query.length >= 2) {
      // privacy: only the outcome bucket is sent, never the raw query
      track(matchesList.length ? "dictionary_search" : "dictionary_no_result", {
        results: String(matchesList.length),
      });
    }

    if (!matchesList.length) {
      expandedId = null;
      replaceChildren(results, el("div", { className: "card", text: "Belum ada hasil untuk pencarian itu." }));
      return;
    }

    replaceChildren(
      results,
      el("p", { className: "feedback", attrs: { role: "status" }, text: `${matchesList.length} hasil ditampilkan.` }),
      matchesList.map(resultRow),
    );
  }

  input.addEventListener("input", () => {
    expandedId = null;
    render();
  });
  buildFilters();
  render();
}

async function main() {
  await initProgress();
  showLastModified();
  initNavToggle();
  setActiveNav();
  updateProgressBadges();
  registerServiceWorker();
  sweepPlaceholders();
  await initDictionary();
}

main().catch((error) => showError(
  dictionaryQuery("main"),
  error && error.message ? error.message : "Kesalahan tidak diketahui.",
));
