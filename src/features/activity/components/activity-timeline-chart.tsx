import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActivitySummary } from '@/features/activity/types'
import { niceAxisMax, shouldShowLabel } from '@/features/overview/utils/chart-axis'
import { formatNumber } from '@/lib/format/numbers'

const TICK_COUNT = 4

/**
 * Events per day, drawn with plain divs (no chart library), in the same style as the Overview chart.
 * Days are UTC calendar days, like everywhere else in the dashboard.
 */
export function ActivityTimelineChart({ summary, className }: { summary: ActivitySummary; className?: string }) {
  const { daily } = summary
  const maxValue = Math.max(0, ...daily.map((point) => point.count))
  const axisMax = niceAxisMax(maxValue, TICK_COUNT)
  const tickValues = Array.from({ length: TICK_COUNT + 1 }, (_, index) => (axisMax / TICK_COUNT) * index)
  const total = daily.reduce((sum, point) => sum + point.count, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Events per day</CardTitle>
          <CardDescription>
            {formatNumber(total)} {total === 1 ? 'event' : 'events'} · last {summary.chartDays} days (UTC)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Visual chart (hidden from screen readers; the table below carries the same data). */}
        <div aria-hidden className="pt-3">
          <div className="relative h-56">
            {tickValues.map((tick) => {
              const top = `${100 - (tick / axisMax) * 100}%`
              return (
                <div key={tick}>
                  <span className="absolute left-0 w-8 -translate-y-1/2 text-right text-[11px] leading-none text-muted-foreground" style={{ top }}>
                    {formatNumber(tick)}
                  </span>
                  <div className="absolute left-10 right-0 border-t border-border" style={{ top }} />
                </div>
              )
            })}

            <div className="absolute inset-y-0 left-10 right-0 flex items-end gap-[3px] sm:gap-1">
              {daily.map((point) => (
                <div
                  key={point.date}
                  title={`${point.label}: ${formatNumber(point.count)} ${point.count === 1 ? 'event' : 'events'}`}
                  className="flex h-full flex-1 items-end justify-center rounded-t-md transition-colors hover:bg-muted/70"
                >
                  <div
                    className="w-full max-w-[28px] rounded-t-[3px] bg-brand-teal-500"
                    style={{ height: `${(point.count / axisMax) * 100}%`, minHeight: point.count > 0 ? 3 : 0 }}
                  />
                </div>
              ))}
            </div>

            {maxValue === 0 ? (
              <p className="absolute inset-y-0 left-10 right-0 flex items-center justify-center text-sm text-muted-foreground">
                No events were logged in this period.
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex gap-[3px] pl-10 sm:gap-1">
            {daily.map((point, index) => (
              <span key={point.date} className="flex-1 whitespace-nowrap text-center text-[11px] text-muted-foreground">
                {shouldShowLabel(index, daily.length) ? point.label : ''}
              </span>
            ))}
          </div>
        </div>

        <table className="sr-only">
          <caption>Events per day, last {summary.chartDays} days</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Events</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((point) => (
              <tr key={point.date}>
                <th scope="row">{point.label}</th>
                <td>{point.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}