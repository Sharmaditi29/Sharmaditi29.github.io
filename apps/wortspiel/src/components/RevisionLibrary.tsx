import { useMemo, useState } from 'react'
import type { LearningLanguage, RevisionCollection, VocabularyCard } from '../types'

interface RevisionLibraryProps {
  cards: VocabularyCard[]
  revision: RevisionCollection
  selectedLanguage: LearningLanguage
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
  selectedLanguage,
  languageLabel,
}: RevisionLibraryProps) {
  const [view, setView] = useState<RevisionView>('themes')
  const [query, setQuery] = useState('')

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

  return (
    <section className="rounded-[30px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            Revise
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Concepts and quick reminders
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-notebook">
            If a card gets fuzzy, open a concept, skim a theme, or search the word bank without
            leaving the page.
          </p>
        </div>

        <div className="rounded-[24px] bg-cream/70 px-4 py-3 text-sm font-bold text-notebook">
          {selectedLanguage === 'german'
            ? `${wordBank.length} Goethe-based A1 reference words`
            : `${wordBank.length} ${languageLabel} starter words`}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {revisionViews.map((item) => {
          const active = item.id === view

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
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
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {currentConcepts.map((concept) => (
            <article
              key={concept.id}
              className="rounded-[24px] border border-line bg-cream/55 p-5 shadow-soft"
            >
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
                {view === 'themes' ? 'Theme' : 'Concept'}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">{concept.title}</h3>
              <p className="mt-3 text-sm leading-6 text-notebook">{concept.summary}</p>
              <ul className="mt-4 grid gap-2 text-sm text-ink">
                {concept.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-[18px] bg-paper/80 px-3 py-2">
                    {bullet}
                  </li>
                ))}
              </ul>
              {concept.example && (
                <p className="mt-4 rounded-[18px] bg-paper px-3 py-3 text-sm font-bold text-ink">
                  {concept.example}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {view === 'words' && (
        <div className="mt-6">
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredWordBank.map((entry) => (
              <article
                key={entry.key}
                className="rounded-[22px] border border-line bg-cream/55 p-4 shadow-soft"
              >
                <p className="font-display text-2xl font-bold text-ink">{entry.label}</p>
                <p className="mt-2 text-sm text-notebook">{entry.translations.join(' • ')}</p>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                  {entry.category}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[24px] border border-dashed border-line bg-paper px-4 py-4 text-sm leading-6 text-notebook">
        <span className="font-bold text-ink">Source:</span>{' '}
        {revision.sourceHref ? (
          <a
            href={revision.sourceHref}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-splash underline decoration-splash/40 underline-offset-4"
          >
            {revision.sourceLabel}
          </a>
        ) : (
          <span className="font-bold text-ink">{revision.sourceLabel}</span>
        )}
        . {revision.note}
      </div>
    </section>
  )
}
