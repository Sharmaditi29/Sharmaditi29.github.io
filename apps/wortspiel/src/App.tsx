import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { LanguageBar } from './components/LanguageBar'
import { LevelSelector } from './components/LevelSelector'
import { ProgressDashboard } from './components/ProgressDashboard'
import { PracticeSession } from './components/PracticeSession'
import { a1Vocabulary } from './data/a1Vocabulary'
import { finnishVocabulary } from './data/finnishVocabulary'
import type { CefrLevel, LanguageOption, LearningLanguage, ProgressState } from './types'
import {
  createDefaultProgress,
  loadProgress,
  recordCardFeedback,
  saveProgress,
  saveSentenceAnswer,
} from './utils/storage'

function App() {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1')
  const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>('german')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress() ?? createDefaultProgress())

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

  const currentLanguage = languageOptions.find((option) => option.id === selectedLanguage) ?? languageOptions[0]
  const currentCards = selectedLanguage === 'german' ? a1Vocabulary : finnishVocabulary

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
          <LanguageBar
            options={languageOptions}
            selectedLanguage={selectedLanguage}
            onSelect={setSelectedLanguage}
          />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <LevelSelector selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
            <ProgressDashboard progress={progress} deckSize={currentCards.length} />
          </div>

          <PracticeSession
            cards={currentCards}
            progress={progress}
            selectedLevel={selectedLevel}
            selectedLanguage={currentLanguage.label}
            sentencePlaceholder={currentLanguage.sentencePlaceholder}
            onCardFeedback={handleCardFeedback}
            onSentenceSave={handleSentenceSave}
          />
        </main>
      </div>
    </div>
  )
}

export default App
