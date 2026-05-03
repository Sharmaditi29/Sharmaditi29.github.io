import type { LanguageOption, LearningLanguage } from '../types'

interface LanguageBarProps {
  options: LanguageOption[]
  selectedLanguage: LearningLanguage
  onSelect: (language: LearningLanguage) => void
}

export function LanguageBar({ options, selectedLanguage, onSelect }: LanguageBarProps) {
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
          A1 only
        </span>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
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
    </section>
  )
}
