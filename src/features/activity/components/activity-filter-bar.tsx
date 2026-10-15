'use client'

import * as React from 'react'
import { Download, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { RANGE_OPTIONS } from '@/features/activity/constants'
import type { ActivityFilters, BusinessOption } from '@/features/activity/types'
import { buildActivityHref } from '@/features/activity/utils/build-href'
import { hasActiveFilters } from '@/features/activity/utils/parse-filters'
import { sanitizeSearchTerm } from '@/features/businesses/utils/search-term'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

type ActivityFilterBarProps = {
  filters: ActivityFilters
  businesses: BusinessOption[]
  /** URL of the CSV download for the current filters. */
  exportHref: string
}

/**
 * Search + business + date-range filters above the log, plus the CSV export button.
 * The event-type filter is the row of chips below this bar. Every choice lives in the URL, so a view can be bookmarked or shared.
 */
export function ActivityFilterBar({ filters, businesses, exportHref }: ActivityFilterBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [search, setSearch] = React.useState(filters.q)

  // Changing any filter goes back to page 1.
  const navigate = React.useCallback(
    (next: Partial<Pick<ActivityFilters, 'q' | 'business' | 'range'>>) => {
      startTransition(() => router.replace(buildActivityHref(filters, { ...next, page: 1 }), { scroll: false }))
    },
    [filters, router],
  )

  // Wait 300 ms after the last keystroke before searching.
  React.useEffect(() => {
    if (sanitizeSearchTerm(search) === filters.q) return
    const timer = setTimeout(() => navigate({ q: search }), 300)
    return () => clearTimeout(timer)
  }, [search, filters.q, navigate])

  return (
    <form
      role="search"
      aria-label="Filter activity"
      aria-busy={isPending}
      onSubmit={(event) => {
        event.preventDefault()
        navigate({ q: search })
      }}
      className={cn('grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))_auto]', isPending && 'opacity-70')}
    >
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label htmlFor="activity-search" className="sr-only">
          Search events or business names
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="activity-search"
          type="search"
          autoComplete="off"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events or businesses"
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <NativeSelect id="activity-business" label="Filter by business" value={filters.business} onChange={(event) => navigate({ business: event.target.value })}>
        <option value="">All businesses</option>
        {businesses.map((business) => (
          <option key={business.id} value={business.id}>
            {business.name}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect
        id="activity-range"
        label="Filter by date range"
        value={filters.range}
        onChange={(event) => navigate({ range: event.target.value as ActivityFilters['range'] })}
      >
        {RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1 lg:justify-end">
        <button
          type="button"
          disabled={!hasActiveFilters(filters) && !search}
          onClick={() => {
            setSearch('')
            startTransition(() => router.replace(ROUTES.activity, { scroll: false }))
          }}
          className="px-1 text-sm font-semibold text-primary hover:underline disabled:cursor-default disabled:text-muted-foreground/60 disabled:no-underline"
        >
          Reset filters
        </button>
        <a href={exportHref} download className={buttonVariants({ variant: 'outline' })}>
          <Download className="h-4 w-4" aria-hidden />
          Export CSV
        </a>
      </div>
    </form>
  )
}