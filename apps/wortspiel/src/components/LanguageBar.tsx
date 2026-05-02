import type { LanguageOption, LearningLanguage } from '../types'

interface LanguageBarProps {
  options: LanguageOption[]
  selectedLanguage: LearningLanguage
  onSelect: (language: LearningLanguage) => void
}

export function LanguageBar({ options, selectedLanguage, onSelect }: LanguageBarProps) {
  return (
    <section className="rounded-[28px] border border-line bg-paper/90 p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-notebook">
            Learn
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Choose a language.</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = option.id === selectedLanguage

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
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
