interface HeaderProps {
  onStart: () => void
  sessionStarted: boolean
}

export function Header({ onStart, sessionStarted }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-line bg-paper/95 px-6 py-8 shadow-card sm:px-10 sm:py-12">
      <div className="absolute inset-x-0 top-0 h-32 bg-notebook opacity-[0.06]" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sun/35 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blush/20 blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="min-w-0">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.28em] text-notebook">
            WortSpiel
          </p>
          <h1 className="max-w-2xl text-balance font-display text-[2.7rem] font-extrabold leading-[0.95] text-ink sm:text-5xl sm:leading-tight">
            Learn German one playful card at a time.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-notebook sm:text-lg sm:leading-8">
            Build a steady A1 habit with friendly flashcards, simple quizzes, and
            sentence prompts that make your German feel active instead of passive.
          </p>
        </div>

        <div className="min-w-0 rounded-[28px] border border-line bg-notebook/5 p-5 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">
                Daily rhythm
              </p>
              <p className="mt-2 text-lg font-bold text-ink">5 words</p>
              <p className="text-sm text-notebook">Small, steady, realistic.</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-notebook">
                Practice modes
              </p>
              <p className="mt-2 text-lg font-bold text-ink">Cards + quiz</p>
              <p className="text-sm text-notebook">Review, write, and recall.</p>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={onStart}
                className="w-full rounded-full bg-sun px-5 py-3 text-sm font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-apricot"
              >
                {sessionStarted ? 'Keep practicing' : 'Start A1 session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
