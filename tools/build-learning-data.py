#!/usr/bin/env python3
"""Build the learning dataset through an explicit editorial pipeline.

Stages:
  raw        -> full extraction with provenance, no destructive filtering
  candidates -> cleaned, deduplicated, stable-ID items (publicationStatus: candidate)
  published  -> items that pass publication rules (what the public site reads)

Also emits:
  data/reports/data-quality-report.json
  data/migration/id-map.json   (legacy sequential id -> stable id)

Rules enforced here:
  - A phrase MUST contain >= 2 meaningful tokens on both sides after
    normalization. Single-token "phrases" are rejected at candidate stage.
  - Within a published pool, normalized batak labels are unique and
    normalized indonesia labels are unique; collisions are merged into
    alternatives so question options can never look identical.
  - No item is ever marked human-reviewed unless a reviewed source file says so.
"""

from __future__ import annotations

import hashlib
import json
import re
import sqlite3
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
CORPUS_ROOT = REPO_ROOT.parent / "batak-indo-alignment-engine"
MASTER_DB = CORPUS_ROOT / "data" / "processed" / "master_alignment_bible_only.db"
INPUT_DB = CORPUS_ROOT / "data" / "input" / "bible_batak_indo_v1.db"
DATA_DIR = REPO_ROOT / "data"
LEGACY_DIR = DATA_DIR / "legacy"

SCHEMA_VERSION = 2

MAX_WORD_PAIRS = 720
MAX_PHRASE_PAIRS = 120
MAX_SENTENCES = 80
MAX_RAW_SENTENCES = 2000

MIN_WORD_TOKEN_LEN = 3
MAX_WORD_TOKEN_LEN = 18

TOKEN_RE = re.compile(r"^[a-zA-ZÀ-ÿ'’-]+(?:-[a-zA-ZÀ-ÿ'’-]+)?$")
SPACE_RE = re.compile(r"\s+")
LEADING_MARK_RE = re.compile(r"^\([IVXLCDM]+\.\)\s*", re.IGNORECASE)

