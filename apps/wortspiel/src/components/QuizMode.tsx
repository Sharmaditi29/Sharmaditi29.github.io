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
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-notebook">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-ink">
          Score {score}/{Math.max(1, currentIndex + (answeredCorrectly ? 1 : 0))}
        </span>
      </div>

      <div className="mt-3 rounded-[28px] bg-white/78 p-5 shadow-soft">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
          {currentItem.type === 'meaning' ? 'Clue check' : 'Article check'}
        </p>
        <h3 className="mt-2.5 font-display text-[1.8rem] font-bold leading-tight text-ink">
          {currentItem.type === 'meaning'
            ? 'Which German word fits this English clue?'
            : `Which article fits “${currentItem.prompt}”?`}
        </h3>
        {currentItem.type === 'meaning' && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-notebook">{currentItem.prompt}</p>
        )}

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {currentItem.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => handleChoice(choice)}
              className="rounded-[18px] bg-[#fff8ec] px-4 py-3 text-left text-base font-bold text-ink transition hover:-translate-y-0.5"
            >
              {choice}
            </button>
          ))}
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-[18px] px-4 py-3 text-sm font-bold ${
              answeredCorrectly ? 'bg-leaf/15 text-leaf' : 'bg-blush/10 text-blush'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-paper transition hover:-translate-y-0.5 hover:bg-notebook"
        >
          {currentIndex === total - 1 ? 'Restart quiz' : 'Next question'}
        </button>
      </div>
    </section>
  )
}
