interface HeaderProps {
  onStart: () => void
  sessionStarted: boolean
}

export function Header({ onStart, sessionStarted }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[36px] border border-line bg-paper/95 px-6 py-8 shadow-card sm:px-10 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-28 bg-splash opacity-[0.08]" />
      <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-bubble/35 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sun/35 blur-3xl" />
      <div className="absolute left-1/3 top-8 h-24 w-24 rounded-full bg-mint/30 blur-3xl" />
      <div className="absolute bottom-6 right-1/4 h-16 w-16 rounded-full bg-apricot/25 blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:gap-7">
        <div className="min-w-0">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.28em] text-notebook">
            WortSpiel
          </p>
          <h1 className="max-w-2xl text-balance font-display text-[2.7rem] font-extrabold leading-[0.95] text-ink sm:text-5xl sm:leading-tight">
            Learn playful words, then revise fast.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-notebook sm:text-lg">
            Flashcards, quick concepts, and a bigger A1 word bank for steady practice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center rounded-full bg-splash px-6 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blush"
          >
            {sessionStarted ? 'Keep going' : 'Start A1'}
          </button>
          <span className="rounded-full bg-mint/40 px-4 py-2 text-sm font-bold text-ink">
            German plus Finnish starter
          </span>
        </div>
      </div>
    </header>
  )
}
