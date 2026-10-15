import { BRIEF_QUESTIONS } from '@/features/architecture/constants'

/** Quick links to the answers for each question in the trial brief. */
export function BriefJumpLinks() {
  return (
    <nav aria-label="Questions from the trial brief" className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Jump to</span>
      <ul className="flex flex-wrap gap-2">
        {BRIEF_QUESTIONS.map((question) => (
          <li key={question.id}>
            <a
              href={`#${question.id}`}
              className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {question.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}