interface StudyFooterProps {
  languageLabel: string
}

export function StudyFooter({ languageLabel }: StudyFooterProps) {
  return (
    <section className="rounded-[28px] border border-line bg-paper/92 p-4 shadow-card sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr_1fr]">
        <article className="rounded-[22px] bg-cream/55 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
            Learn in loops
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-ink">Small wins keep sticking.</h3>
          <p className="mt-2 text-sm leading-6 text-notebook">
            Start with one {languageLabel.toLowerCase()} card, write one line, then check yourself in
            the quiz. The point is rhythm, not rushing.
          </p>
        </article>

        <article className="rounded-[22px] bg-paper p-4 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
            Growing next
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-ink">A2 to C2 are on the way.</h3>
          <p className="mt-2 text-sm leading-6 text-notebook">
            Each next level will unlock longer sentences, richer vocabulary clusters, and stronger review
            trails.
          </p>
        </article>

        <article className="rounded-[22px] bg-bubble/10 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-notebook">
            Daily help
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-ink">Use revise before you freeze.</h3>
          <p className="mt-2 text-sm leading-6 text-notebook">
            Themes refresh your context, concepts steady the grammar, and the word bank helps when the
            right word slips away.
          </p>
        </article>
      </div>
    </section>
  )
}
