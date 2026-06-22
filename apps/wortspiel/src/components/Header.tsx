export function Header() {
  return (
    <header className="px-2 py-2 sm:px-3 xl:px-4">
      <div className="max-w-4xl min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-notebook">
          WortSpiel
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-extrabold leading-[0.95] text-ink sm:text-[2.8rem]">
          Learn German with a clearer path
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-notebook sm:text-[0.98rem]">
          Choose your language, pick a level, and decide how you want to study:
          vocabulary, grammar, or quiz practice. This version is focused on German
          so the journey feels more structured from the start.
        </p>
      </div>
    </header>
  )
}
