import { useEffect, useMemo, useState } from 'react'
import { Flashcard } from './components/Flashcard'
import { Header } from './components/Header'
import { ProgressDashboard } from './components/ProgressDashboard'
import { QuizMode } from './components/QuizMode'
import { RevisionLibrary } from './components/RevisionLibrary'
import { StudyFooter } from './components/StudyFooter'
import { a1Vocabulary } from './data/a1Vocabulary'
import { germanRevisionCollection } from './data/revisionCollections'
import type { CefrLevel, ProgressState, VocabularyCard } from './types'
import {
  createDefaultProgress,
  loadProgress,
  recordCardFeedback,
  saveProgress,
} from './utils/storage'

declare global {
  interface Window {
    __WORTSPIEL_BUILD_ID__?: string
  }
}

type LearningTrack = 'vocabulary' | 'grammar' | 'quiz'

const levelOptions: Array<{ id: CefrLevel; status: 'ready' | 'soon' }> = [
  { id: 'A1', status: 'ready' },
  { id: 'A2', status: 'soon' },
  { id: 'B1', status: 'soon' },
]

const trackOptions: Array<{
  id: LearningTrack
  label: string
  summary: string
}> = [
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    summary: 'Study one German word at a time with meaning, article, plural, and example sentence.',
  },
  {
    id: 'grammar',
    label: 'Grammar',
    summary: 'Review the core A1 structures you need before or after working with the deck.',
  },
  {
    id: 'quiz',
    label: 'Practice quiz',
    summary: 'Check recall with article and meaning questions built from the same level.',
  },
]

