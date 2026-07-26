import { useEffect, useState } from 'react'
import type { SentenceAnswer, VocabularyCard } from '../types'

interface SentencePracticeProps {
  card: VocabularyCard
  answer?: SentenceAnswer
  currentIndex: number
  totalCards: number
  sentencePlaceholder: string
  onPrevious: () => void
  onNext: () => void
  onSave: (text: string) => void
}

export function SentencePractice({
  card,
  answer,
  currentIndex,
  totalCards,
  sentencePlaceholder,
  onPrevious,
  onNext,
  onSave,
}: SentencePracticeProps) {
  const [text, setText] = useState(answer?.text ?? '')
  const [submitted, setSubmitted] = useState(Boolean(answer))

  useEffect(() => {
    setText(answer?.text ?? '')
    setSubmitted(Boolean(answer))
  }, [answer, card.id])

  const handleSubmit = () => {
    if (!text.trim()) {
      return
    }

    onSave(text.trim())
    setSubmitted(true)

    // TODO: Add AI sentence feedback here in a future version.
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-notebook">
          Prompt {currentIndex + 1} of {totalCards}
        </span>
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-ink">
          Use: {card.article ? `${card.article} ${card.german}` : card.german}
        </span>
      </div>

      <div className="mt-4 rounded-[28px] bg-white/78 p-5 shadow-soft">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
          Write
        </p>
        <h3 className="mt-2.5 font-display text-[1.95rem] font-bold leading-tight text-ink">
          Write your own sentence using {card.german}.
        </h3>
        <p className="mt-2 text-sm leading-6 text-notebook">
          One simple German sentence is enough.
        </p>

        <label className="mt-4 block">
          <span className="sr-only">Your sentence</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            placeholder={sentencePlaceholder}
            className="w-full rounded-[22px] border border-line/35 bg-white px-4 py-4 text-base text-ink outline-none transition focus:border-splash"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-paper transition hover:-translate-y-0.5 hover:bg-notebook"
          >
            Save my sentence
          </button>
          {submitted && (
            <span className="rounded-full bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf">
              Nice work. Compare your sentence with the example.
            </span>
          )}
        </div>
      </div>

      {submitted && (
        <div className="mt-4 rounded-[22px] bg-[#fffaf1] p-4">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
            Example from the deck
          </p>
          <p className="mt-3 text-lg font-bold text-ink">{card.exampleGerman}</p>
          <p className="mt-2 text-sm text-notebook">{card.exampleEnglish}</p>
          {card.grammarNote && <p className="mt-3 text-sm text-notebook">{card.grammarNote}</p>}
        </div>
      )}

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
