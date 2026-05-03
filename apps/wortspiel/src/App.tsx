import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LanguageBar } from './components/LanguageBar'
import { LevelSelector } from './components/LevelSelector'
import { ProgressDashboard } from './components/ProgressDashboard'
import { PracticeSession } from './components/PracticeSession'
import { RevisionLibrary } from './components/RevisionLibrary'
import { a1Vocabulary } from './data/a1Vocabulary'
import { finnishVocabulary } from './data/finnishVocabulary'
import { finnishRevisionCollection, germanRevisionCollection } from './data/revisionCollections'
import type {
  CefrLevel,
  LanguageOption,
  LearningLanguage,
  ProgressState,
  VocabularyCard,
} from './types'
import {
  createDefaultProgress,
  loadProgress,
  recordCardFeedback,
  saveProgress,
  saveSentenceAnswer,
} from './utils/storage'

declare global {
  interface Window {
    __WORTSPIEL_BUILD_ID__?: string
  }
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1')
  const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>('german')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())
  const [germanCards, setGermanCards] = useState<VocabularyCard[]>(a1Vocabulary)
  const [finnishCards, setFinnishCards] = useState<VocabularyCard[]>(finnishVocabulary)
  const [isGermanDeckLoading, setIsGermanDeckLoading] = useState(true)
  const [isFinnishDeckLoading, setIsFinnishDeckLoading] = useState(true)

  const languageOptions: LanguageOption[] = [
    {
      id: 'german',
      label: 'German',
      accentClass: 'bg-splash',
      sentencePlaceholder: 'Zum Beispiel: Ich lerne heute Deutsch.',
    },
    {
      id: 'finnish',
      label: 'Finnish',
      accentClass: 'bg-bubble',
      sentencePlaceholder: 'Esimerkiksi: Minä opiskelen suomea tänään.',
    },
  ]

  const currentLanguage =
    languageOptions.find((option) => option.id === selectedLanguage) ?? languageOptions[0]
  const currentCards = selectedLanguage === 'german' ? germanCards : finnishCards
  const currentRevision =
    selectedLanguage === 'german' ? germanRevisionCollection : finnishRevisionCollection

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    let cancelled = false
    const buildId = window.__WORTSPIEL_BUILD_ID__ ? `?v=${window.__WORTSPIEL_BUILD_ID__}` : ''

    async function loadDeck(
      resourcePath: string,
      onSuccess: (cards: VocabularyCard[]) => void,
      onDone: () => void,
    ) {
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
          onDone()
        }
      }
    }

    void loadDeck('./data/goethe-a1.json', setGermanCards, () => setIsGermanDeckLoading(false))
    void loadDeck('./data/finnish-a1.json', setFinnishCards, () => setIsFinnishDeckLoading(false))

    return () => {
      cancelled = true
    }
  }, [])

  const handleCardFeedback = (cardId: string, outcome: 'known' | 'practice') => {
    setProgress((current) => recordCardFeedback(current, cardId, outcome))
  }

  const handleSentenceSave = (cardId: string, text: string) => {
    setProgress((current) => saveSentenceAnswer(current, cardId, text))
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-4 py-4 sm:px-5 lg:px-6">
        <Header onStart={() => setSessionStarted(true)} sessionStarted={sessionStarted} />

        <main className="mt-4 grid flex-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[26px] border border-line bg-paper/90 p-4 shadow-card xl:pb-4">
            <LanguageBar
              options={languageOptions}
              selectedLanguage={selectedLanguage}
              onSelect={setSelectedLanguage}
            />

            <LevelSelector selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
            <ProgressDashboard progress={progress} deckSize={currentCards.length} />
            <RevisionLibrary
              cards={currentCards}
              revision={currentRevision}
              languageLabel={currentLanguage.label}
            />
          </aside>

          <section className="flex flex-col gap-4 xl:min-h-0">
            {selectedLanguage === 'german' && isGermanDeckLoading && (
              <div className="rounded-[18px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Loading the full Goethe-based German A1 deck.
              </div>
            )}

            {selectedLanguage === 'finnish' && isFinnishDeckLoading && (
              <div className="rounded-[18px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Loading the full Aalto beginner Finnish deck.
              </div>
            )}

            <PracticeSession
              cards={currentCards}
              progress={progress}
              selectedLevel={selectedLevel}
              selectedLanguage={currentLanguage.label}
              sentencePlaceholder={currentLanguage.sentencePlaceholder}
              onCardFeedback={handleCardFeedback}
              onSentenceSave={handleSentenceSave}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
