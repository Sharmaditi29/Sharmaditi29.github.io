export function Header() {
  return (
    <header className="relative overflow-hidden rounded-[30px] border border-line bg-paper/95 px-6 py-5 shadow-card sm:px-7 sm:py-5 xl:px-8">
      <div className="absolute inset-x-0 top-0 h-16 bg-splash opacity-[0.03]" />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-bubble/16 blur-3xl" />
      <div className="absolute -left-3 bottom-0 h-16 w-16 rounded-full bg-sun/16 blur-3xl" />

      <div className="relative max-w-3xl min-w-0">
          <h1 className="font-display text-[1.9rem] font-extrabold leading-none text-ink sm:text-[2.2rem]">
            LingoGarden
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-notebook sm:text-[0.95rem]">
            Beginner practice for German, Finnish, Dutch, and Hindi, with quick reminders close by and the main card work front and center.
          </p>
      </div>
    </header>
  )
}
