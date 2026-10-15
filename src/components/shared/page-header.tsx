import * as React from 'react'

type PageHeaderProps = {
  /** Small uppercase label above the title (e.g. a date or section name). */
  eyebrow?: React.ReactNode
  title: string
  description?: React.ReactNode
  /** Buttons / controls aligned to the right of the title. */
  actions?: React.ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  )
}