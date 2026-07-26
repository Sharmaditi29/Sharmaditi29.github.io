import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Flashcard } from './components/Flashcard'
import { QuizMode } from './components/QuizMode'
import { RevisionLibrary } from './components/RevisionLibrary'
import { SentencePractice } from './components/SentencePractice'
import { germanCourse } from './data/germanCourse'
import { a1Vocabulary } from './data/a1Vocabulary'
import type { PracticeMode, ProgressState, VocabularyCard } from './types'
import {
  createDefaultProgress,
  getTodayKey,
  loadProgress,
  recordCardFeedback,
  saveProgress,
  saveSentenceAnswer,
} from './utils/storage'

declare global {
  interface Window {
    __LINGOGARDEN_BUILD_ID__?: string
    __WORTSPIEL_BUILD_ID__?: string
  }
}

const levelOrder: Array<'A1' | 'A2' | 'B1'> = ['A1', 'A2', 'B1']
const studyModes: Array<{ id: PracticeMode; label: string; note: string }> = [
  { id: 'flashcards', label: '1. Cards', note: 'See the word, reveal a clue, then check the example.' },
  { id: 'sentence', label: '2. Write', note: 'Write one short German sentence of your own.' },
  { id: 'quiz', label: '3. Quiz', note: 'Finish with a small quiz round.' },
]
const allCategoriesLabel = 'All words'

