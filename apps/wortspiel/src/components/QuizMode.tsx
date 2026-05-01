import { useEffect, useState } from 'react'
import type { QuizItem, VocabularyCard } from '../types'
import { createQuizItems } from '../utils/quiz'

interface QuizModeProps {
  cards: VocabularyCard[]
}

export function QuizMode({ cards }: QuizModeProps) {
  const [items, setItems] = useState<QuizItem[]>(() => createQuizItems(cards))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setItems(createQuizItems(cards))
    setCurrentIndex(0)
    setFeedback(null)
    setAnsweredCorrectly(false)
    setScore(0)
  }, [cards])

  const currentItem = items[currentIndex]
  const total = items.length

  const handleChoice = (choice: string) => {
    if (!currentItem || answeredCorrectly) {
      return
    }

    if (choice === currentItem.answer) {
      setFeedback('Correct. Nice work.')
      setAnsweredCorrectly(true)
      setScore((current) => current + 1)
    } else {
      setFeedback('Try again. You are close.')
    }
  }

  const handleNext = () => {
    if (currentIndex === total - 1) {
      setItems(createQuizItems(cards))
      setCurrentIndex(0)
      setFeedback(null)
      setAnsweredCorrectly(false)
      setScore(0)
      return
    }

    setCurrentIndex((current) => current + 1)
    setFeedback(null)
    setAnsweredCorrectly(false)
  }

  if (!currentItem) {
    return null
  }

  return (
    <section className="rounded-[30px] border border-line bg-paper p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-notebook">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="rounded-full bg-sun/30 px-4 py-2 text-sm font-bold text-ink">
          Score {score}/{Math.max(1, currentIndex + (answeredCorrectly ? 1 : 0))}
        </span>
      </div>

      <div className="mt-6 rounded-[28px] border border-line bg-cream/60 p-6">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-notebook">
          {currentItem.type === 'meaning' ? 'Meaning check' : 'Article challenge'}
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold text-ink">
          {currentItem.type === 'meaning'
            ? `Choose the English meaning of “${currentItem.prompt}”.`
            : `Which article fits “${currentItem.prompt}”?`}
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {currentItem.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => handleChoice(choice)}
              className="rounded-[22px] border border-line bg-paper px-4 py-4 text-left text-base font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-sun"
            >
              {choice}
            </button>
          ))}
        </div>

        {feedback && (
          <div
            className={`mt-5 rounded-[18px] px-4 py-3 text-sm font-bold ${
              answeredCorrectly ? 'bg-leaf/15 text-leaf' : 'bg-blush/10 text-blush'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-paper transition hover:-translate-y-0.5 hover:bg-notebook"
        >
          {currentIndex === total - 1 ? 'Restart quiz' : 'Next question'}
        </button>
      </div>
    </section>
  )
}
