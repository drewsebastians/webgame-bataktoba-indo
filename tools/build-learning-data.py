#!/usr/bin/env python3
"""Build a small static learning dataset from the local alignment corpus."""

from __future__ import annotations

import json
import re
import sqlite3
from difflib import SequenceMatcher
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
CORPUS_ROOT = REPO_ROOT.parent / "batak-indo-alignment-engine"
MASTER_DB = CORPUS_ROOT / "data" / "processed" / "master_alignment_bible_only.db"
INPUT_DB = CORPUS_ROOT / "data" / "input" / "bible_batak_indo_v1.db"
DATA_DIR = REPO_ROOT / "data"

MAX_WORD_PAIRS = 720
MAX_PHRASE_PAIRS = 120
MAX_SENTENCES = 80

TOKEN_RE = re.compile(r"^[a-zA-ZÀ-ÿ'’-]+(?:-[a-zA-ZÀ-ÿ'’-]+)?$")
SPACE_RE = re.compile(r"\s+")
LEADING_MARK_RE = re.compile(r"^\([IVXLCDM]+\.\)\s*", re.IGNORECASE)

PROPER_NAME_HINTS = {
    "abimelek",
    "abimelekh",
    "abraham",
    "ahas",
    "ahimas",
    "ahimaas",
    "ahasveros",
    "ahasyweros",
    "akaya",
    "akhaya",
    "akis",
    "akhis",
    "amalek",
    "amos",
    "anatot",
    "antiokia",
    "antiokhia",
    "apek",
    "afek",
    "apollos",
    "apolos",
    "arpaksad",
    "arpakhsad",
    "aron",
    "harun",
    "aser",
    "asyer",
    "assur",
    "asyur",
    "atalia",
    "atalya",
    "aten",
    "atena",
    "azaria",
    "azarya",
    "baruk",
    "barukh",
    "balak",
    "benaia",
    "benaya",
    "benjamin",
    "benyamin",
    "berekia",
    "berekhya",
    "berseba",
    "bersyeba",
    "damaskus",
    "damsyik",
    "darius",
    "deborah",
    "eliasib",
    "elyasib",
    "elieser",
    "eliezer",
    "efesus",
    "epesus",
    "efraim",
    "epraim",
    "eleasar",
    "eleazar",
    "elipas",
    "elifas",
    "esra",
    "ezra",
    "filipi",
    "filipus",
    "galilea",
    "gedalia",
    "gedalya",
    "gibeon",
    "gilgal",
    "gideon",
    "gidion",
    "gibea",
    "gosen",
    "gosyen",
    "hagai",
    "haggai",
    "hanania",
    "hananya",
    "hasabya",
    "hasael",
    "hazael",
    "hebron",
    "hevi",
    "hewi",
    "hesbon",
    "hesybon",
    "hiskia",
    "hizkia",
    "immer",
    "imer",
    "isai",
    "isasar",
    "isakhar",
    "isak",
    "ishak",
    "ismael",
    "isboset",
    "isyboset",
    "jattu",
    "zatu",
    "jakkob",
    "yakub",
    "jakobus",
    "yakobus",
    "japet",
    "yafet",
    "jediael",
    "yediael",
    "jebusi",
    "yebus",
    "jepune",
    "yefune",
    "jehu",
    "yehu",
    "jepta",
    "yefta",
    "jeremia",
    "yeremia",
    "jerahmeel",
    "yerahmeel",
    "jerobeam",
    "yerobeam",
    "jeroham",
    "yeroham",
    "jeriko",
    "yerikho",
    "jerusalem",
    "yerusalem",
    "jetro",
    "yitro",
    "jesaya",
    "yesaya",
    "joab",
    "yoab",
    "joahas",
    "yoahas",
    "joas",
    "yoas",
    "job",
    "ayub",
    "jobab",
    "yobab",
    "johaiarib",
    "yoyarib",
    "johannes",
    "yohanes",
    "joiada",
    "yoyada",
    "joiakim",
    "yoyakim",
    "jonatan",
    "yonatan",
    "jordan",
    "yordan",
    "josep",
    "yusuf",
    "josabad",
    "yozabad",
    "josadak",
    "yozadak",
    "josapat",
    "yosafat",
    "josia",
    "yosia",
    "josua",
    "yosua",
    "judea",
    "yudea",
    "kanaan",
    "kaesarea",
    "kaisarea",
    "kades-barnea",
    "kadesh-barnea",
    "karea",
    "kareah",
    "kepas",
    "kefas",
    "kohat",
    "kehat",
    "kora",
    "korah",
    "lakis",
    "lakhis",
    "laban",
    "lamek",
    "lamekh",
    "lasarus",
    "lazarus",
    "lepi",
    "lewi",
    "maaka",
    "maakha",
    "mahir",
    "makhir",
    "manasse",
    "manasye",
    "merari",
    "mesulam",
    "mika",
    "mikha",
    "mikhael",
    "mordahai",
    "mordekhai",
    "naptali",
    "naftali",
    "nasaret",
    "nazaret",
    "nebukadnesar",
    "nebukadnezar",
    "nebusaradan",
    "nebuzaradan",
    "netania",
    "netanya",
    "netopa",
    "netofa",
    "ninive",
    "niniwe",
    "noak",
    "nuh",
    "nun",
    "obaja",
    "opra",
    "ofra",
    "palistim",
    "filistin",
    "parise",
    "farisi",
    "pilippus",
    "pilippi",
    "pinasa",
    "penaga",
    "ram",
    "aram",
    "rama",
    "ramot",
    "rahel",
    "rebekka",
    "ribka",
    "rekab",
    "rekhab",
    "remalia",
    "remalya",
    "resin",
    "rezin",
    "sabad",
    "zabad",
    "sadok",
    "zadok",
    "sakaria",
    "zakharia",
    "sallum",
    "salum",
    "sambalat",
    "sanbalat",
    "sapat",
    "safat",
    "sebadia",
    "zebaja",
    "sekania",
    "sekhanya",
    "selemia",
    "selemya",
    "semaya",
    "sepania",
    "zefanya",
    "sepatia",
    "sefaca",
    "serubabel",
    "zerubabel",
    "seruia",
    "zeruya",
    "simeon",
    "sinai",
    "sikem",
    "sikhem",
    "sikri",
    "zikhri",
    "silo",
    "simon",
    "sodom",
    "teman",
    "téman",
    "tessalonik",
    "tesalonika",
    "timoteus",
    "timotius",
    "tirus",
    "usia",
    "uzia",
    "usi",
    "uzi",
    "usiel",
    "uziel",
    "yohanan",
    "zebulon",
}

