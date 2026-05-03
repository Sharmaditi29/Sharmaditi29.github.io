import { useEffect, useState } from 'react'
import type { VocabularyCard } from '../types'

interface FlashcardProps {
  card: VocabularyCard
  currentIndex: number
  totalCards: number
  onPrevious: () => void
  onNext: () => void
  onKnown: () => void
  onPractice: () => void
}

export function Flashcard({
  card,
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
  onKnown,
  onPractice,
}: FlashcardProps) {
  const [showMeaning, setShowMeaning] = useState(false)
  const [showExample, setShowExample] = useState(false)

  useEffect(() => {
    setShowMeaning(false)
    setShowExample(false)
  }, [card.id])

  const nounDetails = [card.article, card.german, card.plural ? `plural: ${card.plural}` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <section className="rounded-[24px] border border-line bg-paper p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-notebook">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <span className="rounded-full bg-sky/20 px-4 py-2 text-sm font-bold text-ink">
          {card.category}
        </span>
      </div>

      <div className="mt-4 rounded-[24px] border border-line bg-notebook/5 p-4 shadow-soft sm:p-5">
        {/* TODO: Add audio pronunciation playback for each card. */}
        <div className="rounded-[20px] bg-paper/95 bg-rulebook bg-[length:100%_35px] p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
            Front of card
          </p>
          <h3 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-[2.75rem]">
            {card.article ? `${card.article} ${card.german}` : card.german}
          </h3>
          <p className="mt-2 text-sm text-notebook">Tap to reveal what you need.</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowMeaning((current) => !current)}
              className="rounded-full border border-line bg-cream px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
            >
              {showMeaning ? 'Hide meaning' : 'Show meaning'}
            </button>
            <button
              type="button"
              onClick={() => setShowExample((current) => !current)}
              className="rounded-full border border-line bg-cream px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
            >
              {showExample ? 'Hide example' : 'Show example sentence'}
            </button>
          </div>

          {(showMeaning || showExample) && (
            <div className="mt-5 grid gap-4 rounded-[20px] border border-line bg-cream/70 p-4 text-left">
              {showMeaning && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                    Meaning
                  </p>
                  <p className="mt-2 text-lg font-bold text-ink">{card.english}</p>
                  {nounDetails && <p className="mt-2 text-sm text-notebook">{nounDetails}</p>}
                </div>
              )}

              {showExample && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                    Example sentence
                  </p>
                  <p className="mt-2 text-base font-bold text-ink">{card.exampleGerman}</p>
                  <p className="mt-2 text-sm text-notebook">{card.exampleEnglish}</p>
                </div>
              )}

              {card.grammarNote && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                    Grammar note
                  </p>
                  <p className="mt-2 text-sm text-notebook">{card.grammarNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onKnown}
          className="rounded-full bg-leaf px-5 py-3 text-sm font-extrabold text-paper transition hover:-translate-y-0.5"
        >
          I knew this
        </button>
        <button
          type="button"
          onClick={onPractice}
          className="rounded-full bg-blush px-5 py-3 text-sm font-extrabold text-paper transition hover:-translate-y-0.5"
        >
          I need practice
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
        >
          Next
        </button>
      </div>
    </section>
  )
}
