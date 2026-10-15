import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BusinessAvatar } from '@/components/shared/business-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActivityFilters, ActivitySummary } from '@/features/activity/types'
import { buildActivityHref } from '@/features/activity/utils/build-href'
import { describeRange } from '@/features/activity/utils/range'
import { ROUTES } from '@/lib/constants/routes'
import { formatNumber } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

type TopBusinessesCardProps = {
  summary: ActivitySummary
  filters: ActivityFilters
  className?: string
}

/** "Most active businesses". Clicking a name filters the event log below to that business (click again to clear). */
export function TopBusinessesCard({ summary, filters, className }: TopBusinessesCardProps) {
  const max = Math.max(1, ...summary.byBusiness.map((item) => item.count))

  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Most active businesses</CardTitle>
          <CardDescription>Events {describeRange(filters.range)}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {summary.byBusiness.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No events in this period.</p>
        ) : (
          <ul className="space-y-4">
            {summary.byBusiness.map((item) => {
              const isSelected = filters.business === item.id
              const filterHref = `${buildActivityHref(filters, { business: isSelected ? '' : item.id, page: 1 })}#event-log`

              return (
                <li key={item.id} className={cn('rounded-lg', isSelected && 'bg-accent/60 p-2 -m-2')}>
                  <div className="flex items-center gap-3">
                    <BusinessAvatar recordType={item.recordType} className="h-9 w-9" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link
                          href={filterHref}
                          aria-current={isSelected ? 'true' : undefined}
                          title={isSelected ? 'Show all businesses again' : `Show only ${item.name}`}
                          className="truncate text-sm font-semibold hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {item.name}
                        </Link>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{formatNumber(item.count)}</span>
                      </div>
                      <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-brand-teal-500" style={{ width: `${(item.count / max) * 100}%` }} />
                      </div>
                    </div>
                    <Link
                      href={`${ROUTES.businesses}/${item.id}`}
                      aria-label={`Open ${item.name} profile`}
                      title="Open business profile"
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}