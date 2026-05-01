import { useState } from 'react'
import { Flashcard } from './Flashcard'
import { QuizMode } from './QuizMode'
import { SentencePractice } from './SentencePractice'
import type { PracticeMode, ProgressState, VocabularyCard } from '../types'

interface PracticeSessionProps {
  cards: VocabularyCard[]
  progress: ProgressState
  selectedLevel: string
  onCardFeedback: (cardId: string, outcome: 'known' | 'practice') => void
  onSentenceSave: (cardId: string, text: string) => void
}

const modeLabels: Array<{ key: PracticeMode; title: string; subtitle: string }> = [
  { key: 'flashcards', title: 'Flashcards', subtitle: 'Reveal, review, repeat' },
  { key: 'sentence', title: 'Sentence practice', subtitle: 'Write your own line' },
  { key: 'quiz', title: 'Quiz mode', subtitle: 'Meaning and article check' },
]

export function PracticeSession({
  cards,
  progress,
  selectedLevel,
  onCardFeedback,
  onSentenceSave,
}: PracticeSessionProps) {
  const [mode, setMode] = useState<PracticeMode>('flashcards')
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentCard = cards[currentIndex]

  const goPrevious = () =>
    setCurrentIndex((current) => (current === 0 ? cards.length - 1 : current - 1))
  const goNext = () =>
    setCurrentIndex((current) => (current === cards.length - 1 ? 0 : current + 1))

  return (
    <section className="rounded-[30px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            Practice session
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            WortSpiel {selectedLevel}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-notebook">
            Move between flashcards, sentence practice, and quiz mode whenever you
            want. The app keeps saving your progress locally as you go.
          </p>
        </div>
        <div className="shrink-0 rounded-[22px] bg-cream/70 px-4 py-3 text-sm font-bold text-notebook">
          {progress.reviewedCardIds.length} unique cards reviewed
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {modeLabels.map((item) => {
          const active = mode === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key)}
              className={`rounded-[22px] border p-4 text-left transition ${
                active
                  ? 'border-ink bg-ink text-paper shadow-soft'
                  : 'border-line bg-cream/55 text-ink hover:-translate-y-0.5 hover:border-sun'
              }`}
            >
              <p className="font-bold">{item.title}</p>
              <p className={`mt-2 text-sm ${active ? 'text-paper/75' : 'text-notebook'}`}>
                {item.subtitle}
              </p>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {mode === 'flashcards' && (
          <Flashcard
            card={currentCard}
            currentIndex={currentIndex}
            totalCards={cards.length}
            onPrevious={goPrevious}
            onNext={goNext}
            onKnown={() => onCardFeedback(currentCard.id, 'known')}
            onPractice={() => onCardFeedback(currentCard.id, 'practice')}
          />
        )}

        {mode === 'sentence' && (
          <SentencePractice
            card={currentCard}
            answer={progress.sentenceAnswers[currentCard.id]}
            currentIndex={currentIndex}
            totalCards={cards.length}
            onPrevious={goPrevious}
            onNext={goNext}
            onSave={(text) => onSentenceSave(currentCard.id, text)}
          />
        )}

        {mode === 'quiz' && <QuizMode cards={cards} />}
      </div>
    </section>
  )
}
