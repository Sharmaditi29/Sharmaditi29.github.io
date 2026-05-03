import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const GLOSSARY_BASE =
  'https://openlearning.aalto.fi/mod/glossary/view.php?fullsearch=0&hook=ALL&id=3370&mode=letter&page='
const OUTPUT_FILE = new URL('../public/data/finnish-a1.json', import.meta.url)

const starterExamples = new Map([
  ['omena', ['Omena on makea.', 'The apple is sweet.', 'Food']],
  ['vesi', ['Juon vettä aamulla.', 'I drink water in the morning.', 'Food & drink']],
  ['nainen', ['Nainen odottaa bussia.', 'The woman is waiting for the bus.', 'People']],
  ['mies', ['Mies lukee kirjaa.', 'The man is reading a book.', 'People']],
  ['lapsi', ['Lapsi leikkii puistossa.', 'The child is playing in the park.', 'People']],
  ['talo', ['Talo on iso.', 'The house is big.', 'Home']],
  ['asunto', ['Asunto on keskustassa.', 'The apartment is in the city center.', 'Home']],
  ['perhe', ['Minun perheeni on täällä.', 'My family is here.', 'People']],
  ['leipä', ['Syön leipää aamiaisella.', 'I eat bread at breakfast.', 'Food & drink']],
  ['koulu', ['Koulu alkaa kahdeksalta.', 'School starts at eight.', 'Study']],
  ['ystävä', ['Ystävä tulee tänään.', 'A friend is coming today.', 'People']],
  ['työ', ['Työ alkaa yhdeksältä.', 'Work starts at nine.', 'Work & study']],
  ['juna', ['Juna on ajoissa.', 'The train is on time.', 'Travel']],
  ['kirja', ['Kirja on pöydällä.', 'The book is on the table.', 'Study']],
  ['kahvi', ['Juon kahvia iltapäivällä.', 'I drink coffee in the afternoon.', 'Food & drink']],
  ['kaupunki', ['Helsinki on kaunis kaupunki.', 'Helsinki is a beautiful city.', 'Places']],
  ['huone', ['Huone on valoisa.', 'The room is bright.', 'Home']],
  ['syödä', ['Syön keittoa illalla.', 'I eat soup in the evening.', 'Verbs']],
  ['juoda', ['Juomme vettä kotona.', 'We drink water at home.', 'Verbs']],
  ['mennä', ['Menen nyt kouluun.', 'I am going to school now.', 'Verbs']],
  ['tulla', ['Tuletko huomenna?', 'Are you coming tomorrow?', 'Verbs']],
  ['olla', ['Olen väsynyt tänään.', 'I am tired today.', 'Verbs']],
  ['oppia', ['Opin uusia sanoja.', 'I learn new words.', 'Study']],
  ['kiitos', ['Kiitos avusta.', 'Thank you for the help.', 'Greetings']],
  ['ole hyvä', ['Vettä, ole hyvä.', 'Water, please.', 'Greetings']],
  ['hei', ['Hei, mitä kuuluu?', 'Hi, how are you?', 'Greetings']],
  ['näkemiin', ['Näkemiin, huomiseen.', 'Goodbye, see you tomorrow.', 'Greetings']],
])

const categoryRules = [
  ['Greetings', /\b(hello|goodbye|welcome|good morning|good evening|nice to meet you|sorry|thanks?)\b/i],
  ['Food & drink', /\b(breakfast|lunch|dinner|coffee|tea|bread|cheese|salad|potato|banana|orange|apple|cucumber|tomato|rice|wine|soft drink|water|ice cream|restaurant|cafe|pub|bar|market|bakery|meat)\b/i],
  ['Places', /\b(home|dorm|library|church|hospital|bank|restaurant|school|university|station|platform|city|center|swimming hall|kiosk|market|theater|pharmacy|store|hardware store|bus stop)\b/i],
  ['Travel', /\b(bus|train|car|platform|tourist|trip|travel)\b/i],
  ['People', /\b(friend|girlfriend|doctor|pharmacist|translator|researcher|customer|tourist|person)\b/i],
  ['Work & study', /\b(work|course|student|university|school|language|major|doctoral program|master|profession|research|technology|architect|architecture|translator)\b/i],
  ['Time', /\b(morning|evening|night|day|weekend|today|tomorrow|yesterday|january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|year|until)\b/i],
  ['Weather', /\b(sun|sunny|rain|snow|spring|summer|fall|winter|hot|cold|blow)\b/i],
  ['Verbs', /^to /i],
]

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanupTerm(term) {
  return term
    .replace(/\s+/g, ' ')
    .replace(/\(\d\*?\)/g, '')
    .replace(/\s+,/g, ',')
    .trim()
}

