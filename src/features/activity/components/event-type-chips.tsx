import { SectionLoadingLink } from '@/components/shared/section-loading'
import type { ActivityFilters, ActivityTypeCount } from '@/features/activity/types'
import { buildActivityHref } from '@/features/activity/utils/build-href'
import { getEventMeta } from '@/features/activity/utils/event-types'
import { formatNumber } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

type EventTypeChipsProps = {
  filters: ActivityFilters
  byType: ActivityTypeCount[]
  /** Events of every type in the chosen range + business. */
  total: number
}

/**
 * One chip per event type that exists in the data, with how many events each has.
 * Each chip is a real link (?type=job_completed), so it works without JavaScript and can be shared.
 * Counts ignore the search box, so they are hidden while a search is active instead of showing numbers that do not add up.
 */
export function EventTypeChips({ filters, byType, total }: EventTypeChipsProps) {
  const showCounts = !filters.q
  // Keep the chip of the selected type visible even if the chosen range has none of that type.
  const types = filters.type && !byType.some((item) => item.type === filters.type) ? [...byType, { type: filters.type, count: 0 }] : byType

  const chips = [
    { type: '', label: 'All events', count: total, icon: null },
    ...types.map((item) => {
      const meta = getEventMeta(item.type)
      return { type: item.type, label: meta.label, count: item.count, icon: meta.icon }
    }),
  ]

  return (
    <nav aria-label="Filter by event type">
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {chips.map((chip) => {
          const isActive = chip.type === filters.type
          const Icon = chip.icon

          return (
            <li key={chip.type || 'all'} className="shrink-0">
              <SectionLoadingLink
                href={buildActivityHref(filters, { type: chip.type, page: 1 })}
                scroll={false}
                loadingLabel={`Loading ${chip.label}…`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent',
                )}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
                {chip.label}
                {showCounts ? (
                  <span className={cn('text-xs font-semibold tabular-nums', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {formatNumber(chip.count)}
                  </span>
                ) : null}
              </SectionLoadingLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}