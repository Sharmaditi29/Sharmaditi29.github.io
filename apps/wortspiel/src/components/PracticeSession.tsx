import { useEffect, useState } from 'react'
import { Flashcard } from './Flashcard'
import { QuizMode } from './QuizMode'
import { SentencePractice } from './SentencePractice'
import type { PracticeMode, ProgressState, VocabularyCard } from '../types'

interface PracticeSessionProps {
  cards: VocabularyCard[]
  progress: ProgressState
  selectedLevel: string
  selectedLanguage: string
  sentencePlaceholder: string
  onCardFeedback: (cardId: string, outcome: 'known' | 'practice') => void
  onSentenceSave: (cardId: string, text: string) => void
}

const modeLabels: Array<{ key: PracticeMode; title: string; subtitle: string }> = [
  { key: 'flashcards', title: 'Cards', subtitle: 'Reveal and review' },
  { key: 'sentence', title: 'Write', subtitle: 'Make one sentence' },
  { key: 'quiz', title: 'Quiz', subtitle: 'Check meaning fast' },
]

export function PracticeSession({
  cards,
  progress,
  selectedLevel,
  selectedLanguage,
  sentencePlaceholder,
  onCardFeedback,
  onSentenceSave,
}: PracticeSessionProps) {
  const [mode, setMode] = useState<PracticeMode>('flashcards')
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentCard = cards[currentIndex]

  useEffect(() => {
    setCurrentIndex(0)
  }, [cards])

  const goPrevious = () =>
    setCurrentIndex((current) => (current === 0 ? cards.length - 1 : current - 1))
  const goNext = () =>
    setCurrentIndex((current) => (current === cards.length - 1 ? 0 : current + 1))

  return (
    <section className="rounded-[30px] border border-line bg-paper/92 p-5 shadow-card sm:p-6 xl:flex xl:h-full xl:flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Practice
          </p>
          <h2 className="mt-2 font-display text-[1.95rem] font-bold text-ink sm:text-[2.25rem]">
            {selectedLanguage} {selectedLevel} practice
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-notebook">
            Stay with one small task, then move to the next card.
          </p>
        </div>
        <div className="shrink-0 rounded-[18px] bg-peach/45 px-3 py-2 text-sm font-bold text-notebook">
          {progress.reviewedCardIds.length} unique cards reviewed
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {modeLabels.map((item) => {
          const active = mode === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key)}
              className={`rounded-[18px] border p-3 text-left transition ${
                active
                  ? 'border-splash bg-splash text-paper shadow-soft'
                  : 'border-line bg-cream/55 text-ink hover:-translate-y-0.5 hover:border-bubble'
              }`}
            >
              <p className="font-bold">{item.title}</p>
              <p className={`mt-1.5 text-sm ${active ? 'text-paper/75' : 'text-notebook'}`}>
                {item.subtitle}
              </p>
            </button>
          )
        })}
      </div>

      <div className="mt-5 xl:flex-1">
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
            languageLabel={selectedLanguage}
            sentencePlaceholder={sentencePlaceholder}
            onSave={(text) => onSentenceSave(currentCard.id, text)}
          />
        )}

        {mode === 'quiz' && <QuizMode cards={cards} languageLabel={selectedLanguage} />}
      </div>
    </section>
  )
}
