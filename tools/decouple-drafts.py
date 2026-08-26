#!/usr/bin/env python3
from pathlib import Path

# data.js: topics loader
d = Path("assets/js/data.js")
s = d.read_text(encoding="utf-8")
if "loadTopics" not in s:
    s += '\nexport async function loadTopics() {\n  return loadDataset("topics.json");\n}\n'
    d.write_text(s, encoding="utf-8", newline="\n")

app = Path("assets/js/app.js")
s = app.read_text(encoding="utf-8")

s = s.replace(
    'import { loadLearningItems, loadLessons, loadSentences, loadWordPairs } from "./data.js";',
    'import { loadLearningItems, loadLessons, loadSentences, loadTopics, loadWordPairs } from "./data.js";',
    1,
)

# initDictionary themes
old = """  const lessons = await loadLessons();
  const searchable = items.filter((item) => item.type !== "sentence");

  const themes = [...new Set([...lessons.published, ...lessons.drafts].map((l) => l.slug))];"""
new = """  const topics = await loadTopics();
  const searchable = items.filter((item) => item.type !== "sentence");

  const themes = [...new Set(topics.topics.map((t) => t.slug))];"""
assert old in s
s = s.replace(old, new, 1)

# flashcards themes
old = """  const lessons = await loadLessons();
  const themes = [...new Set([...lessons.published, ...lessons.drafts].map((l) => l.slug))];"""
new = """  const topics = await loadTopics();
  const themes = [...new Set(topics.topics.map((t) => t.slug))];"""
assert old in s
s = s.replace(old, new, 1)

# initLearn: published-only lookup; draft topics via topics.json
old = """  const [lessons, learning, words] = await Promise.all([loadLessons(), loadLearningItems(), loadWordPairs()]);
  const lesson = [...lessons.published, ...lessons.drafts].find((entry) => entry.slug === theme);"""
new = """  const [topics, learning, words] = await Promise.all([loadTopics(), loadLearningItems(), loadWordPairs()]);
  const lesson = lessons.published.find((entry) => entry.slug === theme);
  const topicMeta = topics.topics.find((entry) => entry.slug === theme);"""
assert old in s
s = s.replace(old, new, 1)

old = """  if (lesson.publicationStatus === "published") {
    track("lesson_start", { slug: lesson.slug });
    recordLessonStart(lesson.slug);
    initPublishedLesson(root, lesson, learning.items, words.items, lessons);
    return;
  }"""
new = """  if (lesson && lesson.publicationStatus === "published") {
    track("lesson_start", { slug: lesson.slug });
    recordLessonStart(lesson.slug);
    initPublishedLesson(root, lesson, learning.items, words.items, lessons);
    return;
  }
  if (!topicMeta) {
    replaceChildren(root, el("p", { className: "feedback", text: "Materi untuk tema ini belum tersedia." }));
    return;
  }"""
assert old in s
s = s.replace(old, new, 1)

# status line + supplement message now derive from topicMeta / registry note
old = """      text:
        lesson.publicationStatus === "published"
          ? `Lesson latihan aktif: ${lesson.counts.poolItems} item corpus.`
          : `Status: lesson latihan penuh belum terbit (butuh minimal ${lessons.minPoolItemsForPublication} item corpus per tema; tema ini punya ${lesson.counts.poolItems}). Latihan mandiri di bawah tetap tersedia.`,
    }),
  );"""
new = """      text:
        topicMeta.publicationStatus === "published"
          ? `Lesson latihan aktif: ${topicMeta.poolItems} item corpus.`
          : `Status: lesson latihan penuh belum terbit (butuh minimal ${lessons.minPoolItemsForPublication} item corpus per tema; tema ini punya ${topicMeta.poolItems}). Latihan mandiri di bawah tetap tersedia.`,
    }),
  );"""
assert old in s
s = s.replace(old, new, 1)

old = """  if (lesson.counts.supplementItems > 0 || lesson.publicationStatus !== "published") {
    children.push(
      el("p", {
        className: "feedback",
        attrs: { role: "note" },
        text: `Materi tambahan untuk tema ini sedang menunggu review penutur (${lesson.counts.supplementItems} item). Kata-kata tersebut belum ditampilkan sebagai materi belajar.`,
      }),
    );
  }"""
new = """  children.push(
    el("p", {
      className: "feedback",
      attrs: { role: "note" },
      text: "Materi tambahan menunggu review penutur dan tidak ditampilkan sebagai materi belajar.",
    }),
  );"""
assert old in s
s = s.replace(old, new, 1)

# mini practice gate uses topicMeta pool size
old = "  if (poolItems.length >= 4) {"
assert old in s

app.write_text(s, encoding="utf-8", newline="\n")
print("runtime decoupled from drafts")
