import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LanguageBar } from './components/LanguageBar'
import { PracticeSession } from './components/PracticeSession'
import { RevisionLibrary } from './components/RevisionLibrary'
import { StudyFooter } from './components/StudyFooter'
import { a1Vocabulary } from './data/a1Vocabulary'
import { dutchVocabulary } from './data/dutchVocabulary'
import { finnishVocabulary } from './data/finnishVocabulary'
import { hindiVocabulary } from './data/hindiVocabulary'
import {
  dutchRevisionCollection,
  finnishRevisionCollection,
  germanRevisionCollection,
  hindiRevisionCollection,
} from './data/revisionCollections'
import type { LanguageOption, LearningLanguage, ProgressState, VocabularyCard } from './types'
import {
  createDefaultProgress,
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

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>('german')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())
  const [germanCards, setGermanCards] = useState<VocabularyCard[]>(a1Vocabulary)
  const [finnishCards, setFinnishCards] = useState<VocabularyCard[]>(finnishVocabulary)
  const [dutchCards, setDutchCards] = useState<VocabularyCard[]>(dutchVocabulary)
  const [hindiCards] = useState<VocabularyCard[]>(hindiVocabulary)
  const [isGermanDeckLoading, setIsGermanDeckLoading] = useState(true)
  const [isFinnishDeckLoading, setIsFinnishDeckLoading] = useState(true)
  const [isDutchDeckLoading, setIsDutchDeckLoading] = useState(true)

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
    {
      id: 'dutch',
      label: 'Dutch',
      accentClass: 'bg-leaf',
      sentencePlaceholder: 'Bijvoorbeeld: Ik leer vandaag Nederlands.',
    },
    {
      id: 'hindi',
      label: 'Hindi',
      accentClass: 'bg-apricot',
      sentencePlaceholder: 'उदाहरण: मैं आज हिन्दी सीख रही हूँ।',
    },
  ]

  const cardsByLanguage: Record<LearningLanguage, VocabularyCard[]> = {
    german: germanCards,
    finnish: finnishCards,
    dutch: dutchCards,
    hindi: hindiCards,
  }

  const revisionByLanguage = {
    german: germanRevisionCollection,
    finnish: finnishRevisionCollection,
    dutch: dutchRevisionCollection,
    hindi: hindiRevisionCollection,
  } satisfies Record<LearningLanguage, typeof germanRevisionCollection>

  const currentLanguage =
    languageOptions.find((option) => option.id === selectedLanguage) ?? languageOptions[0]
  const currentCards = cardsByLanguage[selectedLanguage]
  const currentRevision = revisionByLanguage[selectedLanguage]
  const selectedLevel = 'A1'

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    let cancelled = false
    const currentBuildId = window.__LINGOGARDEN_BUILD_ID__ ?? window.__WORTSPIEL_BUILD_ID__
    const buildId = currentBuildId ? `?v=${currentBuildId}` : ''

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
    void loadDeck('./data/dutch-a1.json', setDutchCards, () => setIsDutchDeckLoading(false))

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
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 sm:px-5 sm:py-5 lg:px-7 xl:px-8 xl:py-6">
        <Header />

        <main className="mt-4 grid flex-1 gap-4 xl:grid-cols-[minmax(330px,360px)_minmax(0,1fr)] xl:items-start xl:gap-5">
          <aside className="rounded-[30px] border border-line bg-paper/92 p-5 shadow-card sm:p-6 xl:flex xl:min-h-[calc(100vh-12.5rem)] xl:flex-col">
            <LanguageBar
              options={languageOptions}
              selectedLanguage={selectedLanguage}
              selectedLevel={selectedLevel}
              onSelect={setSelectedLanguage}
            />

            <RevisionLibrary
              cards={currentCards}
              revision={currentRevision}
              languageLabel={currentLanguage.label}
            />
          </aside>

          <section className="flex flex-col gap-4 xl:min-h-[calc(100vh-12.5rem)]">
            {selectedLanguage === 'german' && isGermanDeckLoading && (
              <div className="rounded-[20px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Loading the full Goethe-based German A1 deck.
              </div>
            )}

            {selectedLanguage === 'finnish' && isFinnishDeckLoading && (
              <div className="rounded-[20px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Loading the full Aalto beginner Finnish deck.
              </div>
            )}

            {selectedLanguage === 'dutch' && isDutchDeckLoading && (
              <div className="rounded-[20px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Loading the full Dutch beginner deck.
              </div>
            )}

            {selectedLanguage === 'hindi' && (
              <div className="rounded-[20px] border border-line bg-paper/90 px-4 py-3 text-sm font-bold text-notebook shadow-soft">
                Hindi is live as a starter A1 deck, with more words sprouting soon.
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

        <div className="mt-4">
          <StudyFooter languageLabel={currentLanguage.label} />
        </div>
      </div>
    </div>
  )
}

export default App
