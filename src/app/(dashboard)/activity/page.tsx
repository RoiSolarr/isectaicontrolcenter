import type { Metadata } from 'next'
import { Pagination } from '@/components/shared/pagination'
import { PageHeader } from '@/components/shared/page-header'
import { SectionError } from '@/components/shared/section-error'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityEmptyState } from '@/features/activity/components/activity-empty-state'
import { ActivityFeed } from '@/features/activity/components/activity-feed'
import { ActivityFilterBar } from '@/features/activity/components/activity-filter-bar'
import { ActivityStatCards } from '@/features/activity/components/activity-stat-cards'
import { ActivityTimelineChart } from '@/features/activity/components/activity-timeline-chart'
import { EventTypeChips } from '@/features/activity/components/event-type-chips'
import { LiveToggle } from '@/features/activity/components/live-toggle'
import { TopBusinessesCard } from '@/features/activity/components/top-businesses-card'
import { getActivityData } from '@/features/activity/server/get-activity-data'
import { buildActivityHref } from '@/features/activity/utils/build-href'
import { hasActiveFilters, parseActivityFilters } from '@/features/activity/utils/parse-filters'
import { RefreshButton } from '@/features/overview/components/refresh-button'
import { ROUTES } from '@/lib/constants/routes'
import { formatNumber } from '@/lib/format/numbers'

export const metadata: Metadata = { title: 'Activity' }

type ActivityPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Wide card + narrow card, same proportions as the Overview page so the edges line up.
const TWO_COLUMN_ROW = 'grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  const filters = parseActivityFilters(await searchParams)
  const result = await getActivityData(filters)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit trail"
        title="Activity"
        description="Everything happening across every business on the platform, newest first."
        actions={
          result.ok ? (
            <>
              <LiveToggle />
              <RefreshButton updatedAt={result.data.generatedAt} />
            </>
          ) : undefined
        }
      />

      {!result.ok ? (
        <SectionError title="We couldn’t load the activity log." message={result.message} />
      ) : (
        <>
          <ActivityStatCards summary={result.data.summary} range={filters.range} />

          <div className={TWO_COLUMN_ROW}>
            <ActivityTimelineChart summary={result.data.summary} />
            <TopBusinessesCard summary={result.data.summary} filters={filters} />
          </div>

          <Card id="event-log" className="scroll-mt-24">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Event log
                  <Badge variant="neutral">
                    {formatNumber(result.data.total)} {hasActiveFilters(filters) ? 'matching' : 'total'}
                  </Badge>
                </CardTitle>
                <CardDescription>Every event is stored with the business it belongs to, so each one links back to its profile.</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <ActivityFilterBar
                filters={filters}
                businesses={result.data.businesses}
                exportHref={buildActivityHref(filters, { page: 1 }, `${ROUTES.activity}/export`)}
              />

              <EventTypeChips filters={filters} byType={result.data.summary.byType} total={result.data.summary.total} />

              {result.data.events.length === 0 ? <ActivityEmptyState isFiltered={hasActiveFilters(filters)} /> : <ActivityFeed events={result.data.events} />}

              <Pagination
                page={result.data.page}
                pageCount={result.data.pageCount}
                total={result.data.total}
                pageSize={result.data.pageSize}
                noun="events"
                hrefFor={(page) => buildActivityHref(filters, { page })}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}