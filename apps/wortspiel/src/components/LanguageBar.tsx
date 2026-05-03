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
    <section className="rounded-[24px] bg-cream/40 p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Learn
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">Pick a language.</h2>
        </div>

        <span className="rounded-full bg-mint/45 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
          A1 live
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
                  ? `${option.accentClass} text-white shadow-soft`
                  : 'border border-line bg-paper/80 text-ink hover:-translate-y-0.5 hover:bg-paper'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 border-t border-line/70 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-notebook">
              Levels
            </p>
            <p className="mt-1 text-sm text-notebook">A2 to C2 are sprouting soon.</p>
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
                    ? 'bg-ink text-white shadow-soft'
                    : 'border border-dashed border-line bg-paper/70 text-notebook'
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
