export function Header() {
  return (
    <header className="px-1 py-1 sm:px-2">
      <div className="max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-notebook">
          LingoGarden
        </p>
        <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-[0.94] text-ink sm:text-[2.6rem]">
          German study, one small session at a time
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-notebook sm:text-[0.98rem]">
          A simple personal space for A1, A2, and B1 vocabulary, quick reminders, writing,
          and short quizzes.
        </p>
      </div>
    </header>
  )
}
