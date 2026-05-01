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
    <section className="rounded-[28px] border border-line bg-paper/90 p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            CEFR levels
          </p>
          <h2 className="mt-2 text-balance font-display text-2xl font-bold text-ink sm:text-3xl">
            Pick a level and begin with A1.
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf">
          MVP starts with A1
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {levels.map(({ level, available, subtitle }) => {
          const isSelected = selectedLevel === level

          return (
            <button
              key={level}
              type="button"
              disabled={!available}
              onClick={() => available && onSelect(level)}
              className={`min-w-0 rounded-[24px] border p-5 text-left transition ${
                available
                  ? isSelected
                    ? 'border-ink bg-ink text-paper shadow-soft'
                    : 'border-line bg-cream/55 text-ink hover:-translate-y-0.5 hover:border-sun hover:bg-paper'
                  : 'cursor-not-allowed border-dashed border-line bg-cream/40 text-notebook opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold">{level}</span>
                {!available && (
                  <span className="ml-3 shrink-0 rounded-full bg-paper/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-notebook">
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
