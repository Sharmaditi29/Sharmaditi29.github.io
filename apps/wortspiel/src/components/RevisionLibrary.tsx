import { useEffect, useMemo, useState } from 'react'
import type { RevisionCollection, VocabularyCard } from '../types'

interface RevisionLibraryProps {
  cards: VocabularyCard[]
  revision: RevisionCollection
  languageLabel: string
}

type RevisionView = 'themes' | 'grammar' | 'words'

interface WordBankEntry {
  key: string
  label: string
  translations: string[]
  category: string
}

const revisionViews: Array<{ id: RevisionView; label: string }> = [
  { id: 'themes', label: 'Themes' },
  { id: 'grammar', label: 'Concepts' },
  { id: 'words', label: 'Word bank' },
]

function getDisplayLabel(card: VocabularyCard) {
  return card.article ? `${card.article} ${card.german}` : card.german
}

export function RevisionLibrary({
  cards,
  revision,
  languageLabel,
}: RevisionLibraryProps) {
  const [view, setView] = useState<RevisionView>('themes')
  const [query, setQuery] = useState('')
  const [selectedThemeId, setSelectedThemeId] = useState(revision.themes[0]?.id ?? '')
  const [selectedGrammarId, setSelectedGrammarId] = useState(revision.grammar[0]?.id ?? '')

  const wordBank = useMemo<WordBankEntry[]>(() => {
    const entries = new Map<string, WordBankEntry>()

    cards.forEach((card) => {
      const label = getDisplayLabel(card)
      const key = label.toLowerCase()
      const existing = entries.get(key)

      if (!existing) {
        entries.set(key, {
          key,
          label,
          translations: [card.english],
          category: card.category,
        })
        return
      }

      if (!existing.translations.includes(card.english)) {
        existing.translations.push(card.english)
      }
    })

    return [...entries.values()].sort((left, right) => left.label.localeCompare(right.label))
  }, [cards])

  const filteredWordBank = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return wordBank.slice(0, 48)
    }

    return wordBank
      .filter((entry) => {
        const translations = entry.translations.join(' ').toLowerCase()
        return (
          entry.label.toLowerCase().includes(normalizedQuery) ||
          translations.includes(normalizedQuery) ||
          entry.category.toLowerCase().includes(normalizedQuery)
        )
      })
      .slice(0, 80)
  }, [query, wordBank])

  const currentConcepts = view === 'themes' ? revision.themes : revision.grammar
  const selectedConceptId = view === 'themes' ? selectedThemeId : selectedGrammarId
  const currentConcept =
    currentConcepts.find((concept) => concept.id === selectedConceptId) ?? currentConcepts[0]

  useEffect(() => {
    setSelectedThemeId(revision.themes[0]?.id ?? '')
    setSelectedGrammarId(revision.grammar[0]?.id ?? '')
  }, [revision])

  return (
    <section className="border-t border-line/80 pt-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Revise
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">Quick reminders</h2>
          <p className="mt-1.5 text-sm leading-5 text-notebook">
            Use a theme, a concept, or the word bank when memory slips.
          </p>
        </div>

        <div className="rounded-[18px] bg-cream/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-notebook">
          {wordBank.length} {revision.wordBankLabel}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {revisionViews.map((item) => {
          const active = item.id === view

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${
                active
                  ? 'bg-splash text-white shadow-soft'
                  : 'border border-line bg-cream/60 text-ink hover:-translate-y-0.5 hover:bg-paper'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {view !== 'words' && (
        <div className="mt-4 grid gap-3">
          <label className="max-w-xl">
            <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
              {view === 'themes' ? 'Choose a theme' : 'Choose a concept'}
            </span>
            <div className="relative">
              <select
                value={selectedConceptId}
                onChange={(event) => {
                  if (view === 'themes') {
                    setSelectedThemeId(event.target.value)
                  } else {
                    setSelectedGrammarId(event.target.value)
                  }
                }}
                className="w-full appearance-none rounded-[18px] border border-line bg-cream/85 px-4 py-3 pr-10 text-sm font-bold text-ink shadow-soft outline-none transition focus:border-sun"
              >
                {currentConcepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-notebook">
                v
              </span>
            </div>
          </label>

          {currentConcept && (
            <article className="rounded-[18px] border border-line bg-cream/55 p-3.5 shadow-soft">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
                {view === 'themes' ? `${languageLabel} theme` : `${languageLabel} concept`}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink">
                {currentConcept.title}
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-notebook">{currentConcept.summary}</p>
              <ul className="mt-2.5 grid gap-2 text-sm text-ink xl:grid-cols-2">
                {currentConcept.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-[14px] bg-paper/80 px-3 py-2">
                    {bullet}
                  </li>
                ))}
              </ul>
              {currentConcept.example && (
                <p className="mt-2.5 rounded-[14px] bg-paper px-3 py-2.5 text-sm font-bold text-ink">
                  {currentConcept.example}
                </p>
              )}
            </article>
          )}
        </div>
      )}

      {view === 'words' && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Search the word bank</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${languageLabel.toLowerCase()} or English`}
                className="w-full rounded-full border border-line bg-cream/70 px-5 py-3 text-sm text-ink shadow-soft outline-none transition focus:border-sun"
              />
            </label>
            <div className="rounded-full bg-bubble/20 px-4 py-2 text-sm font-bold text-ink">
              {query.trim()
                ? `${filteredWordBank.length} matches`
                : `Showing ${filteredWordBank.length} of ${wordBank.length}`}
            </div>
          </div>

          <div className="mt-4 grid max-h-[14rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {filteredWordBank.map((entry) => (
              <article
                key={entry.key}
                className="rounded-[16px] border border-line bg-cream/55 p-3 shadow-soft"
              >
                <p className="font-display text-lg font-bold text-ink">{entry.label}</p>
                <p className="mt-1.5 text-sm text-notebook">{entry.translations.join(' • ')}</p>
                <p className="mt-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                  {entry.category}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
