import type { ProgressState } from '../types'

interface ProgressDashboardProps {
  progress: ProgressState
  deckSize: number
}

export function ProgressDashboard({ progress, deckSize }: ProgressDashboardProps) {
  const mastery = Math.round((progress.knownCardIds.length / deckSize) * 100)

  return (
    <section className="rounded-[28px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            Progress dashboard
          </p>
          <h2 className="mt-2 text-balance font-display text-2xl font-bold text-ink sm:text-3xl">
            Your steady practice adds up.
          </h2>
        </div>
        <div className="shrink-0 rounded-[20px] bg-ink px-4 py-3 text-paper shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-paper/70">Streak</p>
          <p className="font-display text-3xl font-bold">{progress.currentStreak}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] bg-cream/70 p-4">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">Cards reviewed</p>
          <p className="mt-3 font-display text-3xl font-bold text-ink">{progress.cardsReviewed}</p>
        </div>
        <div className="rounded-[22px] bg-cream/70 p-4">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">I knew this</p>
          <p className="mt-3 font-display text-3xl font-bold text-leaf">{progress.knewThis}</p>
        </div>
        <div className="rounded-[22px] bg-cream/70 p-4">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">
            Need practice
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-blush">{progress.needPractice}</p>
        </div>
        <div className="rounded-[22px] bg-cream/70 p-4">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">
            Sentences saved
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-ink">
            {progress.sentenceAnswersSubmitted}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-line bg-paper p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">
              A1 deck mastery
            </p>
            <p className="mt-1 text-sm text-notebook">
              Based on how many cards you have marked as known at least once.
            </p>
          </div>
          <p className="shrink-0 font-display text-3xl font-bold text-ink">{mastery}%</p>
        </div>
        <div className="mt-4 h-3 rounded-full bg-cream">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-sun via-apricot to-leaf transition-all"
            style={{ width: `${mastery}%` }}
          />
        </div>
      </div>
    </section>
  )
}