function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())
  const [germanCards, setGermanCards] = useState<VocabularyCard[]>(a1Vocabulary)
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1')
  const [selectedTrack, setSelectedTrack] = useState<LearningTrack>('vocabulary')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGermanDeckLoading, setIsGermanDeckLoading] = useState(true)
  const currentCards = useMemo(
    () => germanCards.filter((card) => card.level === selectedLevel),
    [germanCards, selectedLevel],
  )
  const currentCard = currentCards[currentIndex] ?? currentCards[0]
  const knownRatio = currentCards.length
    ? Math.round((progress.knownCardIds.length / currentCards.length) * 100)
    : 0

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    let cancelled = false
    const currentBuildId = window.__WORTSPIEL_BUILD_ID__
    const buildId = currentBuildId ? `?v=${currentBuildId}` : ''

    async function loadDeck(resourcePath: string, onSuccess: (cards: VocabularyCard[]) => void) {
      try {
        const response = await fetch(`${resourcePath}${buildId}`, { cache: 'no-store' })

        if (!response.ok) {
          throw new Error(`Failed to load deck ${resourcePath}: ${response.status}`)
        }

        const nextCards = (await response.json()) as VocabularyCard[]

        if (!cancelled && nextCards.length > 0) {
          onSuccess(nextCards)
        }
      } catch (error) {
        console.warn(`Using fallback deck for ${resourcePath}.`, error)
      } finally {
        if (!cancelled) {
          setIsGermanDeckLoading(false)
        }
      }
    }

    void loadDeck('./data/goethe-a1.json', setGermanCards)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedLevel, selectedTrack])

  const handleCardFeedback = (cardId: string, outcome: 'known' | 'practice') => {
    setProgress((current) => recordCardFeedback(current, cardId, outcome))
  }

  const goPrevious = () =>
    setCurrentIndex((current) => (current === 0 ? currentCards.length - 1 : current - 1))
  const goNext = () =>
    setCurrentIndex((current) => (current === currentCards.length - 1 ? 0 : current + 1))

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1460px] px-4 py-4 sm:px-5 sm:py-5 lg:px-7 xl:px-8 xl:py-6">
        <Header />

        <main className="mt-5 flex flex-col gap-4">
          <section className="rounded-[30px] border border-line/70 bg-paper/80 p-5 shadow-card sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,1.1fr)]">
              <article className="rounded-[24px] border border-line/60 bg-paper px-4 py-4 sm:px-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  Step 1
                </p>
                <h2 className="mt-2 font-display text-[1.25rem] font-bold text-ink">
                  Choose language
                </h2>
                <button
                  type="button"
                  className="mt-4 w-full rounded-[22px] border border-splash/20 bg-splash px-4 py-4 text-left text-paper shadow-soft"
                >
                  <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-paper/75">
                    Active now
                  </span>
                  <span className="mt-2 block text-xl font-bold">German</span>
                  <span className="mt-2 block text-sm leading-6 text-paper/80">
                    This course is currently focused on German only, so the learning path stays clear.
                  </span>
                </button>
              </article>

              <article className="rounded-[24px] border border-line/60 bg-paper px-4 py-4 sm:px-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  Step 2
                </p>
                <h2 className="mt-2 font-display text-[1.25rem] font-bold text-ink">
                  Pick a level
                </h2>
                <div className="mt-4 grid gap-2">
                  {levelOptions.map((option) => {
                    const active = option.id === selectedLevel
                    const disabled = option.status !== 'ready'

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedLevel(option.id)}
                        className={`rounded-[20px] border px-4 py-3 text-left transition ${
                          active
                            ? 'border-splash/20 bg-splash text-paper'
                            : disabled
                              ? 'border-line/60 bg-paper/65 text-notebook'
                              : 'border-line/60 bg-paper text-ink hover:border-splash/40'
                        }`}
                      >
                        <span className="block text-base font-bold">{option.id}</span>
                        <span className={`mt-1 block text-sm ${active ? 'text-paper/80' : 'text-notebook'}`}>
                          {option.status === 'ready' ? 'Ready to study now' : 'Coming soon'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </article>

              <article className="rounded-[24px] border border-line/60 bg-paper px-4 py-4 sm:px-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  Step 3
                </p>
                <h2 className="mt-2 font-display text-[1.25rem] font-bold text-ink">
                  Choose how to study
                </h2>
                <div className="mt-4 grid gap-2">
                  {trackOptions.map((option) => {
                    const active = option.id === selectedTrack

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedTrack(option.id)}
                        className={`rounded-[20px] border px-4 py-3 text-left transition ${
                          active
                            ? 'border-splash/20 bg-splash text-paper'
                            : 'border-line/60 bg-paper text-ink hover:border-splash/40'
                        }`}
                      >
                        <span className="block text-base font-bold">{option.label}</span>
                        <span className={`mt-1 block text-sm leading-5 ${active ? 'text-paper/80' : 'text-notebook'}`}>
                          {option.summary}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start xl:gap-5">
            <aside className="rounded-[28px] border border-line/65 bg-paper/75 p-5 sm:p-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
                  German course
                </p>
                <h2 className="mt-2 font-display text-[1.7rem] font-bold text-ink">
                  {selectedLevel} learning path
                </h2>
                <p className="mt-2 text-sm leading-6 text-notebook">
                  Move through one level at a time. Start with vocabulary, use grammar notes when needed,
                  then check yourself with the quiz.
                </p>
              </div>

              <div className="mt-5 rounded-[22px] bg-paper px-4 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  Current focus
                </p>
                <p className="mt-2 text-lg font-bold text-ink">
                  {trackOptions.find((option) => option.id === selectedTrack)?.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-notebook">
                  {trackOptions.find((option) => option.id === selectedTrack)?.summary}
                </p>
              </div>

              <div className="mt-4 rounded-[22px] bg-paper px-4 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  What is included
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink">
                  <li>{currentCards.length} German A1 vocabulary cards</li>
                  <li>Core grammar refreshers from the Goethe A1 scope</li>
                  <li>Practice quiz with meaning and article checks</li>
                </ul>
              </div>

              <div className="mt-4 rounded-[22px] bg-paper px-4 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-notebook">
                  Study rhythm
                </p>
                <ol className="mt-3 grid gap-2 text-sm leading-6 text-ink">
                  <li>1. Review 5 to 10 words in vocabulary mode.</li>
                  <li>2. Open grammar when you notice a weak spot.</li>
                  <li>3. Finish with quiz practice for recall.</li>
                </ol>
              </div>

              <div className="mt-4 border-t border-line/70 pt-4">
                <ProgressDashboard progress={progress} deckSize={currentCards.length || 1} />
              </div>
            </aside>

            <section className="flex flex-col gap-4">
              {isGermanDeckLoading && (
                <div className="rounded-[18px] border border-line/60 bg-paper/80 px-4 py-3 text-sm font-bold text-notebook">
                  Loading the full Goethe-based German deck.
                </div>
              )}

              {selectedTrack === 'vocabulary' && currentCard && (
                <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.48fr)]">
                  <div className="rounded-[28px] border border-line/65 bg-paper/76 p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
                          Vocabulary
                        </p>
                        <h2 className="mt-2 font-display text-[2rem] font-bold text-ink sm:text-[2.2rem]">
                          Build the German A1 word base
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-notebook">
                          Learn the word, reveal meaning when needed, then mark whether it felt familiar or needs more review.
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-paper px-4 py-3 text-sm font-bold text-ink">
                        Known cards: {knownRatio}%
                      </div>
                    </div>

                    <div className="mt-5">
                      <Flashcard
                        card={currentCard}
                        currentIndex={currentIndex}
                        totalCards={currentCards.length}
                        onPrevious={goPrevious}
                        onNext={goNext}
                        onKnown={() => handleCardFeedback(currentCard.id, 'known')}
                        onPractice={() => handleCardFeedback(currentCard.id, 'practice')}
                      />
                    </div>
                  </div>

                  <aside className="rounded-[28px] border border-line/65 bg-paper/76 p-5 sm:p-6">
                    <RevisionLibrary
                      cards={currentCards}
                      revision={germanRevisionCollection}
                      languageLabel="German"
                      allowedViews={['themes', 'words']}
                      initialView="words"
                      title="Vocabulary support"
                      description="Search the level word bank or browse by topic when you want more context around the flashcards."
                    />
                  </aside>
                </section>
              )}

              {selectedTrack === 'grammar' && (
                <section className="rounded-[28px] border border-line/65 bg-paper/76 p-5 sm:p-6">
                  <RevisionLibrary
                    cards={currentCards}
                    revision={germanRevisionCollection}
                    languageLabel="German"
                    allowedViews={['grammar']}
                    initialView="grammar"
                    title="Grammar for this level"
                    description="Review one A1 grammar point at a time, then return to vocabulary or quiz practice."
                  />
                </section>
              )}

              {selectedTrack === 'quiz' && (
                <section className="rounded-[28px] border border-line/65 bg-paper/76 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
                        Practice quiz
                      </p>
                      <h2 className="mt-2 font-display text-[2rem] font-bold text-ink sm:text-[2.2rem]">
                        Check what stays with you
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-notebook">
                        Use this after vocabulary review to test meaning recall and article choice with the same A1 material.
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-paper px-4 py-3 text-sm font-bold text-ink">
                      {currentCards.length} questions ready
                    </div>
                  </div>

                  <div className="mt-5">
                    <QuizMode cards={currentCards} languageLabel="German" />
                  </div>
                </section>
              )}

              <StudyFooter languageLabel="German" />
            </section>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
