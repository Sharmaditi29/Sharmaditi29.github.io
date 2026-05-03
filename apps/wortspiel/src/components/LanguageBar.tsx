import type { LanguageOption, LearningLanguage } from '../types'

interface LanguageBarProps {
  options: LanguageOption[]
  selectedLanguage: LearningLanguage
  onSelect: (language: LearningLanguage) => void
}

export function LanguageBar({ options, selectedLanguage, onSelect }: LanguageBarProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
            Language
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-ink">Choose what to learn.</h2>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-3">
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
