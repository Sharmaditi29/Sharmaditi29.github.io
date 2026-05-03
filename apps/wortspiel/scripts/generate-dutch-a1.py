from __future__ import annotations

import json
import re
import unicodedata
import urllib.request
from io import BytesIO
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "This script needs pypdf. Install it with `python3 -m pip install --user pypdf`."
    ) from exc


SOURCE_URL = "https://nt2taalmenu.nl/nt2/lijsten/engels_al.pdf"
OUTPUT_FILE = Path(__file__).resolve().parent.parent / "public" / "data" / "dutch-a1.json"

CATEGORY_RULES: list[tuple[str, re.Pattern[str]]] = [
    (
        "Greetings",
        re.compile(
            r"\b(hello|goodbye|please|thanks|farewell|sorry|welcome|yes please)\b",
            re.I,
        ),
    ),
    (
        "Food & drink",
        re.compile(
            r"\b(apple|bread|coffee|tea|water|potato|banana|fruit|meal|restaurant|drink|milk|beer|wine|cake|butter|sandwich|soup)\b",
            re.I,
        ),
    ),
    (
        "People",
        re.compile(
            r"\b(man|woman|child|friend|family|boy|girl|doctor|teacher|grandmother|worker|boss|person|surname)\b",
            re.I,
        ),
    ),
    (
        "Home",
        re.compile(
            r"\b(house|room|door|bed|balcony|flat|address|street|neighbourhood|map|hall|furniture|bath)\b",
            re.I,
        ),
    ),
    (
        "Travel",
        re.compile(
            r"\b(train|bus|stop|station|ticket|platform|car|bicycle|journey|luggage|driver|traffic)\b",
            re.I,
        ),
    ),
    (
        "Work & study",
        re.compile(
            r"\b(school|course|book|class|office|job|work|study|teacher|student|administration|employment|letter)\b",
            re.I,
        ),
    ),
    (
        "Time",
        re.compile(
            r"\b(today|tomorrow|yesterday|morning|afternoon|evening|night|month|year|birthday|april|august|week)\b",
            re.I,
        ),
    ),
    (
        "Weather",
        re.compile(
            r"\b(cloudy|cold|warm|spring|autumn|winter|summer|rain|wind|degrees)\b",
            re.I,
        ),
    ),
]


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug or "entry"


def cleanup_english(value: str) -> str:
    value = value.strip()
    value = re.sub(r"\s+\b(the|itself)\b$", "", value)
    value = value.replace("aub)", "please")
    value = value.replace("  ", " ")
    return value.strip(" ,")


def assign_category(term: str, english: str) -> str:
    haystack = f"{term} {english}"

    if english.startswith("to "):
        return "Verbs"

    for label, pattern in CATEGORY_RULES:
        if pattern.search(haystack):
            return label

    if re.search(r"\b(one|two|three|four|five|six|seven|eight|nine|ten)\b", english, re.I):
        return "Time"

    return "Everyday words"


def build_example(term: str, english: str, article: str | None, category: str) -> tuple[str, str]:
    display = f"{article} {term}" if article else term
    english_with_article = f"the {english}" if article else english

    if category == "Greetings":
        return (display.capitalize() + ".", english[:1].upper() + english[1:] + ".")

    if english.startswith("to "):
        action = english.removeprefix("to ").strip()
        return (f"Ik wil {term}.", f"I want to {action}.")

    if category == "Travel":
        return (f"Ik gebruik {display} vandaag.", f"I use {english_with_article} today.")

    if category == "Food & drink":
        return (f"Ik koop {display} in de winkel.", f"I buy {english_with_article} in the shop.")

    if category == "Time":
        return (f"Vandaag oefenen we {display}.", f"Today we practice {english}.")

    if category == "People":
        return (f"{display.capitalize()} is vandaag hier.", f"{english_with_article[:1].upper() + english_with_article[1:]} is here today.")

    if category == "Home":
        return (f"{display.capitalize()} is dichtbij.", f"{english_with_article[:1].upper() + english_with_article[1:]} is nearby.")

    return (f"Dit is {display}.", f"This is {english_with_article}.")


def build_grammar_note(term: str, english: str, article: str | None) -> str | None:
    if article:
        return "Learn the noun together with de or het. That makes article practice much easier."

    if english.startswith("to "):
        return "Keep the infinitive as your anchor word, then reuse it in short present-tense sentences."

    if " " in term:
        return "Treat this as a useful everyday chunk rather than splitting it apart too early."

    return None


def parse_line(line: str) -> tuple[str, str | None, str] | None:
    if not line or line.isdigit() or "2100 woorden op alfabet" in line:
        return None

    noun_match = re.match(r"^(.*?)\s+(de|het)\s+(.+?)(?:\s+(?:the|it))?$", line)
    if noun_match:
        term, article, english = noun_match.groups()
        return term.strip(), article, cleanup_english(english)

    reflexive_match = re.match(r"^(.*?)\s+zich\s+to\s+(.+?)(?:\s+itself)?$", line)
    if reflexive_match:
        term, english = reflexive_match.groups()
        return f"zich {term.strip()}", None, f"to {cleanup_english(english)}"

    verb_match = re.match(r"^(.*?)\s+to\s+(.+)$", line)
    if verb_match:
        term, english = verb_match.groups()
        return term.strip(), None, f"to {cleanup_english(english)}"

    parts = line.split(" ", 1)
    if len(parts) == 2:
        term, english = parts
        return term.strip(), None, cleanup_english(english)

    return None


def fetch_pdf_bytes(url: str) -> bytes:
    with urllib.request.urlopen(url) as response:
        return response.read()


def build_cards() -> list[dict[str, object]]:
    pdf_bytes = fetch_pdf_bytes(SOURCE_URL)
    reader = PdfReader(BytesIO(pdf_bytes))
    lines: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        for raw_line in text.splitlines():
            line = " ".join(raw_line.split())
            if line:
                lines.append(line)

    seen: set[tuple[str, str]] = set()
    cards: list[dict[str, object]] = []

    for line in lines:
        parsed = parse_line(line)
        if not parsed:
            continue

        term, article, english = parsed
        if term in {"'s", "-"}:
            continue
        key = (term.lower(), english.lower())

        if key in seen:
            continue
        seen.add(key)

        category = assign_category(term, english)
        example_target, example_english = build_example(term, english, article, category)
        card = {
            "id": f"dutch-{slugify(term)}-{slugify(english)}",
            "level": "A1",
            "german": term,
            "english": english,
            "category": category,
            "exampleGerman": example_target,
            "exampleEnglish": example_english,
        }

        if article:
            card["article"] = article

        grammar_note = build_grammar_note(term, english, article)
        if grammar_note:
            card["grammarNote"] = grammar_note

        cards.append(card)

    cards.sort(key=lambda item: unicodedata.normalize("NFKD", str(item["german"])).lower())
    return cards


def main() -> None:
    cards = build_cards()
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(cards)} Dutch A1 cards in {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
