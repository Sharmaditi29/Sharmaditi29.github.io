import type { CefrLevel, LanguageOption, LearningLanguage } from '../types'

interface LanguageBarProps {
  options: LanguageOption[]
  selectedLanguage: LearningLanguage
  selectedLevel: CefrLevel
  onSelect: (language: LearningLanguage) => void
}

const levelOptions: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function LanguageBar({
  options,
  selectedLanguage,
  selectedLevel,
  onSelect,
}: LanguageBarProps) {
  return (
    <section className="pb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Start here
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">Choose one language.</h2>
          <p className="mt-1 text-sm leading-5 text-notebook">
            Stay with one language for a short practice round.
          </p>
        </div>

        <span className="rounded-full bg-paper/78 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-notebook">
          A1 ready
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {options.map((option) => {
          const active = option.id === selectedLanguage

          return (
            <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`rounded-[18px] px-4 py-3 text-sm font-bold transition ${
                  active
                    ? `${option.accentClass} text-white`
                    : 'bg-paper/78 text-ink hover:bg-paper/92'
                }`}
              >
                {option.label}
              </button>
          )
        })}
      </div>

      <div className="mt-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-notebook">
              Levels
            </p>
            <p className="mt-1 text-sm text-notebook">More levels are coming soon.</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {levelOptions.map((level) => {
            const active = level === selectedLevel

            return (
              <button
                key={level}
                type="button"
                disabled={!active}
                className={`rounded-[16px] px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? 'bg-ink text-white'
                    : 'bg-paper/72 text-notebook'
                }`}
              >
                {level}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
