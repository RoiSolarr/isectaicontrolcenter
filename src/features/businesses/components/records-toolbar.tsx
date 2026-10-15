'use client'

import * as React from 'react'
import { Download, Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { APPOINTMENT_STATUS_OPTIONS, JOB_STATUS_OPTIONS, WHEN_OPTIONS } from '@/features/businesses/constants'
import type { RecordFilters } from '@/features/businesses/types'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { sanitizeSearchTerm } from '@/features/businesses/utils/search-term'
import type { RecordType } from '@/types/database'
import { cn } from '@/lib/utils'

type RecordsToolbarProps = {
  filters: RecordFilters
  recordType: RecordType
  /** URL of the CSV export for the current filters. */
  exportHref: string
}

/** Search, date and status filters above the records table, plus the CSV export button. */
export function RecordsToolbar({ filters, recordType, exportHref }: RecordsToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()
  const [search, setSearch] = React.useState(filters.q)
  const statusOptions = recordType === 'appointment' ? APPOINTMENT_STATUS_OPTIONS : JOB_STATUS_OPTIONS

  const navigate = React.useCallback(
    (next: Partial<Pick<RecordFilters, 'q' | 'when' | 'status'>>) => {
      const merged = { q: filters.q, when: filters.when, status: filters.status, ...next }
      startTransition(() => router.replace(`${pathname}${buildQueryString(merged, { when: 'all' })}`, { scroll: false }))
    },
    [filters.q, filters.when, filters.status, pathname, router],
  )

  React.useEffect(() => {
    if (sanitizeSearchTerm(search) === filters.q) return
    const timer = setTimeout(() => navigate({ q: search }), 300)
    return () => clearTimeout(timer)
  }, [search, filters.q, navigate])

  return (
    <form
      role="search"
      aria-label="Filter records"
      aria-busy={isPending}
      onSubmit={(event) => {
        event.preventDefault()
        navigate({ q: search })
      }}
      className={cn('flex flex-wrap items-center gap-3', isPending && 'opacity-70')}
    >
      <div className="relative min-w-[200px] flex-1 sm:flex-none sm:basis-56">
        <label htmlFor="records-search" className="sr-only">
          Search records
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="records-search"
          type="search"
          autoComplete="off"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search records"
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <NativeSelect
        id="records-when"
        label="Filter by date"
        wrapperClassName="w-36"
        value={filters.when}
        onChange={(event) => navigate({ when: event.target.value as RecordFilters['when'] })}
      >
        {WHEN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect
        id="records-status"
        label="Filter by status"
        wrapperClassName="w-40"
        value={filters.status}
        onChange={(event) => navigate({ status: event.target.value })}
      >
        <option value="">Any status</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <a href={exportHref} download className={buttonVariants({ variant: 'outline' })}>
        <Download className="h-4 w-4" aria-hidden />
        Export CSV
      </a>
    </form>
  )
}