PROPER_NAME_HINTS = {
    "abimelek", "abimelekh", "abraham", "ahas", "ahimas", "ahimaas", "ahasveros",
    "ahasyweros", "akaya", "akhaya", "akis", "akhis", "amalek", "amos", "anatot",
    "antiokia", "antiokhia", "apek", "afek", "apollos", "apolos", "arpaksad",
    "arpakhsad", "aron", "harun", "aser", "asyer", "assur", "asyur", "atalia",
    "atalya", "aten", "atena", "azaria", "azarya", "baruk", "barukh", "balak",
    "benaia", "benaya", "benjamin", "benyamin", "berekia", "berekhya", "berseba",
    "bersyeba", "damaskus", "damsyik", "darius", "deborah", "eliasib", "elyasib",
    "elieser", "eliezer", "efesus", "epesus", "efraim", "epraim", "eleasar",
    "eleazar", "elipas", "elifas", "esra", "ezra", "filipi", "filipus", "galilea",
    "gedalia", "gedalya", "gibeon", "gilgal", "gideon", "gidion", "gibea", "gosen",
    "gosyen", "hagai", "haggai", "hanania", "hananya", "hasabya", "hasael",
    "hazael", "hebron", "hevi", "hewi", "hesbon", "hesybon", "hiskia", "hizkia",
    "immer", "imer", "isai", "isasar", "isakhar", "isak", "ishak", "ismael",
    "isboset", "isyboset", "jattu", "zatu", "jakkob", "yakub", "jakobus",
    "yakobus", "japet", "yafet", "jediael", "yediael", "jebusi", "yebus",
    "jepune", "yefune", "jehu", "yehu", "jepta", "yefta", "jeremia", "yeremia",
    "jerahmeel", "yerahmeel", "jerobeam", "yerobeam", "jeroham", "yeroham",
    "jeriko", "yerikho", "jerusalem", "yerusalem", "jetro", "yitro", "jesaya",
    "yesaya", "joab", "yoab", "joahas", "yoahas", "joas", "yoas", "job", "ayub",
    "jobab", "yobab", "johaiarib", "yoyarib", "johannes", "yohanes", "joiada",
    "yoyada", "joiakim", "yoyakim", "jonatan", "yonatan", "jordan", "yordan",
    "josep", "yusuf", "josabad", "yozabad", "josadak", "yozadak", "josapat",
    "yosafat", "josia", "yosia", "josua", "yosua", "judea", "yudea", "kanaan",
    "kaesarea", "kaisarea", "kades-barnea", "kadesh-barnea", "karea", "kareah",
    "kepas", "kefas", "kohat", "kehat", "kora", "korah", "lakis", "lakhis",
    "laban", "lamek", "lamekh", "lasarus", "lazarus", "lepi", "lewi", "maaka",
    "maakha", "mahir", "makhir", "manasse", "manasye", "merari", "mesulam",
    "mika", "mikha", "mikhael", "mordahai", "mordekhai", "naptali", "naftali",
    "nasaret", "nazaret", "nebukadnesar", "nebukadnezar", "nebusaradan",
    "nebuzaradan", "netania", "netanya", "netopa", "netofa", "ninive", "niniwe",
    "noak", "nuh", "nun", "obaja", "opra", "ofra", "palistim", "filistin",
    "parise", "farisi", "pilippus", "pilippi", "pinasa", "penaga", "ram",
    "aram", "rama", "ramot", "rahel", "rebekka", "ribka", "rekab", "rekhab",
    "remalia", "remalya", "resin", "rezin", "sabad", "zabad", "sadok", "zadok",
    "sakaria", "zakharia", "sallum", "salum", "sambalat", "sanbalat", "sapat",
    "safat", "sebadia", "zebaja", "sekania", "sekhanya", "selemia", "selemya",
    "semaya", "sepania", "zefanya", "sepatia", "sefaca", "serubabel",
    "zerubabel", "seruia", "zeruya", "simeon", "sinai", "sikem", "sikhem",
    "sikri", "zikhri", "silo", "simon", "sodom", "teman", "téman",
    "tessalonik", "tesalonika", "timoteus", "timotius", "tirus", "usia", "uzia",
    "usi", "uzi", "usiel", "uziel", "yohanan", "zebulon",
    # second conservative batch
    "asap", "asaf", "bethapen", "bet-awen", "jael", "yael", "jahudi", "yahudi",
    "jakin", "yakhin", "janoa", "yanoah", "japia", "yafia", "jaser", "yaezer",
    "jedaia", "yedaya", "joel", "yoël", "juda", "yehuda", "kesar", "kaisar",
    "misir", "mesir", "mosa", "moza", "opel", "ofel", "reia", "reaya",
    "saduse", "saduki", "usa", "uza", "zebaot",
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def normalize_text(value: str) -> str:
    value = LEADING_MARK_RE.sub("", value or "").strip()
    value = SPACE_RE.sub(" ", value)
    return value


def normalize_label(value: object) -> str:
    """Mirror of assets/js/utils/normalize.js#normalizeLabel."""
    value = unicodedata.normalize("NFC", str(value if value is not None else ""))
    value = SPACE_RE.sub(" ", value).strip().lower()
    return value


def tokenize_label(value: object) -> list[str]:
    normalized = normalize_label(value)
    if not normalized:
        return []
    return [token for token in normalized.split(" ") if token]


def stable_id(prefix: str, *parts: str) -> str:
    digest = hashlib.sha256("\x1f".join(parts).encode("utf-8")).hexdigest()[:10]
    return f"{prefix}-{digest}"


def is_clean_token(value: str) -> bool:
    if not value or len(value) < MIN_WORD_TOKEN_LEN or len(value) > MAX_WORD_TOKEN_LEN:
        return False
    if not TOKEN_RE.match(value):
        return False
    if value.count("-") > 1:
        return False
    if value in PROPER_NAME_HINTS:
        return False
    return True


def looks_like_transliterated_name(batak: str, indonesia: str, cooccurrence_count: int) -> bool:
    if batak in PROPER_NAME_HINTS or indonesia in PROPER_NAME_HINTS:
        return True
    from difflib import SequenceMatcher

    similarity = SequenceMatcher(None, batak, indonesia).ratio()
    return similarity >= 0.76 and cooccurrence_count < 200


def quality_label(confidence_label: str, score: float) -> str:
    if confidence_label == "high_confidence":
        return "high confidence"
    if score >= 0.55:
        return "medium confidence"
    return "corpus-derived"


# ---------------------------------------------------------------------------
# Stage 1: raw extraction
# ---------------------------------------------------------------------------


def extract_raw_word_candidates(connection: sqlite3.Connection) -> list[dict[str, object]]:
    rows = connection.execute(
        """
        SELECT
            b.normalized_form AS batak,
            i.normalized_form AS indonesia,
            tc.confidence_score,
            tc.confidence_label,
            tc.candidate_status,
            tc.generation_method,
            c.cooccurrence_count,
            c.dice_score,
            c.adjusted_dice_score
        FROM translation_candidates tc
        JOIN lexical_entries b ON b.lexical_entry_id = tc.batak_lexical_entry_id
        JOIN lexical_entries i ON i.lexical_entry_id = tc.indo_lexical_entry_id
        JOIN cooccurrence_stats c ON c.cooccurrence_id = tc.cooccurrence_id
        WHERE tc.confidence_label IN ('high_confidence', 'medium_confidence')
            AND b.token_type = 'word'
            AND i.token_type = 'word'
            AND b.is_stopword_candidate = 0
            AND i.is_stopword_candidate = 0
            AND b.normalized_form != i.normalized_form
        ORDER BY
            CASE tc.confidence_label WHEN 'high_confidence' THEN 0 ELSE 1 END,
            tc.confidence_score DESC,
            c.cooccurrence_count DESC
        """
    ).fetchall()

    raw: list[dict[str, object]] = []
    for rank, row in enumerate(rows):
        raw.append(
            {
                "rank": rank,
                "batakRaw": row["batak"],
                "indonesiaRaw": row["indonesia"],
                "confidenceScore": round(float(row["confidence_score"]), 4),
                "confidenceLabel": row["confidence_label"],
                "corpusCandidateStatus": row["candidate_status"],
                "generationMethod": row["generation_method"],
                "cooccurrenceCount": int(row["cooccurrence_count"]),
                "diceScore": round(float(row["dice_score"]), 4),
                "adjustedDiceScore": (
                    round(float(row["adjusted_dice_score"]), 4)
                    if row["adjusted_dice_score"] is not None
                    else None
                ),
            }
        )
    return raw


def extract_raw_phrase_candidates(connection: sqlite3.Connection) -> list[dict[str, object]]:
    """Genuine multi-token candidates only.

    The corpus tokenizer produces word-level entries, so this is expected to be
    empty today. The extraction stays explicit so that a future corpus version
    with phrase-level entries flows through without code changes.
    """
    rows = connection.execute(
        """
        SELECT
            b.normalized_form AS batak,
            i.normalized_form AS indonesia,
            tc.confidence_score,
            tc.confidence_label,
            tc.candidate_status,
            tc.generation_method,
            c.cooccurrence_count
        FROM translation_candidates tc
        JOIN lexical_entries b ON b.lexical_entry_id = tc.batak_lexical_entry_id
        JOIN lexical_entries i ON i.lexical_entry_id = tc.indo_lexical_entry_id
        JOIN cooccurrence_stats c ON c.cooccurrence_id = tc.cooccurrence_id
        WHERE tc.confidence_label IN ('high_confidence', 'medium_confidence')
            AND b.normalized_form LIKE '% %'
            AND i.normalized_form LIKE '% %'
            AND b.normalized_form != i.normalized_form
        ORDER BY tc.confidence_score DESC, c.cooccurrence_count DESC
        """
    ).fetchall()

    raw: list[dict[str, object]] = []
    for rank, row in enumerate(rows):
        raw.append(
            {
                "rank": rank,
                "batakRaw": row["batak"],
                "indonesiaRaw": row["indonesia"],
                "confidenceScore": round(float(row["confidence_score"]), 4),
                "confidenceLabel": row["confidence_label"],
                "corpusCandidateStatus": row["candidate_status"],
                "generationMethod": row["generation_method"],
                "cooccurrenceCount": int(row["cooccurrence_count"]),
            }
        )
    return raw


def extract_raw_sentences(connection: sqlite3.Connection) -> list[dict[str, object]]:
    rows = connection.execute(
        """
        SELECT verse_key, batak_text, indo_text
        FROM verses
        WHERE length(batak_text) BETWEEN 18 AND 92
            AND length(indo_text) BETWEEN 18 AND 92
            AND batak_text NOT LIKE '%;%'
            AND indo_text NOT LIKE '%;%'
        ORDER BY verse_id
        """
    ).fetchall()

    raw: list[dict[str, object]] = []
    for row in rows:
        batak = normalize_text(row["batak_text"])
        indonesia = normalize_text(row["indo_text"])
        if '"' in batak or '"' in indonesia:
            continue
        if len(batak.split()) > 13 or len(indonesia.split()) > 13:
            continue
        raw.append(
            {
                "verseKey": row["verse_key"],
                "batakText": batak,
                "indonesiaText": indonesia,
            }
        )
        if len(raw) >= MAX_RAW_SENTENCES:
            break
    return raw


# ---------------------------------------------------------------------------
# Stage 2: candidates (clean + dedupe + merge label collisions)
# ---------------------------------------------------------------------------


class Report:
    def __init__(self) -> None:
        self.excluded: dict[str, int] = {}
        self.mergedDuplicates: list[dict[str, object]] = []
        self.phraseRejections: dict[str, int] = {}
        self.notes: list[str] = []

    def exclude(self, reason: str) -> None:
        self.excluded[reason] = self.excluded.get(reason, 0) + 1

    def reject_phrase(self, reason: str) -> None:
        self.phraseRejections[reason] = self.phraseRejections.get(reason, 0) + 1

    def to_dict(self) -> dict[str, object]:
        return {
            "excludedByReason": self.excluded,
            "mergedDuplicateLabels": self.mergedDuplicates[:200],
            "mergedDuplicateLabelTotal": len(self.mergedDuplicates),
            "phraseRejections": self.phraseRejections,
            "notes": self.notes,
        }


def clean_word_pair(raw_item: dict[str, object], report: Report) -> dict[str, object] | None:
    batak = raw_item["batakRaw"].strip().lower()
    indonesia = raw_item["indonesiaRaw"].strip().lower()
    if not is_clean_token(batak):
        report.exclude("word.batak-token-not-clean")
        return None
    if not is_clean_token(indonesia):
        report.exclude("word.indonesia-token-not-clean")
        return None
    if looks_like_transliterated_name(
        batak, indonesia, int(raw_item["cooccurrenceCount"])
    ):
        report.exclude("word.probable-transliterated-name")
        return None
    return {**raw_item, "batak": batak, "indonesia": indonesia}


def dedupe_exact_pairs(items: list[dict[str, object]], report: Report) -> list[dict[str, object]]:
    seen: set[tuple[str, str]] = set()
    unique: list[dict[str, object]] = []
    for item in items:
        key = (normalize_label(item["batak"]), normalize_label(item["indonesia"]))
        if key in seen:
            report.exclude("candidate.exact-duplicate-pair")
            continue
        seen.add(key)
        unique.append(item)
    return unique


def merge_label_collisions(
    items: list[dict[str, object]], primary_key: str, alternative_field: str, report: Report
) -> list[dict[str, object]]:
    """Keep the highest-ranked item per normalized primary label and fold the
    rest into its alternatives list."""
    groups: dict[str, dict[str, object]] = {}
    order: list[str] = []
    for item in items:
        label = normalize_label(item[primary_key])
        if label not in groups:
            groups[label] = item
            order.append(label)
            continue
        primary = groups[label]
        alternative = item["indonesia" if primary_key == "batak" else "batak"]
        alternatives: list[str] = primary.setdefault(alternative_field, [])
        if alternative not in alternatives:
            alternatives.append(alternative)
        primary.setdefault("mergedFrom", []).append(item["batak"] if primary_key == "batak" else item["indonesia"])
        report.mergedDuplicates.append(
            {
                "field": primary_key,
                "label": label,
                "keptId": primary.get("id"),
                "foldedAlternative": alternative,
            }
        )
    return [groups[label] for label in order]


def build_word_candidates(raw_items: list[dict[str, object]], report: Report) -> list[dict[str, object]]:
    cleaned: list[dict[str, object]] = []
    for raw_item in raw_items:
        pair = clean_word_pair(raw_item, report)
        if pair is not None:
            cleaned.append(pair)

    cleaned = dedupe_exact_pairs(cleaned, report)

    candidates: list[dict[str, object]] = []
    seen_ids: set[str] = set()
    for item in cleaned[: MAX_WORD_PAIRS * 2]:  # headroom before merges
        identifier = stable_id("word", normalize_label(item["batak"]), normalize_label(item["indonesia"]))
        if identifier in seen_ids:
            report.exclude("candidate.stable-id-collision")
            continue
        seen_ids.add(identifier)
        candidates.append(
            {
                "id": identifier,
                "schemaVersion": SCHEMA_VERSION,
                "type": "word",
                "batak": item["batak"],
                "indonesia": item["indonesia"],
                "indonesianAlternatives": [],
                "batakAlternatives": [],
                "themes": [],
                "difficulty": None,
                "sourceType": "corpus-derived",
                "quality": quality_label(item["confidenceLabel"], item["confidenceScore"]),
                "confidenceScore": item["confidenceScore"],
                "confidenceLabel": item["confidenceLabel"],
                "cooccurrenceCount": item["cooccurrenceCount"],
                "corpusCandidateStatus": item["corpusCandidateStatus"],
                "source": "batak-indo-alignment-engine phase2 Bible-only co-occurrence",
                "reviewStatus": "corpus-derived",
                "publicationStatus": "candidate",
            }
        )

    candidates = merge_label_collisions(candidates, "batak", "indonesianAlternatives", report)
    candidates = merge_label_collisions(candidates, "indonesia", "batakAlternatives", report)

    over_limit = len(candidates) - MAX_WORD_PAIRS
    if over_limit > 0:
        for _ in range(over_limit):
            report.exclude("word.pool-limit")
        candidates = candidates[:MAX_WORD_PAIRS]

    return candidates


def build_phrase_candidates(raw_items: list[dict[str, object]], report: Report) -> list[dict[str, object]]:
    candidates: list[dict[str, object]] = []
    for item in raw_items:
        batak_tokens = tokenize_label(item["batakRaw"])
        indonesia_tokens = tokenize_label(item["indonesiaRaw"])
        # Hard rule: a phrase has at least two meaningful tokens per side.
        if len(batak_tokens) < 2 or len(indonesia_tokens) < 2:
            report.reject_phrase("phrase.fewer-than-two-tokens")
            continue
        identifier = stable_id("phrase", normalize_label(item["batakRaw"]), normalize_label(item["indonesiaRaw"]))
        candidates.append(
            {
                "id": identifier,
                "schemaVersion": SCHEMA_VERSION,
                "type": "phrase",
                "batak": normalize_label(item["batakRaw"]),
                "indonesia": normalize_label(item["indonesiaRaw"]),
                "themes": [],
                "difficulty": None,
                "sourceType": "corpus-derived",
                "quality": quality_label(item["confidenceLabel"], item["confidenceScore"]),
                "confidenceScore": item["confidenceScore"],
                "confidenceLabel": item["confidenceLabel"],
                "cooccurrenceCount": item["cooccurrenceCount"],
                "corpusCandidateStatus": item["corpusCandidateStatus"],
                "source": "batak-indo-alignment-engine phase2 Bible-only co-occurrence",
                "reviewStatus": "corpus-derived",
                "publicationStatus": "candidate",
            }
        )
        if len(candidates) >= MAX_PHRASE_PAIRS:
            break

    candidates.sort(key=lambda item: -(item["confidenceScore"] or 0))
    return candidates


def build_sentence_candidates(raw_items: list[dict[str, object]]) -> list[dict[str, object]]:
    candidates: list[dict[str, object]] = []
    seen: set[tuple[str, str]] = set()
    for item in raw_items:
        key = (item["batakText"], item["indonesiaText"])
        if key in seen:
            continue
        seen.add(key)
        candidates.append(
            {
                "id": stable_id("sentence", item["verseKey"], item["batakText"]),
                "schemaVersion": SCHEMA_VERSION,
                "type": "sentence",
                "batak": item["batakText"],
                "indonesia": item["indonesiaText"],
                "reference": item["verseKey"],
                "sourceType": "parallel-corpus",
                "quality": "corpus-derived beta",
                "reviewStatus": "beta-unreviewed",
                "publicationStatus": "candidate",
            }
        )
        if len(candidates) >= MAX_SENTENCES:
            break
    return candidates


# ---------------------------------------------------------------------------
# Stage 3: publication rules
# ---------------------------------------------------------------------------


def passes_publication_rules(item: dict[str, object]) -> bool:
    if not item.get("id") or not item.get("type"):
        return False
    if not str(item.get("batak") or "").strip():
        return False
    if not str(item.get("indonesia") or "").strip():
        return False
    if not item.get("reviewStatus") or not item.get("publicationStatus"):
        return False
    if item["type"] == "phrase":
        if len(tokenize_label(item["batak"])) < 2 or len(tokenize_label(item["indonesia"])) < 2:
            return False
    return True


def publish(stage_items: list[dict[str, object]]) -> tuple[list[dict[str, object]], int]:
    published: list[dict[str, object]] = []
    rejected = 0
    for item in stage_items:
        if passes_publication_rules(item):
            published.append({**item, "publicationStatus": "published"})
        else:
            rejected += 1
    return published, rejected


# ---------------------------------------------------------------------------
# Stage 4: migration map from legacy sequential ids
# ---------------------------------------------------------------------------


def build_migration_map(published_words: list[dict[str, object]],
                        published_phrases: list[dict[str, object]],
                        published_sentences: list[dict[str, object]]) -> dict[str, object]:
    lookup: dict[tuple[str, str], str] = {}
    for item in [*published_words, *published_phrases]:
        lookup[(normalize_label(item["batak"]), normalize_label(item["indonesia"]))] = item["id"]
    sentence_lookup = {(item["batak"], item["indonesia"]): item["id"] for item in published_sentences}

    mappings: dict[str, str] = {}
    unmapped: list[dict[str, str]] = []

    legacy_files = [
        ("word-pairs.json", lookup),
        ("phrase-pairs.json", lookup),
        ("sample-sentences.json", sentence_lookup),
    ]
    for file_name, table in legacy_files:
        path = LEGACY_DIR / file_name
        if not path.exists():
            continue
        legacy_payload = json.loads(path.read_text(encoding="utf-8"))
        for legacy_item in legacy_payload.get("items", []):
            legacy_id = legacy_item.get("id")
            if not legacy_id:
                continue
            target = table.get(
                (normalize_label(legacy_item.get("batak")), normalize_label(legacy_item.get("indonesia")))
            )
            if target:
                mappings[legacy_id] = target
            else:
                unmapped.append({"legacyId": legacy_id, "file": file_name})

    return {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "note": "Maps legacy sequential ids to stable content-hash ids. Keep this file forever.",
        "mappingCount": len(mappings),
        "unmappedCount": len(unmapped),
        "mappings": mappings,
        "unmapped": unmapped[:100],
    }


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------


def metadata(counts: dict[str, int], extra_notes: list[str] | None = None) -> dict[str, object]:
    notes = [
        "Confidence is a statistical signal, not a linguistic guarantee.",
        "All word data is corpus-derived; no item claims human review.",
        "Sentence subset is beta-unreviewed parallel-corpus material.",
        "Phrases must have at least two meaningful tokens per side; otherwise the phrase set stays empty.",
    ]
    if extra_notes:
        notes.extend(extra_notes)
    return {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "sourceRepository": "https://github.com/drewsebastians/batak-indo-alignment-engine",
        "sourceFiles": [
            "data/processed/master_alignment_bible_only.db",
            "data/input/bible_batak_indo_v1.db",
        ],
        "counts": counts,
        "filtering": [
            "Use only high_confidence and medium_confidence translation candidates.",
            "Exclude stopword candidates, punctuation, duplicates, empty values, over-short/over-long tokens, and noisy symbols.",
            "Exclude a conservative list of obvious proper-name transliterations.",
            "Merge duplicate visible labels into recorded alternatives instead of keeping ambiguous options.",
            "Cap short-sentence beta subset with simple length limits.",
        ],
        "editorialNotes": notes,
    }


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    if not MASTER_DB.exists():
        raise SystemExit(f"Missing master database: {MASTER_DB}")
    if not INPUT_DB.exists():
        raise SystemExit(f"Missing input database: {INPUT_DB}")

    report = Report()

    with sqlite3.connect(MASTER_DB) as master:
        master.row_factory = sqlite3.Row
        raw_words = extract_raw_word_candidates(master)
        raw_phrases = extract_raw_phrase_candidates(master)

    with sqlite3.connect(INPUT_DB) as input_db:
        input_db.row_factory = sqlite3.Row
        raw_sentences = extract_raw_sentences(input_db)

    # raw stage (never filtered destructively)
    write_json(DATA_DIR / "raw" / "word-candidates.json", {"extractedAt": utc_now(), "items": raw_words})
    write_json(DATA_DIR / "raw" / "phrase-candidates.json", {"extractedAt": utc_now(), "items": raw_phrases})
    write_json(DATA_DIR / "raw" / "sentence-candidates.json", {"extractedAt": utc_now(), "items": raw_sentences})

    # candidate stage
    word_candidates = build_word_candidates(raw_words, report)
    phrase_candidates = build_phrase_candidates(raw_phrases, report)
    sentence_candidates = build_sentence_candidates(raw_sentences)

    write_json(DATA_DIR / "candidates" / "word-pairs.json", {"metadata": metadata({}), "items": word_candidates})
    write_json(DATA_DIR / "candidates" / "phrase-pairs.json", {"metadata": metadata({}), "items": phrase_candidates})
    write_json(DATA_DIR / "candidates" / "sample-sentences.json", {"metadata": metadata({}), "items": sentence_candidates})

    # published stage
    published_words, words_rejected = publish(word_candidates)
    published_phrases, phrases_rejected = publish(phrase_candidates)
    published_sentences, sentences_rejected = publish(sentence_candidates)

    if words_rejected or phrases_rejected or sentences_rejected:
        report.notes.append(
            f"Publication rule rejects: words={words_rejected}, phrases={phrases_rejected}, sentences={sentences_rejected}."
        )

    learning_items = published_words + published_phrases + published_sentences

    counts = {
        "rawWordRows": len(raw_words),
        "rawPhraseRows": len(raw_phrases),
        "rawSentenceRows": len(raw_sentences),
        "wordCandidates": len(word_candidates),
        "phraseCandidates": len(phrase_candidates),
        "sentenceCandidates": len(sentence_candidates),
        "wordPairs": len(published_words),
        "phrasePairs": len(published_phrases),
        "sampleSentences": len(published_sentences),
        "learningItems": len(learning_items),
    }

    common_meta = metadata(counts)
    write_json(DATA_DIR / "published" / "word-pairs.json", {"metadata": common_meta, "items": published_words})
    write_json(DATA_DIR / "published" / "phrase-pairs.json", {"metadata": common_meta, "items": published_phrases})
    write_json(DATA_DIR / "published" / "sample-sentences.json", {"metadata": common_meta, "items": published_sentences})
    write_json(DATA_DIR / "published" / "learning-items.json", {"metadata": common_meta, "items": learning_items})

    migration = build_migration_map(published_words, published_phrases, published_sentences)
    write_json(DATA_DIR / "migration" / "id-map.json", migration)

    quality_report = {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": utc_now(),
        "stageCounts": counts,
        **report.to_dict(),
        "migration": {
            "mapped": migration["mappingCount"],
            "unmapped": migration["unmappedCount"],
        },
    }
    write_json(DATA_DIR / "reports" / "data-quality-report.json", quality_report)

    print(json.dumps(counts, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
