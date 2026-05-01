import type { ProgressState } from '../types'
import { getTodayKey } from '../utils/storage'

interface DailyPracticeProps {
  progress: ProgressState
}

const dailyTargets = [
  { key: 'newWords', title: 'Learn 5 new words', total: 5 },
  { key: 'reviews', title: 'Review 10 cards', total: 10 },
  { key: 'sentences', title: 'Write 3 sentences', total: 3 },
] as const

export function DailyPractice({ progress }: DailyPracticeProps) {
  const today = progress.dailyActivity[getTodayKey()]
  const values = {
    newWords: today?.reviewedCardIds.length ?? 0,
    reviews: today?.reviewCount ?? 0,
    sentences: today?.sentenceCount ?? 0,
  }

  return (
    <section className="rounded-[28px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            Daily practice
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            A calm loop you can actually finish.
          </h2>
        </div>
        <span className="rounded-full bg-sky/20 px-4 py-2 text-sm font-bold text-ink">
          Today: {Object.values(values).some((value) => value > 0) ? 'in progress' : 'ready to begin'}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {dailyTargets.map((target) => {
          const value = values[target.key]
          const complete = value >= target.total
          const progressWidth = Math.min(100, Math.round((value / target.total) * 100))

          return (
            <article
              key={target.key}
              className={`rounded-[24px] border p-5 transition ${
                complete ? 'border-leaf/40 bg-leaf/10' : 'border-line bg-cream/55'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-ink">{target.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                    complete ? 'bg-leaf text-paper' : 'bg-paper text-notebook'
                  }`}
                >
                  {complete ? 'Done' : `${value}/${target.total}`}
                </span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-paper">
                <div
                  className={`h-3 rounded-full transition-all ${
                    complete ? 'bg-leaf' : 'bg-gradient-to-r from-sun to-apricot'
                  }`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
