interface HeaderProps {
  onStart: () => void
  sessionStarted: boolean
}

export function Header({ onStart, sessionStarted }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-line bg-paper/95 px-5 py-5 shadow-card sm:px-6 sm:py-5">
      <div className="absolute inset-x-0 top-0 h-20 bg-splash opacity-[0.05]" />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-bubble/25 blur-3xl" />
      <div className="absolute -left-3 bottom-0 h-20 w-20 rounded-full bg-sun/25 blur-3xl" />
      <div className="absolute right-1/4 top-5 h-14 w-14 rounded-full bg-mint/25 blur-2xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
            LingoGarden
          </p>
          <h1 className="max-w-3xl text-balance font-display text-3xl font-extrabold leading-[0.98] text-ink sm:text-[3.85rem]">
            One playful desk for German, Finnish, and Dutch.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-notebook sm:text-base">
            Pick a language, revise one idea, then practice one card at a time.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center rounded-full bg-splash px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blush"
          >
            {sessionStarted ? 'Keep practicing' : 'Start practicing'}
          </button>
        </div>
      </div>
    </header>
  )
}
