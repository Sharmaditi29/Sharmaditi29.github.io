import { useEffect, useState } from 'react'
import type { RevisionCollection } from '../types'

interface RevisionLibraryProps {
  revision: RevisionCollection
  levelLabel: string
  cardCount: number
}

type ReviewView = 'themes' | 'grammar'

const reviewViews: Array<{ id: ReviewView; label: string }> = [
  { id: 'themes', label: 'Topics' },
  { id: 'grammar', label: 'Grammar' },
]

export function RevisionLibrary({ revision, levelLabel, cardCount }: RevisionLibraryProps) {
  const [view, setView] = useState<ReviewView>('themes')
  const [selectedThemeId, setSelectedThemeId] = useState(revision.themes[0]?.id ?? '')
  const [selectedGrammarId, setSelectedGrammarId] = useState(revision.grammar[0]?.id ?? '')

  useEffect(() => {
    setSelectedThemeId(revision.themes[0]?.id ?? '')
    setSelectedGrammarId(revision.grammar[0]?.id ?? '')
  }, [revision])

  const concepts = view === 'themes' ? revision.themes : revision.grammar
  const selectedId = view === 'themes' ? selectedThemeId : selectedGrammarId
  const selectedConcept = concepts.find((concept) => concept.id === selectedId) ?? concepts[0]

  return (
    <section className="mt-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
          Quick reminders
        </p>
        <h2 className="mt-2 font-display text-[1.35rem] font-bold text-ink">
          Revise one idea fast.
        </h2>
        <p className="mt-2 text-sm leading-6 text-notebook">
          {levelLabel} has {cardCount} cards. Pick one topic or one grammar point whenever you need a reset.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {reviewViews.map((item) => {
          const active = item.id === view
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                active ? 'bg-splash text-paper' : 'bg-white text-ink hover:bg-white/90'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
          {view === 'themes' ? 'Choose a topic' : 'Choose a grammar point'}
        </span>
        <div className="relative">
          <select
            value={selectedId}
            onChange={(event) => {
              if (view === 'themes') {
                setSelectedThemeId(event.target.value)
              } else {
                setSelectedGrammarId(event.target.value)
              }
            }}
            className="w-full appearance-none rounded-[16px] border border-line/35 bg-white px-4 py-3 pr-10 text-sm font-bold text-ink outline-none transition focus:border-splash"
          >
            {concepts.map((concept) => (
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

      {selectedConcept && (
        <article className="mt-4 rounded-[22px] bg-white/72 px-4 py-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
            {view === 'themes' ? `${levelLabel} topic` : `${levelLabel} grammar`}
          </p>
          <h3 className="mt-2 font-display text-[1.2rem] font-bold text-ink">
            {selectedConcept.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-notebook">{selectedConcept.summary}</p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-ink">
            {selectedConcept.bullets.map((bullet) => (
              <li key={bullet} className="rounded-[14px] bg-[#fff8ec] px-3 py-2.5">
                {bullet}
              </li>
            ))}
          </ul>
          {selectedConcept.example && (
            <p className="mt-4 rounded-[16px] bg-[#f5f2ff] px-3 py-3 text-sm font-bold leading-6 text-ink">
              {selectedConcept.example}
            </p>
          )}
        </article>
      )}
    </section>
  )
}
