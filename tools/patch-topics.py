#!/usr/bin/env python3
"""Public lessons registry drops drafts; public topics.json carries safe theme metadata."""
from pathlib import Path

p = Path("tools/build-learning-data.py")
s = p.read_text(encoding="utf-8")

# public registry: remove drafts array
old_ret = '''    public_registry = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "minPoolItemsForPublication": MIN_LESSON_POOL_ITEMS,
        "note": (
            "Supplementary draft vocabulary is NOT included here; "
            "see data/candidates/lesson-drafts.json (internal editorial input)."
        ),
        "published": published_lessons,
        "drafts": draft_lessons,
        "counts": {
            "publishedLessons": len(published_lessons),
            "draftLessons": len(draft_lessons),
        },
    }'''
new_ret = '''    public_registry = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "minPoolItemsForPublication": MIN_LESSON_POOL_ITEMS,
        "note": (
            "Published lessons only. Draft definitions live in "
            "data/candidates/lesson-drafts.json (internal editorial input); "
            "public topic pages are driven by topics.json."
        ),
        "published": published_lessons,
        "counts": {
            "publishedLessons": len(published_lessons),
            "draftLessons": len(draft_lessons),
        },
    }'''
assert old_ret in s
s = s.replace(old_ret, new_ret, 1)

# internal drafts file also carries the full draft lesson records
old_int = '''    internal_drafts = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "reviewStatusNote": (
            "All entries are needs-review editorial inputs; "
            "never publish or render publicly."
        ),
        "supplements": internal_draft_supplements,
    }
    return public_registry, internal_drafts'''
new_int = '''    internal_drafts = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "reviewStatusNote": (
            "All entries are needs-review editorial inputs; "
            "never publish or render publicly."
        ),
        "supplements": internal_draft_supplements,
        "draftLessons": draft_lessons,
    }
    return public_registry, internal_drafts'''
assert old_int in s
s = s.replace(old_int, new_int, 1)

# emit public topics.json (safe metadata + published itemIds per theme)
old_write = '''    write_json(DATA_DIR / "published" / "lessons.json", lessons_registry)
    write_json(DATA_DIR / "candidates" / "lesson-drafts.json", internal_lesson_drafts)'''
new_write = '''    write_json(DATA_DIR / "published" / "lessons.json", lessons_registry)
    write_json(DATA_DIR / "candidates" / "lesson-drafts.json", internal_lesson_drafts)

    # Public topic registry: safe metadata + published item ids per theme.
    theme_items_map = {}
    for item in [*published_words, *published_phrases]:
        for theme in item.get("themes") or []:
            theme_items_map.setdefault(theme, []).append(item["id"])
    topics_public = []
    for slug, entry in lesson_definitions["lessons"].items():
        ids = sorted(theme_items_map.get(slug, []))
        topics_public.append(
            {
                "slug": slug,
                "title": entry["title"],
                "description": entry["description"],
                "level": entry.get("level", 1),
                "poolItems": len(ids),
                "itemIds": ids,
                "publicationStatus": (
                    "published" if len(ids) >= MIN_LESSON_POOL_ITEMS else "draft"
                ),
                "reviewRollup": "corpus-derived-beta",
            }
        )
    write_json(
        DATA_DIR / "published" / "topics.json",
        {"schemaVersion": SCHEMA_VERSION, "topics": topics_public},
    )'''
assert old_write in s
s = s.replace(old_write, new_write, 1)

p.write_text(s, encoding="utf-8", newline="\n")
print("builder patched")
