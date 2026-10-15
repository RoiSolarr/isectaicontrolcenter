'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { RANGE_OPTIONS } from '@/features/overview/constants'
import type { OverviewRange } from '@/features/overview/types'
import { cn } from '@/lib/utils'

/** "Last 7 / 14 / 30 days" selector. Stores the choice in the URL (?range=14) so the server re-fetches the chart. */
export function RangeSelect({ value }: { value: OverviewRange }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="relative">
      <label htmlFor="overview-range" className="sr-only">
        Chart time range
      </label>
      <select
        id="overview-range"
        value={value}
        aria-busy={isPending}
        onChange={(event) => {
          const next = event.target.value
          startTransition(() => router.replace(`${pathname}?range=${next}`, { scroll: false }))
        }}
        className={cn(
          'h-9 cursor-pointer appearance-none rounded-lg border border-border bg-card pl-3 pr-9 text-sm font-medium text-foreground shadow-sm transition-opacity',
          'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          isPending && 'opacity-60',
        )}
      >
        {RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}