PROPER_NAME_HINTS.update(
    {
        "asap",
        "asaf",
        "bethapen",
        "bet-awen",
        "jael",
        "yael",
        "jahudi",
        "yahudi",
        "jakin",
        "yakhin",
        "janoa",
        "yanoah",
        "japia",
        "yafia",
        "jaser",
        "yaezer",
        "jedaia",
        "yedaya",
        "joel",
        "yoël",
        "juda",
        "yehuda",
        "kesar",
        "kaisar",
        "misir",
        "mesir",
        "mosa",
        "moza",
        "opel",
        "ofel",
        "reia",
        "reaya",
        "saduse",
        "saduki",
        "usa",
        "uza",
        "zebaot",
    }
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def normalize_text(value: str) -> str:
    value = LEADING_MARK_RE.sub("", value or "").strip()
    value = SPACE_RE.sub(" ", value)
    return value


def is_clean_token(value: str) -> bool:
    if not value or len(value) < 3 or len(value) > 18:
        return False
    if not TOKEN_RE.match(value):
        return False
    if value.count("-") > 1:
        return False
    if value.lower() in PROPER_NAME_HINTS:
        return False
    return True


def looks_like_transliterated_name(batak: str, indonesia: str, cooccurrence_count: int) -> bool:
    if batak in PROPER_NAME_HINTS or indonesia in PROPER_NAME_HINTS:
        return True
    similarity = SequenceMatcher(None, batak, indonesia).ratio()
    return similarity >= 0.76 and cooccurrence_count < 200


def quality_label(confidence_label: str, score: float) -> str:
    if confidence_label == "high_confidence":
        return "high confidence"
    if score >= 0.55:
        return "medium confidence"
    return "corpus-derived"


def build_word_pairs(connection: sqlite3.Connection) -> list[dict[str, object]]:
    rows = connection.execute(
        """
        SELECT
            b.normalized_form AS batak,
            i.normalized_form AS indonesia,
            tc.confidence_score,
            tc.confidence_label,
            tc.candidate_status,
            c.cooccurrence_count,
            c.dice_score
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

    seen: set[tuple[str, str]] = set()
    pairs: list[dict[str, object]] = []
    for row in rows:
        batak = row["batak"].strip().lower()
        indonesia = row["indonesia"].strip().lower()
        if not is_clean_token(batak) or not is_clean_token(indonesia):
            continue
        if looks_like_transliterated_name(batak, indonesia, int(row["cooccurrence_count"])):
            continue
        key = (batak, indonesia)
        if key in seen:
            continue
        seen.add(key)
        item = {
            "id": f"word-{len(pairs) + 1:04d}",
            "type": "word",
            "batak": batak,
            "indonesia": indonesia,
            "quality": quality_label(row["confidence_label"], row["confidence_score"]),
            "confidenceScore": round(float(row["confidence_score"]), 4),
            "confidenceLabel": row["confidence_label"],
            "cooccurrenceCount": int(row["cooccurrence_count"]),
            "source": "batak-indo-alignment-engine phase2 Bible-only co-occurrence",
        }
        pairs.append(item)
        if len(pairs) >= MAX_WORD_PAIRS:
            break
    return pairs


def build_phrase_pairs(word_pairs: list[dict[str, object]]) -> list[dict[str, object]]:
    phrase_like = [
        item
        for item in word_pairs
        if "-" in item["batak"] or "-" in item["indonesia"] or len(item["batak"]) >= 8
    ]
    return [
        {**item, "id": f"phrase-{index + 1:04d}", "type": "phrase"}
        for index, item in enumerate(phrase_like[:MAX_PHRASE_PAIRS])
    ]


def build_sentences(connection: sqlite3.Connection) -> list[dict[str, object]]:
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

    sentences: list[dict[str, object]] = []
    for row in rows:
        batak = normalize_text(row["batak_text"])
        indonesia = normalize_text(row["indo_text"])
        if '"' in batak or '"' in indonesia:
            continue
        if len(batak.split()) > 13 or len(indonesia.split()) > 13:
            continue
        sentences.append(
            {
                "id": f"sentence-{len(sentences) + 1:04d}",
                "type": "sentence",
                "batak": batak,
                "indonesia": indonesia,
                "quality": "corpus-derived beta",
                "confidenceScore": None,
                "confidenceLabel": "parallel_verse_subset",
                "source": "short parallel sentence subset from local corpus",
                "reference": row["verse_key"],
            }
        )
        if len(sentences) >= MAX_SENTENCES:
            break
    return sentences


def write_json(path: Path, payload: object) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    if not MASTER_DB.exists():
        raise SystemExit(f"Missing master database: {MASTER_DB}")
    if not INPUT_DB.exists():
        raise SystemExit(f"Missing input database: {INPUT_DB}")

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(MASTER_DB) as master:
        master.row_factory = sqlite3.Row
        word_pairs = build_word_pairs(master)

    with sqlite3.connect(INPUT_DB) as input_db:
        input_db.row_factory = sqlite3.Row
        sentences = build_sentences(input_db)

    phrase_pairs = build_phrase_pairs(word_pairs)
    learning_items = word_pairs + sentences
    metadata = {
        "generatedAt": utc_now(),
        "sourceRepository": "https://github.com/drewsebastians/batak-indo-alignment-engine",
        "sourceFiles": [
            "data/processed/master_alignment_bible_only.db",
            "data/input/bible_batak_indo_v1.db",
        ],
        "counts": {
            "wordPairs": len(word_pairs),
            "phrasePairs": len(phrase_pairs),
            "sampleSentences": len(sentences),
            "learningItems": len(learning_items),
        },
        "filtering": [
            "Use only high_confidence and medium_confidence translation candidates.",
            "Exclude stopword candidates, punctuation, duplicate pairs, empty values, very short values, very long values, and noisy symbols.",
            "Exclude a conservative list of obvious proper-name transliterations so the MVP leans toward vocabulary practice.",
            "Keep a small short-sentence beta subset from parallel corpus rows with modest length limits.",
            "Do not claim that corpus-derived pairs are verified dictionary entries.",
        ],
    }

    write_json(DATA_DIR / "word-pairs.json", {"metadata": metadata, "items": word_pairs})
    write_json(DATA_DIR / "phrase-pairs.json", {"metadata": metadata, "items": phrase_pairs})
    write_json(DATA_DIR / "sample-sentences.json", {"metadata": metadata, "items": sentences})
    write_json(DATA_DIR / "learning-items.json", {"metadata": metadata, "items": learning_items})
    print(json.dumps(metadata["counts"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
