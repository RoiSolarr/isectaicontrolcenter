'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { NativeSelect } from '@/components/ui/native-select'
import { PLAN_OPTIONS, STATUS_OPTIONS } from '@/features/businesses/constants'
import type { DirectoryFilters, IndustryOption } from '@/features/businesses/types'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { sanitizeSearchTerm } from '@/features/businesses/utils/search-term'
import { cn } from '@/lib/utils'

type DirectoryFilterBarProps = { filters: DirectoryFilters; industries: IndustryOption[] }

/** Search + industry / status / plan filters. The choices live in the URL (?q=…&status=…), so results can be shared and bookmarked. */
export function DirectoryFilterBar({ filters, industries }: DirectoryFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()
  const [search, setSearch] = React.useState(filters.q)

  const navigate = React.useCallback(
    (next: Partial<Pick<DirectoryFilters, 'q' | 'industry' | 'status' | 'plan'>>) => {
      const merged = { q: filters.q, industry: filters.industry, status: filters.status, plan: filters.plan, ...next }
      startTransition(() => router.replace(`${pathname}${buildQueryString(merged)}`, { scroll: false }))
    },
    [filters.q, filters.industry, filters.status, filters.plan, pathname, router],
  )

  // Wait 300 ms after the last keystroke before searching.
  React.useEffect(() => {
    if (sanitizeSearchTerm(search) === filters.q) return
    const timer = setTimeout(() => navigate({ q: search }), 300)
    return () => clearTimeout(timer)
  }, [search, filters.q, navigate])

  const hasFilters = Boolean(filters.q || filters.industry || filters.status || filters.plan || search)

  return (
    <form
      role="search"
      aria-label="Filter businesses"
      onSubmit={(event) => {
        event.preventDefault()
        navigate({ q: search })
      }}
      className={cn('grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]', isPending && 'opacity-70')}
      aria-busy={isPending}
    >
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label htmlFor="directory-search" className="sr-only">
          Search business name or city
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="directory-search"
          type="search"
          autoComplete="off"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search business name or city"
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <NativeSelect id="filter-industry" label="Filter by industry" value={filters.industry} onChange={(event) => navigate({ industry: event.target.value })}>
        <option value="">All industries</option>
        {industries.map((industry) => (
          <option key={industry.id} value={industry.id}>
            {industry.label}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect
        id="filter-status"
        label="Filter by status"
        value={filters.status}
        onChange={(event) => navigate({ status: event.target.value as DirectoryFilters['status'] })}
      >
        <option value="">Any status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect id="filter-plan" label="Filter by plan" value={filters.plan} onChange={(event) => navigate({ plan: event.target.value as DirectoryFilters['plan'] })}>
        <option value="">All plans</option>
        {PLAN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <button
        type="button"
        disabled={!hasFilters}
        onClick={() => {
          setSearch('')
          startTransition(() => router.replace(pathname, { scroll: false }))
        }}
        className="justify-self-start px-1 text-sm font-semibold text-primary hover:underline disabled:cursor-default disabled:text-muted-foreground/60 disabled:no-underline lg:justify-self-end"
      >
        Reset filters
      </button>
    </form>
  )
}