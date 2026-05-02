export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type LearningLanguage = 'german' | 'finnish'

export interface VocabularyCard {
  id: string
  level: CefrLevel
  german: string
  english: string
  article?: 'der' | 'die' | 'das'
  plural?: string
  category: string
  exampleGerman: string
  exampleEnglish: string
  grammarNote?: string
}

export interface LearningConcept {
  id: string
  title: string
  summary: string
  bullets: string[]
  example?: string
}

export interface RevisionCollection {
  themes: LearningConcept[]
  grammar: LearningConcept[]
  sourceLabel: string
  sourceHref?: string
  note: string
}

export interface SentenceAnswer {
  text: string
  submittedAt: string
}

export interface LanguageOption {
  id: LearningLanguage
  label: string
  accentClass: string
  sentencePlaceholder: string
}

export interface DailyActivity {
  reviewedCardIds: string[]
  reviewCount: number
  sentenceCount: number
}

export interface ProgressState {
  cardsReviewed: number
  knewThis: number
  needPractice: number
  sentenceAnswersSubmitted: number
  reviewedCardIds: string[]
  knownCardIds: string[]
  practiceCardIds: string[]
  sentenceAnswers: Record<string, SentenceAnswer>
  dailyActivity: Record<string, DailyActivity>
  lastActiveDate: string | null
  currentStreak: number
}

export type PracticeMode = 'flashcards' | 'sentence' | 'quiz'

export interface MeaningQuizItem {
  id: string
  type: 'meaning'
  prompt: string
  choices: ReadonlyArray<string>
  answer: string
}

export interface ArticleQuizItem {
  id: string
  type: 'article'
  prompt: string
  choices: ReadonlyArray<'der' | 'die' | 'das'>
  answer: 'der' | 'die' | 'das'
}

export type QuizItem = MeaningQuizItem | ArticleQuizItem
