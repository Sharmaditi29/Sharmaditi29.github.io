import type { CefrLevel } from '../types'

interface LevelSelectorProps {
  selectedLevel: CefrLevel
  onSelect: (level: CefrLevel) => void
}

const levels: Array<{ level: CefrLevel; available: boolean; subtitle: string }> = [
  { level: 'A1', available: true, subtitle: 'Ready now' },
  { level: 'A2', available: false, subtitle: 'Coming soon' },
  { level: 'B1', available: false, subtitle: 'Coming soon' },
  { level: 'B2', available: false, subtitle: 'Coming soon' },
]

export function LevelSelector({ selectedLevel, onSelect }: LevelSelectorProps) {
  return (
    <section className="border-t border-line/80 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Level
          </p>
          <h2 className="mt-2 text-balance font-display text-xl font-bold text-ink">
            Keep it beginner-simple.
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-mint/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
          A1 ready
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
        {levels.map(({ level, available, subtitle }) => {
          const isSelected = selectedLevel === level

          return (
            <button
              key={level}
              type="button"
              disabled={!available}
              onClick={() => available && onSelect(level)}
              className={`min-w-0 rounded-[20px] border p-4 text-left transition ${
                available
                  ? isSelected
                    ? 'border-splash bg-splash text-paper shadow-soft'
                    : 'border-line bg-cream/55 text-ink hover:-translate-y-0.5 hover:border-bubble hover:bg-paper'
                  : 'cursor-not-allowed border-dashed border-line bg-paper/50 text-notebook opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold">{level}</span>
                {!available && (
                  <span className="ml-3 shrink-0 rounded-full bg-paper/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-notebook">
                    Locked
                  </span>
                )}
              </div>
              <p className={`mt-3 text-sm ${isSelected && available ? 'text-paper/80' : 'text-notebook'}`}>
                {subtitle}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
