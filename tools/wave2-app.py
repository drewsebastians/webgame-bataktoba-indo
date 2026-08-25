#!/usr/bin/env python3
"""Wave 2: initLearn published flow, memory hidden cards, dictionary extras."""
from pathlib import Path

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

# ---- A) initLearn: route published lessons to the full engine ---------------
old = """  if (!lesson) {
    replaceChildren(root, el("p", { className: "feedback", text: "Materi untuk tema ini belum tersedia." }));
    return;
  }

  const itemById"""
new = """  if (!lesson) {
    replaceChildren(root, el("p", { className: "feedback", text: "Materi untuk tema ini belum tersedia." }));
    return;
  }

  if (lesson.publicationStatus === "published") {
    track("lesson_start", { slug: lesson.slug });
    recordLessonStart(lesson.slug);
    initPublishedLesson(root, lesson, learning.items, words.items, lessons);
    return;
  }

  const itemById"""
assert old in s
s = s.replace(old, new, 1)

# ---- B) full published lesson UI --------------------------------------------
impl = '''
async function initPublishedLesson(root, lesson, learningItems, wordPool, registry) {
  const itemById = new Map(learningItems.map((item) => [item.id, item]));
  const items = lesson.itemIds.map((id) => itemById.get(id)).filter(Boolean);
  const plan = buildLessonPlan(
    lesson,
    items,
    wordPool.length >= 4 ? wordPool : items,
    makeQuestion,
  );
  let stepIndex = 0;
  let mistakes = [];
  let recallIndex = 0;

  function finish() {
    recordLessonCompletion(lesson.slug, { mistakeCount: mistakes.length });
    track("lesson_complete", { slug: lesson.slug, mistakes: String(mistakes.length) });
    const next = recommendNext(registry, lesson.slug);
    const summary = el(
      "section",
      { className: "section band" },
      el("h2", { text: "Lesson selesai" }),
      el("p", { className: "lead", text: `${items.length} item dipelajari, ${mistakes.length} kesalahan dicatat untuk review.` }),
      next
        ? el("p", { className: "feedback", text: `Rekomendasi berikutnya: ${next}.` })
        : el("p", { className: "feedback", text: "Belum ada lesson lain yang terbit." }),
    );
    const backToTop = root.closest("main")?.querySelector(".page-heading");
    if (backToTop) backToTop.after(summary);
    else root.append(summary);
  }

  function renderRecall() {
    const step = plan[stepIndex];
    const promptStep = step.prompts[recallIndex];
    const item = itemById.get(promptStep.itemId);
    const input = el("input", {
      className: "input typed-answer-input",
      attrs: { type: "text", autocomplete: "off", "aria-label": "Ketik arti", placeholder: "Ketik arti dalam Indonesia" },
    });
    const checkButton = el("button", { className: "button", text: "Periksa", attrs: { type: "button", disabled: true } });
    const feedback = el("p", { className: "feedback", attrs: { "aria-live": "polite" } });
    input.addEventListener("input", () => {
      checkButton.disabled = input.value.trim().length === 0;
    });
    checkButton.addEventListener("click", () => {
      const outcome = checkTypedAnswer(input.value, item);
      if (!outcome.correct) mistakes.push(item.id);
      feedback.textContent = outcome.correct
        ? outcome.fuzzy ? "Benar (toleransi typo)." : "Benar."
        : `Belum tepat. Yang benar: ${outcome.expected}.`;
      checkButton.disabled = true;
      input.disabled = true;
      recallIndex += 1;
      const nextButton = $("#lesson-next");
      nextButton.disabled = false;
      nextButton.focus();
    });

    replaceChildren(
      root,
      pill(`Recall ${recallIndex + 1}/${step.prompts.length}`),
      el("div", { className: "prompt" }, el("strong", { className: "prompt-text", text: promptStep.prompt })),
      el("div", { className: "action-row" }, input, checkButton),
      feedback,
      (() => {
        const b = el("button", { className: "button", id: "lesson-next", text: "Lanjut", attrs: { type: "button", disabled: true } });
        b.addEventListener("click", () => {
          stepIndex += 1;
          if (plan[stepIndex].type === "summary") finish();
          else renderStep();
        });
        return b;
      })(),
    );
  }

  function renderRecognition() {
    const step = plan[stepIndex];
    let qIndex = 0;
    function renderQ() {
      if (qIndex >= step.questions.length) {
        stepIndex += 1;
        renderStep();
        return;
      }
      const question = step.questions[qIndex];
      const feedback = el("p", { className: "feedback", attrs: { "aria-live": "polite" } });
      const optionButtons = question.options.map((option) => {
        const button = el("button", {
          className: "option",
          text: option.label,
          attrs: { type: "button" },
        });
        button.addEventListener("click", () => {
          if (button.disabled) return;
          const correct = option.isCorrect;
          if (!correct) {
            mistakes.push(question.itemId);
            button.classList.add("wrong");
          }
          [...root.querySelectorAll(".option")].forEach((o) => {
            o.disabled = true;
            if (o.textContent === question.options.find((opt) => opt.isCorrect)?.label) {
              o.classList.add("correct");
            }
          });
          recordAnswer(correct, `lesson:${lesson.slug}`, question.itemId);
          feedback.textContent = correct ? "Benar." : "Belum tepat.";
          qIndex += 1;
          const nb = $("#lesson-next");
          nb.disabled = false;
          nb.focus();
        });
        return button;
      });
      const nb = el("button", { className: "button", id: "lesson-next", text: "Lanjut", attrs: { type: "button", disabled: true } });
      nb.addEventListener("click", renderQ);
      replaceChildren(
        root,
        pill(`Pengenalan ${qIndex + 1}/${step.questions.length}`),
        el("div", { className: "prompt" }, el("strong", { className: "prompt-text", text: question.prompt })),
        el("div", { className: "options" }, optionButtons),
        feedback,
        nb,
      );
    }
    renderQ();
  }

  function renderMistakeReview() {
    const unique = collectMistakes(mistakes);
    if (!unique.length) {
      stepIndex += 1;
      renderStep();
      return;
    }
    replaceChildren(
      root,
      pill("Review kesalahan"),
      el(
        "div",
        { className: "vocab-table" },
        unique.map((id) => {
          const it = itemById.get(id);
          return el("div", { className: "vocab-row" }, el("strong", { text: it.batak }), el("span", { text: it.indonesia }));
        }),
      ),
      (() => {
        const b = el("button", { className: "button", id: "lesson-next", text: "Lanjut ke ringkasan", attrs: { type: "button" } });
        b.addEventListener("click", () => {
          stepIndex += 1;
          renderStep();
        });
        return b;
      })(),
    );
  }

  function renderIntro() {
    replaceChildren(
      root,
      el("h2", { text: lesson.title }),
      el("p", { className: "lead", text: lesson.description }),
      el("p", { className: "feedback", text: `Estimasi ${lesson.estMinutes} menit - level ${lesson.level}. Status materi: ${lesson.reviewRollup}.` }),
      (() => {
        const correction = el("a", { className: "button secondary", text: "Lapor koreksi", attrs: { href: "../correction-process/", target: "_blank", rel: "noopener noreferrer" } });
        correction.addEventListener("click", () => track("correction_opened"));
        return el("div", { className: "action-row" }, correction);
      })(),
      (() => {
        const b = el("button", { className: "button", id: "lesson-next", text: "Mulai belajar", attrs: { type: "button" } });
        b.addEventListener("click", () => {
          stepIndex += 1;
          renderStep();
        });
        return b;
      })(),
    );
  }

  function renderStep() {
    const step = plan[stepIndex];
    if (step.type === "intro") renderIntro();
    else if (step.type === "recognition") renderRecognition();
    else if (step.type === "recall") renderRecall();
    else if (step.type === "mistake-review") renderMistakeReview();
    else finish();
  }

  renderStep();
}

async function initLearn() {'''
old_fn = "async function initLearn() {"
assert old_fn in s
s = s.replace(old_fn, impl, 1)

