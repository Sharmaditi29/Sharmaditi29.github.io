import type { DailyActivity, ProgressState } from '../types'

const STORAGE_KEY = 'lingogarden-progress'
const LEGACY_STORAGE_KEY = 'wortspiel-progress'

function createDailyActivity(): DailyActivity {
  return {
    reviewedCardIds: [],
    reviewCount: 0,
    sentenceCount: 0,
  }
}

export function createDefaultProgress(): ProgressState {
  return {
    cardsReviewed: 0,
    knewThis: 0,
    needPractice: 0,
    sentenceAnswersSubmitted: 0,
    reviewedCardIds: [],
    knownCardIds: [],
    practiceCardIds: [],
    sentenceAnswers: {},
    dailyActivity: {},
    lastActiveDate: null,
    currentStreak: 0,
  }
}

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function previousDayKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`)
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function ensureActiveDay(progress: ProgressState) {
  const today = getTodayKey()
  const next = {
    ...progress,
    dailyActivity: { ...progress.dailyActivity },
  }

  if (!next.dailyActivity[today]) {
    next.dailyActivity[today] = createDailyActivity()
  }

  if (next.lastActiveDate !== today) {
    next.currentStreak =
      next.lastActiveDate === previousDayKey(today) ? next.currentStreak + 1 : 1
    next.lastActiveDate = today
  }

  return { next, today }
}

function pushUnique(values: string[], value: string) {
  return values.includes(value) ? values : [...values, value]
}

export function loadProgress() {
  if (!hasStorage()) {
    return createDefaultProgress()
  }

  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY)

    if (!stored) {
      return createDefaultProgress()
    }

    const parsed = JSON.parse(stored) as Partial<ProgressState>
    return {
      ...createDefaultProgress(),
      ...parsed,
      reviewedCardIds: parsed.reviewedCardIds ?? [],
      knownCardIds: parsed.knownCardIds ?? [],
      practiceCardIds: parsed.practiceCardIds ?? [],
      sentenceAnswers: parsed.sentenceAnswers ?? {},
      dailyActivity: parsed.dailyActivity ?? {},
    }
  } catch {
    return createDefaultProgress()
  }
}

export function saveProgress(progress: ProgressState) {
  if (!hasStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  window.localStorage.removeItem(LEGACY_STORAGE_KEY)
}

export function recordCardFeedback(
  progress: ProgressState,
  cardId: string,
  outcome: 'known' | 'practice',
) {
  // TODO: Extend this into true spaced repetition scheduling in a future version.
  const { next, today } = ensureActiveDay(progress)
  const daily = next.dailyActivity[today]

  daily.reviewCount += 1
  daily.reviewedCardIds = pushUnique(daily.reviewedCardIds, cardId)

  return {
    ...next,
    cardsReviewed: next.cardsReviewed + 1,
    knewThis: next.knewThis + (outcome === 'known' ? 1 : 0),
    needPractice: next.needPractice + (outcome === 'practice' ? 1 : 0),
    reviewedCardIds: pushUnique(next.reviewedCardIds, cardId),
    knownCardIds:
      outcome === 'known' ? pushUnique(next.knownCardIds, cardId) : next.knownCardIds,
    practiceCardIds:
      outcome === 'practice'
        ? pushUnique(next.practiceCardIds, cardId)
        : next.practiceCardIds,
  }
}

export function saveSentenceAnswer(
  progress: ProgressState,
  cardId: string,
  text: string,
) {
  const { next, today } = ensureActiveDay(progress)
  const daily = next.dailyActivity[today]

  daily.sentenceCount += 1

  return {
    ...next,
    sentenceAnswersSubmitted: next.sentenceAnswersSubmitted + 1,
    sentenceAnswers: {
      ...next.sentenceAnswers,
      [cardId]: {
        text,
        submittedAt: new Date().toISOString(),
      },
    },
  }
}
