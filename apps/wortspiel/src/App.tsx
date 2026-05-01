import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LevelSelector } from './components/LevelSelector'
import { ProgressDashboard } from './components/ProgressDashboard'
import { DailyPractice } from './components/DailyPractice'
import { PracticeSession } from './components/PracticeSession'
import { a1Vocabulary } from './data/a1Vocabulary'
import type { CefrLevel, ProgressState } from './types'
import {
  createDefaultProgress,
  loadProgress,
  recordCardFeedback,
  saveProgress,
  saveSentenceAnswer,
} from './utils/storage'

function App() {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const handleCardFeedback = (cardId: string, outcome: 'known' | 'practice') => {
    setProgress((current) => recordCardFeedback(current, cardId, outcome))
  }

  const handleSentenceSave = (cardId: string, text: string) => {
    setProgress((current) => saveSentenceAnswer(current, cardId, text))
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Header onStart={() => setSessionStarted(true)} sessionStarted={sessionStarted} />

        <main className="flex flex-1 flex-col gap-6 pb-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <LevelSelector selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
            <ProgressDashboard progress={progress} deckSize={a1Vocabulary.length} />
          </div>

          <DailyPractice progress={progress} />

          {sessionStarted ? (
            <PracticeSession
              cards={a1Vocabulary}
              progress={progress}
              selectedLevel={selectedLevel}
              onCardFeedback={handleCardFeedback}
              onSentenceSave={handleSentenceSave}
            />
          ) : (
            <section className="rounded-[28px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-notebook">
                  Home screen
                </p>
                <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                  Your daily A1 practice starts here.
                </h2>
                <p className="mt-4 text-base leading-8 text-notebook sm:text-lg">
                  Review playful flashcards, write your own German sentences, and
                  check your memory with quick quizzes. Start small and come back
                  every day.
                </p>
                <button
                  type="button"
                  onClick={() => setSessionStarted(true)}
                  className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-base font-bold text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-notebook"
                >
                  Start A1 practice
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