function cleanupEnglish(english) {
  return english.replace(/\s+/g, ' ').trim()
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function assignCategory(term, english) {
  const starter = starterExamples.get(term)
  if (starter) {
    return starter[2]
  }

  for (const [label, pattern] of categoryRules) {
    if (pattern.test(english)) {
      return label
    }
  }

  if (/^[A-ZÅÄÖ]/.test(term)) {
    return 'Places'
  }

  return 'Everyday words'
}

function buildExamples(term, english, category) {
  const starter = starterExamples.get(term)
  if (starter) {
    return {
      exampleGerman: starter[0],
      exampleEnglish: starter[1],
    }
  }

  if (/[!?]$/.test(term)) {
    return {
      exampleGerman: term,
      exampleEnglish: english,
    }
  }

  if (english.startsWith('to ')) {
    const action = english.replace(/^to\s+/i, '')
    return {
      exampleGerman: `Minä voin ${term}.`,
      exampleEnglish: `I can ${action}.`,
    }
  }

  if (category === 'Places') {
    return {
      exampleGerman: `Tämä paikka on ${term}.`,
      exampleEnglish: `This place is ${english}.`,
    }
  }

  if (category === 'Time') {
    return {
      exampleGerman: `Tänään harjoittelemme sanaa ${term}.`,
      exampleEnglish: `Today we practise the word ${english}.`,
    }
  }

  if (category === 'Weather') {
    return {
      exampleGerman: `Tänään sana on ${term}.`,
      exampleEnglish: `Today the word is ${english}.`,
    }
  }

  return {
    exampleGerman: `Tämä on ${term}.`,
    exampleEnglish: `This is ${english}.`,
  }
}

function buildGrammarNote(term, english) {
  if (english.startsWith('to ')) {
    return 'Aalto glossary marks many verbs with a type number in brackets. WortSpiel removes the number in the card title but keeps the verb as an infinitive.'
  }

  if (/[!?]$/.test(term)) {
    return 'Useful phrase from the Aalto beginner Finnish glossary.'
  }

  return undefined
}

async function fetchPage(page) {
  const response = await fetch(`${GLOSSARY_BASE}${page}&sortkey=&sortorder=asc`)
  if (!response.ok) {
    throw new Error(`Failed to fetch Finnish glossary page ${page}: ${response.status}`)
  }
  return response.text()
}

const cards = []
const seen = new Set()

for (let page = 1; page <= 40; page += 1) {
  const html = await fetchPage(page)
  const matches = [...html.matchAll(/<div class="concept"><h4>(.*?)<\/h4><\/div>\s*<div class="no-overflow">(.*?)<\/div>/gs)]

  if (matches.length === 0) {
    break
  }

  for (const match of matches) {
    const rawTerm = decodeHtml(match[1]).replace(/<[^>]+>/g, '').trim()
    const rawEnglish = decodeHtml(match[2]).replace(/<[^>]+>/g, '').trim()
    const term = cleanupTerm(rawTerm)
    const english = cleanupEnglish(rawEnglish)
    const uniqueKey = `${term}__${english}`

    if (!term || !english || seen.has(uniqueKey)) {
      continue
    }

    seen.add(uniqueKey)

    const category = assignCategory(term, english)
    const { exampleGerman, exampleEnglish } = buildExamples(term, english, category)

    cards.push({
      id: `aalto-${slugify(term)}-${slugify(english)}`,
      level: 'A1',
      german: term,
      english,
      category,
      exampleGerman,
      exampleEnglish,
      ...(buildGrammarNote(term, english) ? { grammarNote: buildGrammarNote(term, english) } : {}),
    })
  }
}

cards.sort((left, right) => left.german.localeCompare(right.german, 'fi'))

await mkdir(path.dirname(OUTPUT_FILE.pathname), { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(cards, null, 2)}\n`, 'utf8')

console.log(`Generated ${cards.length} Finnish Aalto cards in ${OUTPUT_FILE.pathname}`)