# imports
old_imp = 'import { buildDailyQueue, computeStreak, masteryLabel, summarizeSession } from "./game/session.js";'
new_imp = (
    'import { buildDailyQueue, computeStreak, masteryLabel, summarizeSession } from "./game/session.js";\n'
    'import { buildLessonPlan, collectMistakes, recommendNext } from "./game/lesson-engine.js";\n'
    'import {\n'
    '  getDueItems as _getDueItems,\n'
    '  recordLessonCompletion,\n'
    '  recordLessonStart,\n'
    "} from \"./progress.js\";"
)
assert old_imp in s
s = s.replace(old_imp, new_imp, 1)
# merge duplicate getDueItems import (already imported above); remove alias line
s = s.replace('  getDueItems as _getDueItems,\n', '')

# ---- C) Memory hides unrevealed cards ---------------------------------------
old_mem = """      const isMatched = state.matched.has(card.id);
      return el("button", {
        className: `match-card${isMatched ? " matched" : ""}`,
        text: card.text,"""
new_mem = """      const isMatched = state.matched.has(card.id);
      const isSelected = state.selected.some((sel) => sel.id === card.id && sel.side === card.side);
      const revealed = isMatched || isSelected;
      return el("button", {
        className: `match-card${isMatched ? " matched" : ""}${revealed ? "" : " face-down"}`,
        text: revealed ? card.text : "?",
        attrs: {
          "aria-label": revealed ? undefined : "Kartu tertutup",
        },"""
assert old_mem in s
s = s.replace(old_mem, new_mem, 1)

app.write_text(s, encoding="utf-8", newline="\n")
print("app wave2 applied")
