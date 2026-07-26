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
  const hasSeparateClue = card.english.trim() && card.english.trim() !== card.exampleEnglish.trim()
  const clueLabel = hasSeparateClue ? 'English clue' : 'English support'

  useEffect(() => {
    setShowMeaning(false)
    setShowExample(false)
  }, [card.id])

  const nounDetails = [card.article, card.german, card.plural ? `plural: ${card.plural}` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-notebook">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-ink">
          {card.category}
        </span>
      </div>

      <div className="mt-3 rounded-[28px] bg-white/78 p-5 shadow-soft">
        {/* TODO: Add audio pronunciation playback for each card. */}
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
          Word
        </p>
        <h3 className="mt-3 font-display text-[2.35rem] font-extrabold leading-[0.96] text-ink sm:text-[2.75rem]">
          {card.article ? `${card.article} ${card.german}` : card.german}
        </h3>
        <p className="mt-2 text-sm leading-6 text-notebook">
          Start with the word. Open the clue or the example only when you need it.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setShowMeaning((current) => !current)}
            className="rounded-full bg-[#fff3d8] px-4 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-0.5"
          >
            {showMeaning ? 'Hide clue' : 'Show clue'}
          </button>
          <button
            type="button"
            onClick={() => setShowExample((current) => !current)}
            className="rounded-full bg-[#f3eeff] px-4 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-0.5"
          >
            {showExample ? 'Hide example' : 'Show example'}
          </button>
        </div>

        {(showMeaning || showExample) && (
          <div className="mt-4 grid gap-3 rounded-[22px] bg-[#fffaf1] p-4 text-left">
            {showMeaning && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                  {clueLabel}
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
                {card.exampleEnglish !== card.english && (
                  <p className="mt-2 text-sm text-notebook">{card.exampleEnglish}</p>
                )}
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

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onKnown}
          className="rounded-full bg-leaf px-4 py-2.5 text-sm font-extrabold text-paper transition hover:-translate-y-0.5"
        >
          I knew this
        </button>
        <button
          type="button"
          onClick={onPractice}
          className="rounded-full bg-blush px-4 py-2.5 text-sm font-extrabold text-paper transition hover:-translate-y-0.5"
        >
          Review again
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-full bg-white/78 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-white"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-white/78 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-white"
        >
          Next
        </button>
      </div>
    </section>
  )
}
