interface HeaderProps {
  onStart: () => void
  sessionStarted: boolean
}

export function Header({ onStart, sessionStarted }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-line bg-paper/95 px-5 py-6 shadow-card sm:px-7 sm:py-7">
      <div className="absolute inset-x-0 top-0 h-24 bg-splash opacity-[0.06]" />
      <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-bubble/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-sun/30 blur-3xl" />
      <div className="absolute right-1/3 top-6 h-16 w-16 rounded-full bg-mint/30 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
            WortSpiel
          </p>
          <h1 className="max-w-2xl text-balance font-display text-4xl font-extrabold leading-[0.98] text-ink sm:text-[3.35rem]">
            Learn, revise, play.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-notebook sm:text-base">
            A bright little desk for German and Finnish practice.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center rounded-full bg-splash px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blush"
          >
            {sessionStarted ? 'Keep going' : 'Start A1'}
          </button>
        </div>
      </div>
    </header>
  )
}
