import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE_URL =
  'https://raw.githubusercontent.com/patsytau/anki_german_a1_vocab/main/Goethe%20Institute%20A1%20Wordlist.txt'
const OUTPUT_FILE = new URL('../public/data/goethe-a1.json', import.meta.url)

const categoryRules = [
  ['Food & drink', /(bread|coffee|water|tea|beer|wine|apple|banana|pear|restaurant|cafe|food|drink|breakfast|lunch|dinner|kitchen|hungry|thirsty|salad|cake|soup|milk)/i],
  ['Home', /(home|flat|apartment|house|room|kitchen|bathroom|balcony|bed|chair|table|window|door|cupboard|rent|furniture|garden)/i],
  ['People', /\b(family|mother|father|sister|brother|friend|child|baby|doctor|teacher|neighbour|person|woman|man|parents|name|birthday|address|nationality)\b/i],
  ['Travel', /(train|station|platform|ticket|bus|tram|taxi|airport|luggage|travel|trip|hotel|road|street|car|bicycle|motorway|journey|map)/i],
  ['Shopping', /(shop|buy|sell|cash|price|market|money|bank|euro|shirt|trousers|dress|shoe|jacket|bag|pay|customer|receipt)/i],
  ['Work & study', /(school|course|language|learn|study|teacher|homework|book|office|work|job|profession|computer|email|letter|answer sheet|class)/i],
  ['Health & body', /(doctor|hospital|medicine|arm|eye|leg|head|stomach|ill|hurt|healthy|pharmacy|pain|tooth|body)/i],
  ['Time & routine', /(today|tomorrow|yesterday|morning|evening|night|day|week|month|year|clock|time|minute|hour|late|early|always|sometimes)/i],
  ['Services', /(police|post|telephone|form|office|information|official|service|passport|identity|application|appointment)/i],
]

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function assignCategory(sourceTerm, english, exampleGerman, exampleEnglish) {
  const haystack = `${sourceTerm} ${english} ${exampleGerman} ${exampleEnglish}`

  for (const [label, pattern] of categoryRules) {
    if (pattern.test(haystack)) {
      return label
    }
  }

  return 'Everyday words'
}

function parseTerm(sourceTerm) {
  const trimmed = sourceTerm.trim()
  const nounMatch = trimmed.match(/^(der|die|das)\s+(.+?)(?:,\s*(.+))?$/)

  if (!nounMatch) {
    return {
      german: trimmed,
    }
  }

  return {
    article: nounMatch[1],
    german: nounMatch[2].trim(),
    plural: nounMatch[3]?.trim() || undefined,
  }
}

function buildGrammarNote(columns) {
  const notes = columns
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => !value.startsWith('[sound:'))

  return notes.length ? notes.join(' · ') : undefined
}

const response = await fetch(SOURCE_URL)

if (!response.ok) {
  throw new Error(`Failed to fetch Goethe A1 source: ${response.status} ${response.statusText}`)
}

const raw = await response.text()
const rows = raw
  .split('\n')
  .map((line) => line.trimEnd())
  .filter(Boolean)
  .map((line) => line.split('\t'))

const cards = rows.map((columns, index) => {
  const [
    noteId,
    sourceTerm = '',
    exampleGerman = '',
    english = '',
    exampleEnglish = '',
    noteA = '',
    noteB = '',
  ] = columns

  const parsed = parseTerm(sourceTerm)
  const displayLabel = parsed.article ? `${parsed.article}-${parsed.german}` : parsed.german

  return {
    id: `goethe-${noteId || index + 1}-${slugify(displayLabel)}`,
    level: 'A1',
    german: parsed.german,
    english: english.trim() || 'reference entry',
    ...(parsed.article ? { article: parsed.article } : {}),
    ...(parsed.plural ? { plural: parsed.plural } : {}),
    category: assignCategory(sourceTerm, english, exampleGerman, exampleEnglish),
    exampleGerman: exampleGerman.trim() || `Beispiel zu ${parsed.german}.`,
    exampleEnglish: exampleEnglish.trim() || `Example for ${parsed.german}.`,
    ...(buildGrammarNote([noteA, noteB]) ? { grammarNote: buildGrammarNote([noteA, noteB]) } : {}),
  }
})

await mkdir(path.dirname(OUTPUT_FILE.pathname), { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(cards, null, 2)}\n`, 'utf8')

console.log(`Generated ${cards.length} Goethe A1 cards in ${OUTPUT_FILE.pathname}`)
