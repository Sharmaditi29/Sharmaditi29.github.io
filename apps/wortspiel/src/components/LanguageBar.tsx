import type { LanguageOption, LearningLanguage } from '../types'

interface LanguageBarProps {
  options: LanguageOption[]
  selectedLanguage: LearningLanguage
  onSelect: (language: LearningLanguage) => void
}

export function LanguageBar({ options, selectedLanguage, onSelect }: LanguageBarProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Learn
          </p>
          <h2 className="mt-1 font-display text-base font-bold text-ink">Pick a language.</h2>
        </div>

        <span className="rounded-full bg-mint/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
          A1 only
        </span>

        <div className="grid w-full gap-2 sm:grid-cols-3">
          {options.map((option) => {
            const active = option.id === selectedLanguage

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`rounded-[16px] px-3.5 py-2.5 text-sm font-bold transition ${
                  active
                    ? `${option.accentClass} text-white shadow-soft`
                    : 'border border-line bg-cream/60 text-ink hover:-translate-y-0.5 hover:bg-paper'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
