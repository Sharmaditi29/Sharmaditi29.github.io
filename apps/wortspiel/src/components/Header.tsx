export function Header() {
  return (
    <header className="rounded-[28px] border border-line/90 bg-paper/94 px-6 py-5 sm:px-7 sm:py-5 xl:px-8">
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
