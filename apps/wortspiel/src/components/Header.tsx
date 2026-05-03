interface HeaderProps {
  onStart: () => void
  sessionStarted: boolean
}

export function Header({ onStart, sessionStarted }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[30px] border border-line bg-paper/95 px-5 py-4 shadow-card sm:px-6 xl:py-4">
      <div className="absolute inset-x-0 top-0 h-16 bg-splash opacity-[0.04]" />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-bubble/22 blur-3xl" />
      <div className="absolute -left-2 bottom-0 h-16 w-16 rounded-full bg-sun/20 blur-3xl" />
      <div className="absolute right-1/4 top-4 h-12 w-12 rounded-full bg-mint/20 blur-2xl" />

      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
            LingoGarden
          </p>
          <h1 className="max-w-4xl text-balance font-display text-[2.35rem] font-extrabold leading-[0.94] text-ink sm:text-[2.8rem] xl:text-[3rem]">
            Three beginner decks, one playful desk.
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-notebook sm:text-[0.95rem]">
            German, Finnish, and Dutch practice in one place, with quick revision and one-card study.
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
