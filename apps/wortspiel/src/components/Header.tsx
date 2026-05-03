export function Header() {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-line bg-paper/95 px-6 py-5 shadow-card sm:px-7 sm:py-6 xl:px-8 xl:py-6">
      <div className="absolute inset-x-0 top-0 h-20 bg-splash opacity-[0.035]" />
      <div className="absolute -right-10 -top-8 h-28 w-28 rounded-full bg-bubble/20 blur-3xl" />
      <div className="absolute -left-3 bottom-0 h-20 w-20 rounded-full bg-sun/18 blur-3xl" />
      <div className="absolute right-1/3 top-6 h-14 w-14 rounded-full bg-mint/16 blur-2xl" />

      <div className="relative max-w-4xl">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.28em] text-notebook">
            LingoGarden
        </p>
        <h1 className="max-w-4xl text-balance font-display text-[2.2rem] font-extrabold leading-[0.96] text-ink sm:text-[2.65rem] xl:text-[2.9rem]">
          Learn gently, switch languages, keep the desk uncluttered.
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-notebook sm:text-[0.95rem]">
          Beginner practice for German, Finnish, and Dutch, with quick reminders close by and the main card work front and center.
        </p>
      </div>
    </header>
  )
}
