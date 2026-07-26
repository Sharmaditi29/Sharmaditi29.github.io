from __future__ import annotations

import csv
import json
import re
import tempfile
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path


ARCHIVE_URL = "https://codeload.github.com/ilkermeliksitki/goethe-institute-wordlist/zip/refs/heads/main"
ROOT = Path(__file__).resolve().parents[1]
PUBLIC_OUTPUT = ROOT / "public" / "data" / "german-a1-a2-b1.json"
SRC_OUTPUT = ROOT / "src" / "data" / "germanDeck.json"
EXISTING_A1_FILE = ROOT / "public" / "data" / "goethe-a1.json"
LEVELS = ("A1", "A2", "B1")
ARTICLES = ("der", "die", "das")


CATEGORY_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("People", re.compile(r"\b(familie|frau|mann|kind|eltern|freund|freundin|arzt|ärztin|chef|kolleg|nachbar|name|geburtstag|mutter|vater|sohn|tochter|person)\b", re.I)),
    ("Home", re.compile(r"\b(wohnung|haus|zimmer|küche|bad|balkon|miete|möbel|bett|stuhl|tisch|fenster|garten|wohn)\b", re.I)),
    ("Travel", re.compile(r"\b(bahnhof|zug|bus|reise|fahr|ticket|urlaub|hotel|straße|flug|koffer|u-bahn|s-bahn|auto|fahrrad)\b", re.I)),
    ("Food", re.compile(r"\b(essen|trinken|brot|kaffee|tee|wasser|restaurant|mittagessen|abendessen|frühstück|käse|milch|obst|gemüse)\b", re.I)),
    ("Work", re.compile(r"\b(arbeit|beruf|büro|firma|chef|kolleg|stelle|bewerb|arbeits|job|praktikum)\b", re.I)),
    ("Study", re.compile(r"\b(schule|kurs|lernen|student|studium|hausaufgabe|prüfung|universität|wort|text|buch|sprache)\b", re.I)),
    ("Health", re.compile(r"\b(arzt|krank|gesund|medizin|krankenhaus|wunde|alkohol|schmerzen|apotheke|fieber|termin)\b", re.I)),
    ("Time", re.compile(r"\b(heute|morgen|gestern|woche|monat|jahr|uhr|anfang|ende|später|früh|spät|zeit)\b", re.I)),
    ("Shopping", re.compile(r"\b(kaufen|verkaufen|angebot|preis|geld|markt|laden|rechnung|rabatt|bestellen)\b", re.I)),
    ("Communication", re.compile(r"\b(frage|antwort|mail|e-mail|telefon|gespräch|sagen|sprechen|erzählen|anruf)\b", re.I)),
]


def slugify(value: str) -> str:
    normalized = value.lower()
    normalized = normalized.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return normalized.strip("-")


def parse_term(raw_term: str) -> tuple[str | None, str]:
    cleaned = re.sub(r"\(\d+\)$", "", raw_term.strip()).strip()
    for article in ARTICLES:
        prefix = f"{article} "
        if cleaned.lower().startswith(prefix):
            return article, cleaned[len(prefix) :].strip()
    return None, cleaned


def assign_category(*parts: str) -> str:
    haystack = " ".join(part for part in parts if part).lower()
    for label, pattern in CATEGORY_RULES:
        if pattern.search(haystack):
            return label
    return "Everyday"


def build_grammar_note(term: str, article: str | None, sentence: str) -> str | None:
    notes: list[str] = []
    if article:
        notes.append(f"Learn this noun with {article}.")
    if term.startswith("sich "):
        notes.append("This is a reflexive form.")
    if re.search(r"\b(haben|sein|werden)\b", term):
        notes.append("Common high-frequency verb, worth drilling in full forms.")
    if sentence.count(",") >= 2:
        notes.append("Notice the sentence structure in the example.")
    return " ".join(notes) or None


def first_sentence(text: str) -> str:
    stripped = text.strip()
    if not stripped:
        return ""
    match = re.match(r"(.+?[.!?])(?:\s|$)", stripped)
    return match.group(1).strip() if match else stripped


def load_rows(base_dir: Path, level: str) -> list[dict[str, str]]:
    level_dir = base_dir / "goethe-institute-wordlist-main" / level.lower()
    rows: list[dict[str, str]] = []

    for tsv_path in sorted(level_dir.glob("*.tsv")):
        with tsv_path.open("r", encoding="utf-8") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            for raw_row in reader:
                rows.append({
                    "german_word": (raw_row.get("german word") or "").strip(),
                    "german_sentence": (raw_row.get("german sentence") or "").strip(),
                    "english_translation": (raw_row.get("english translation") or "").strip(),
                    "level": level,
                })

    return rows


def build_cards(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    cards: list[dict[str, str]] = []
    duplicate_counter: Counter[str] = Counter()

    for row in rows:
        raw_term = row["german_word"]
        article, german = parse_term(raw_term)
        if not german:
            continue

        duplicate_key = f"{row['level']}::{german}"
        duplicate_counter[duplicate_key] += 1
        card_id = f"{row['level'].lower()}-{slugify(german)}-{duplicate_counter[duplicate_key]}"
        example_german = row["german_sentence"] or f"Beispielsatz zu {german}."
        example_english = row["english_translation"] or f"Example sentence for {german}."
        english_clue = first_sentence(example_english) or example_english

        card = {
            "id": card_id,
            "level": row["level"],
            "german": german,
            "english": english_clue,
            "category": assign_category(raw_term, example_german, example_english),
            "exampleGerman": example_german,
            "exampleEnglish": example_english,
        }

        if article:
            card["article"] = article

        grammar_note = build_grammar_note(german, article, example_german)
        if grammar_note:
            card["grammarNote"] = grammar_note

        cards.append(card)

    return cards


def main() -> None:
    a1_cards = json.loads(EXISTING_A1_FILE.read_text(encoding="utf-8"))

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        archive_path = tmp_path / "goethe-wordlist.zip"

        with urllib.request.urlopen(ARCHIVE_URL) as response:
            archive_path.write_bytes(response.read())

        with zipfile.ZipFile(archive_path) as archive:
            archive.extractall(tmp_path)

        all_rows: list[dict[str, str]] = []
        for level in ("A2", "B1"):
            all_rows.extend(load_rows(tmp_path, level))

        cards = a1_cards + build_cards(all_rows)

    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SRC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    payload = json.dumps(cards, ensure_ascii=False, indent=2) + "\n"
    PUBLIC_OUTPUT.write_text(payload, encoding="utf-8")
    SRC_OUTPUT.write_text(payload, encoding="utf-8")

    level_counts = Counter(card["level"] for card in cards)
    print(f"Generated {len(cards)} German cards: " + ", ".join(f"{level}={level_counts[level]}" for level in LEVELS))


if __name__ == "__main__":
    main()
