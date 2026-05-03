import type { ProgressState } from '../types'

interface ProgressDashboardProps {
  progress: ProgressState
  deckSize: number
}

export function ProgressDashboard({ progress, deckSize }: ProgressDashboardProps) {
  const mastery = Math.round((progress.knownCardIds.length / deckSize) * 100)

  return (
    <section className="border-t border-line/80 pt-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Progress
          </p>
          <h2 className="mt-1 font-display text-base font-bold text-ink">Tiny wins count.</h2>
        </div>
        <div className="shrink-0 rounded-[18px] bg-bubble px-3 py-2.5 text-ink shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/70">Streak</p>
          <p className="font-display text-xl font-bold">{progress.currentStreak}</p>
        </div>
      </div>

      <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
        <div className="rounded-[14px] bg-peach/45 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-notebook">Reviewed</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">{progress.cardsReviewed}</p>
        </div>
        <div className="rounded-[14px] bg-mint/45 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-notebook">Known</p>
          <p className="mt-1 font-display text-lg font-bold text-leaf">{progress.knewThis}</p>
        </div>
        <div className="rounded-[14px] bg-bubble/35 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-notebook">Practice</p>
          <p className="mt-1 font-display text-lg font-bold text-blush">{progress.needPractice}</p>
        </div>
        <div className="rounded-[14px] bg-sun/35 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-notebook">Sentences</p>
          <p className="mt-1 font-display text-lg font-bold text-ink">
            {progress.sentenceAnswersSubmitted}
          </p>
        </div>
      </div>

      <div className="mt-2.5 rounded-[16px] border border-line bg-paper p-2.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-notebook">Deck mastery</p>
            <p className="mt-0.5 text-[11px] text-notebook">Based on known cards.</p>
          </div>
          <p className="shrink-0 font-display text-lg font-bold text-ink">{mastery}%</p>
        </div>
        <div className="mt-2 h-2 rounded-full bg-cream">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-sun via-apricot to-leaf transition-all"
            style={{ width: `${mastery}%` }}
          />
        </div>
      </div>
    </section>
  )
}