function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1'>('A1')
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('flashcards')
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesLabel)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [germanDeck, setGermanDeck] = useState<VocabularyCard[]>(a1Vocabulary)
  const [isDeckLoading, setIsDeckLoading] = useState(true)

  const currentConfig = germanCourse[selectedLevel]
  const levelCards = useMemo(
    () => germanDeck.filter((card) => card.level === selectedLevel),
    [germanDeck, selectedLevel],
  )
  const currentCategories = useMemo(
    () => [allCategoriesLabel, ...new Set(levelCards.map((card) => card.category))],
    [levelCards],
  )
  const currentCards = useMemo(
    () =>
      selectedCategory === allCategoriesLabel
        ? levelCards
        : levelCards.filter((card) => card.category === selectedCategory),
    [levelCards, selectedCategory],
  )
  const currentCard = currentCards[currentIndex] ?? currentCards[0] ?? null
  const currentLevelIds = useMemo(() => new Set(levelCards.map((card) => card.id)), [levelCards])

  const levelStats = useMemo(() => {
    const known = progress.knownCardIds.filter((id) => currentLevelIds.has(id)).length
    const needsPractice = progress.practiceCardIds.filter((id) => currentLevelIds.has(id)).length
    const sentences = Object.keys(progress.sentenceAnswers).filter((id) => currentLevelIds.has(id)).length
    const seen = progress.reviewedCardIds.filter((id) => currentLevelIds.has(id)).length

    return {
      known,
      needsPractice,
      sentences,
      seen,
      mastery: levelCards.length ? Math.round((known / levelCards.length) * 100) : 0,
    }
  }, [
    currentLevelIds,
    levelCards.length,
    progress.knownCardIds,
    progress.practiceCardIds,
    progress.reviewedCardIds,
    progress.sentenceAnswers,
  ])

  const todayKey = getTodayKey()
  const todayActivity = progress.dailyActivity[todayKey]
  const todayReviewed = todayActivity?.reviewedCardIds.filter((id) => currentLevelIds.has(id)).length ?? 0
  const todaySentences = todayActivity?.sentenceCount ?? 0

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    let cancelled = false
    const buildId = window.__LINGOGARDEN_BUILD_ID__ ?? window.__WORTSPIEL_BUILD_ID__
    const suffix = buildId ? `?v=${buildId}` : ''

    async function loadDeck() {
      try {
        const response = await fetch(`./data/german-a1-a2-b1.json${suffix}`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load German deck: ${response.status}`)
        }

        const nextDeck = (await response.json()) as VocabularyCard[]
        if (!cancelled && nextDeck.length > 0) {
          setGermanDeck(nextDeck)
        }
      } catch (error) {
        console.warn('Using bundled German deck fallback.', error)
      } finally {
        if (!cancelled) {
          setIsDeckLoading(false)
        }
      }
    }

    void loadDeck()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setSelectedCategory(allCategoriesLabel)
  }, [selectedLevel])

  useEffect(() => {
    if (!currentCategories.includes(selectedCategory)) {
      setSelectedCategory(allCategoriesLabel)
    }
  }, [currentCategories, selectedCategory])

  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedLevel, selectedCategory])

  useEffect(() => {
    if (currentIndex >= currentCards.length) {
      setCurrentIndex(0)
    }
  }, [currentCards.length, currentIndex])

  const handleCardFeedback = (cardId: string, outcome: 'known' | 'practice') => {
    setProgress((current) => recordCardFeedback(current, cardId, outcome))
  }

  const handleSentenceSave = (cardId: string, text: string) => {
    setProgress((current) => saveSentenceAnswer(current, cardId, text))
  }

  const goPrevious = () =>
    setCurrentIndex((current) => (current === 0 ? currentCards.length - 1 : current - 1))
  const goNext = () =>
    setCurrentIndex((current) => (current === currentCards.length - 1 ? 0 : current + 1))

  const selectedModeLabel = studyModes.find((mode) => mode.id === selectedMode)?.note
  const focusDescription =
    selectedCategory === allCategoriesLabel
      ? `${levelCards.length} cards ready in ${selectedLevel}.`
      : `${currentCards.length} cards in ${selectedCategory}.`

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <Header />

        <main className="mt-6 grid gap-5 xl:grid-cols-[305px_minmax(0,1fr)] xl:items-start">
          <aside className="rounded-[30px] bg-paper/92 p-5 shadow-soft sm:p-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
                Today
              </p>
              <h2 className="mt-2 font-display text-[1.45rem] font-bold leading-tight text-ink">
                One small German session.
              </h2>
              <p className="mt-2 text-sm leading-6 text-notebook">
                Keep it light: cards first, one sentence next, a short quiz at the end.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-ink">Review cards</p>
                  <p className="text-xs text-notebook">Touch 10 cards today.</p>
                </div>
                <span className="rounded-full bg-splash/10 px-3 py-1.5 text-sm font-bold text-splash">
                  {todayReviewed}/10
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-ink">Write</p>
                  <p className="text-xs text-notebook">Save 2 short sentences.</p>
                </div>
                <span className="rounded-full bg-leaf/10 px-3 py-1.5 text-sm font-bold text-leaf">
                  {todaySentences}/2
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-white/72 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-ink">Quiz</p>
                  <p className="text-xs text-notebook">Do one quick round when ready.</p>
                </div>
                <span className="rounded-full bg-sun/20 px-3 py-1.5 text-sm font-bold text-ink">
                  Ready
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-[20px] bg-white/72 px-4 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-notebook">
                Your progress
              </p>
              <div className="mt-3 grid gap-2 text-sm text-ink">
                <p>
                  <span className="font-bold">{levelStats.known}</span> known cards in {selectedLevel}
                </p>
                <p>
                  <span className="font-bold">{levelStats.needsPractice}</span> marked for another look
                </p>
                <p>
                  <span className="font-bold">{progress.currentStreak}</span> day streak
                </p>
              </div>
            </div>

            <RevisionLibrary
              revision={currentConfig.revision}
              levelLabel={selectedLevel}
              cardCount={levelCards.length}
            />
          </aside>

          <section className="rounded-[32px] bg-paper/92 p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
                  German study desk
                </p>
                <h2 className="mt-2 font-display text-[2rem] font-bold leading-tight text-ink sm:text-[2.3rem]">
                  {selectedLevel} practice
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-notebook">
                  {currentConfig.summary}
                </p>
              </div>

              <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-notebook">
                {focusDescription}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
                  Level
                </p>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {levelOrder.map((level) => {
                    const active = level === selectedLevel
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedLevel(level)}
                        className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                          active ? 'bg-splash text-paper' : 'bg-white text-ink hover:bg-white/90'
                        }`}
                      >
                        {level}
                      </button>
                    )
                  })}
                </div>

                <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
                  Study flow
                </p>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {studyModes.map((mode) => {
                    const active = mode.id === selectedMode
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                          active ? 'bg-ink text-paper' : 'bg-white text-ink hover:bg-white/90'
                        }`}
                      >
                        {mode.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-notebook">
                    Focus topic
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="mt-2 w-full appearance-none rounded-[18px] border border-line/35 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-splash"
                  >
                    {currentCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-3 text-sm leading-6 text-notebook">{selectedModeLabel}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-notebook">
              <p>
                <span className="font-bold text-ink">{levelStats.seen}</span> cards seen
              </p>
              <p>
                <span className="font-bold text-ink">{levelStats.sentences}</span> writing prompts saved
              </p>
              <p>
                <span className="font-bold text-ink">{levelStats.mastery}%</span> known so far
              </p>
            </div>

            {isDeckLoading && (
              <div className="mt-5 rounded-[18px] bg-white/80 px-4 py-3 text-sm font-bold text-notebook">
                Loading the full German deck for A1, A2, and B1.
              </div>
            )}

            {!currentCard ? (
              <div className="mt-5 rounded-[24px] bg-white/80 px-5 py-6">
                <p className="text-lg font-bold text-ink">This level is still getting ready.</p>
                <p className="mt-2 text-sm leading-6 text-notebook">
                  Try another level for now, or refresh once the deck has finished loading.
                </p>
              </div>
            ) : (
              <div className="mt-5">
                {selectedMode === 'flashcards' && (
                  <Flashcard
                    card={currentCard}
                    currentIndex={currentIndex}
                    totalCards={currentCards.length}
                    onPrevious={goPrevious}
                    onNext={goNext}
                    onKnown={() => handleCardFeedback(currentCard.id, 'known')}
                    onPractice={() => handleCardFeedback(currentCard.id, 'practice')}
                  />
                )}

                {selectedMode === 'sentence' && (
                  <SentencePractice
                    card={currentCard}
                    answer={progress.sentenceAnswers[currentCard.id]}
                    currentIndex={currentIndex}
                    totalCards={currentCards.length}
                    sentencePlaceholder={currentConfig.sentencePlaceholder}
                    onPrevious={goPrevious}
                    onNext={goNext}
                    onSave={(text) => handleSentenceSave(currentCard.id, text)}
                  />
                )}

                {selectedMode === 'quiz' && <QuizMode cards={currentCards} />}
              </div>
            )}

            <p className="mt-5 text-xs leading-6 text-notebook">
              Built from Goethe A1, A2, and B1 vocabulary lists for simple daily review.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
