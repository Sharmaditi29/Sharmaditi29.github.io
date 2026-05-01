import { useEffect, useState } from 'react'
import type { SentenceAnswer, VocabularyCard } from '../types'

interface SentencePracticeProps {
  card: VocabularyCard
  answer?: SentenceAnswer
  currentIndex: number
  totalCards: number
  onPrevious: () => void
  onNext: () => void
  onSave: (text: string) => void
}

export function SentencePractice({
  card,
  answer,
  currentIndex,
  totalCards,
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
    <section className="rounded-[30px] border border-line bg-paper p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-notebook">
          Prompt {currentIndex + 1} of {totalCards}
        </span>
        <span className="rounded-full bg-apricot/20 px-4 py-2 text-sm font-bold text-ink">
          Use: {card.article ? `${card.article} ${card.german}` : card.german}
        </span>
      </div>

      <div className="mt-6 rounded-[28px] border border-line bg-cream/60 p-6">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
          Sentence practice
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold text-ink">
          Write your own sentence using {card.german}.
        </h3>
        <p className="mt-3 text-base leading-7 text-notebook">
          Keep it simple. One clear sentence is enough for a good daily win.
        </p>

        <label className="mt-6 block">
          <span className="sr-only">Your German sentence</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            placeholder={`Zum Beispiel: Ich ... ${card.german} ...`}
            className="w-full rounded-[22px] border border-line bg-paper px-4 py-4 text-base text-ink shadow-soft outline-none transition focus:border-sun"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-paper transition hover:-translate-y-0.5 hover:bg-notebook"
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
        <div className="mt-6 rounded-[24px] border border-line bg-paper p-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
            Example from the deck
          </p>
          <p className="mt-3 text-lg font-bold text-ink">{card.exampleGerman}</p>
          <p className="mt-2 text-sm text-notebook">{card.exampleEnglish}</p>
          {card.grammarNote && <p className="mt-3 text-sm text-notebook">{card.grammarNote}</p>}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
        >
          Previous word
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-sun"
        >
          Next word
        </button>
      </div>
    </section>
  )
}
