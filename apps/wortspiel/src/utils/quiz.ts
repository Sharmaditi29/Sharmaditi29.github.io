import type { QuizItem, VocabularyCard } from '../types'

function shuffle<T>(items: T[]) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

export function createQuizItems(cards: VocabularyCard[]): QuizItem[] {
  const displayLabel = (card: VocabularyCard) => (card.article ? `${card.article} ${card.german}` : card.german)
  const meaningCards = shuffle(cards).slice(0, 8)
  const nouns = shuffle(cards.filter((card) => card.article)).slice(0, 6)
  const articleChoices = ['der', 'die', 'das']

  const meaningItems = meaningCards.map((card) => {
    const distractors = shuffle(
      cards
        .filter((candidate) => candidate.id !== card.id)
        .map((candidate) => displayLabel(candidate)),
    ).slice(0, 3)

    return {
      id: `${card.id}-meaning`,
      type: 'meaning' as const,
      prompt: card.english || card.exampleEnglish,
      choices: shuffle([displayLabel(card), ...distractors]),
      answer: displayLabel(card),
    }
  })

  const articleItems = nouns.map((card) => ({
    id: `${card.id}-article`,
    type: 'article' as const,
    prompt: card.german,
    choices: articleChoices,
    answer: card.article!,
  }))

  return shuffle([...meaningItems, ...articleItems])
}
