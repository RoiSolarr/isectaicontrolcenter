import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionLoadingLink } from '@/components/shared/section-loading'
import { cn } from '@/lib/utils'

type PaginationProps = {
  page: number
  pageCount: number
  total: number
  pageSize: number
  /** Plural noun for the "Showing 1–10 of 42 ___" text. */
  noun: string
  /** Builds the URL of a page, keeping the other filters. */
  hrefFor: (page: number) => string
}

// Page links are SectionLoadingLinks: inside a SectionLoadingProvider (business records, activity log) a click shows the
// loading card, locks the page and keeps the scroll position. Elsewhere (businesses list) they behave like normal links.

/** 1 … 4 5 6 … 12 — always includes the first, last and current page. */
function getPageItems(page: number, pageCount: number): (number | 'gap')[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1])
  const pages = [...wanted].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b)

  const items: (number | 'gap')[] = []
  pages.forEach((value, index) => {
    if (index > 0 && value - pages[index - 1] > 1) items.push('gap')
    items.push(value)
  })
  return items
}

const CELL = 'flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-colors'

export function Pagination({ page, pageCount, total, pageSize, noun, hrefFor }: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {total === 0 ? `No ${noun}` : `Showing ${first}–${last} of ${total} ${noun}`}
      </p>

      {pageCount > 1 ? (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          {page > 1 ? (
            <SectionLoadingLink href={hrefFor(page - 1)} aria-label="Previous page" scroll={false} className={cn(CELL, 'border-border bg-card hover:bg-accent')}>
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </SectionLoadingLink>
          ) : (
            <span aria-hidden className={cn(CELL, 'border-border bg-card opacity-40')}>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          {getPageItems(page, pageCount).map((item, index) =>
            item === 'gap' ? (
              <span key={`gap-${index}`} aria-hidden className="px-1 text-muted-foreground">
                …
              </span>
            ) : (
              <SectionLoadingLink
                key={item}
                href={hrefFor(item)}
                scroll={false}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(CELL, item === page ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent')}
              >
                {item}
              </SectionLoadingLink>
            ),
          )}

          {page < pageCount ? (
            <SectionLoadingLink href={hrefFor(page + 1)} aria-label="Next page" scroll={false} className={cn(CELL, 'border-border bg-card hover:bg-accent')}>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </SectionLoadingLink>
          ) : (
            <span aria-hidden className={cn(CELL, 'border-border bg-card opacity-40')}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      ) : null}
    </div>
  )
}