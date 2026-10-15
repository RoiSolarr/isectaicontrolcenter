import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RangeSelect } from '@/features/overview/components/range-select'
import { CHART_SERIES } from '@/features/overview/constants'
import type { DailyActivityPoint, OverviewRange } from '@/features/overview/types'
import { niceAxisMax, shouldShowLabel } from '@/features/overview/utils/chart-axis'
import { formatNumber } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

const TICK_COUNT = 4

type PlatformActivityChartProps = {
  series: DailyActivityPoint[]
  range: OverviewRange
  className?: string
}

/**
 * Grouped bar chart built with plain divs (no chart library needed).
 * Records created per day: appointments, jobs, new customers.
 */
export function PlatformActivityChart({ series, range, className }: PlatformActivityChartProps) {
  const maxValue = Math.max(0, ...series.flatMap((point) => CHART_SERIES.map((item) => point[item.key])))
  const axisMax = niceAxisMax(maxValue, TICK_COUNT)
  const tickValues = Array.from({ length: TICK_COUNT + 1 }, (_, index) => (axisMax / TICK_COUNT) * index)
  const isEmpty = maxValue === 0

  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Platform activity</CardTitle>
          <CardDescription>Records created across all businesses · last {range} days (UTC)</CardDescription>
        </div>
        <RangeSelect value={range} />
      </CardHeader>

      <CardContent>
        {/* Visual chart (hidden from screen readers; the table below carries the same data). */}
        <div aria-hidden className="pt-3">
          <div className="relative h-64">
            {/* Y axis labels + grid lines, positioned by value so they line up exactly */}
            {tickValues.map((tick) => {
              const top = `${100 - (tick / axisMax) * 100}%`
              return (
                <div key={tick}>
                  <span
                    className="absolute left-0 w-8 -translate-y-1/2 text-right text-[11px] leading-none text-muted-foreground"
                    style={{ top }}
                  >
                    {formatNumber(tick)}
                  </span>
                  <div className="absolute left-10 right-0 border-t border-border" style={{ top }} />
                </div>
              )
            })}

            {/* Bars */}
            <div className="absolute inset-y-0 left-10 right-0 flex items-end gap-1 sm:gap-2">
              {series.map((point) => (
                <div
                  key={point.date}
                  title={`${point.label}: ${CHART_SERIES.map((item) => `${formatNumber(point[item.key])} ${item.label.toLowerCase()}`).join(' · ')}`}
                  className="flex h-full flex-1 items-end justify-center gap-[2px] rounded-t-md px-0.5 transition-colors hover:bg-muted/70 sm:gap-1"
                >
                  {CHART_SERIES.map((item) => {
                    const value = point[item.key]
                    return (
                      <div
                        key={item.key}
                        className={cn('w-full max-w-[18px] rounded-t-[3px]', item.swatch)}
                        style={{ height: `${(value / axisMax) * 100}%`, minHeight: value > 0 ? 3 : 0 }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            {isEmpty ? (
              <p className="absolute inset-y-0 left-10 right-0 flex items-center justify-center text-sm text-muted-foreground">
                No records were created in this period.
              </p>
            ) : null}
          </div>

          {/* X axis labels */}
          <div className="mt-3 flex gap-1 pl-10 sm:gap-2">
            {series.map((point, index) => (
              <span key={point.date} className="flex-1 whitespace-nowrap text-center text-[11px] text-muted-foreground">
                {shouldShowLabel(index, series.length) ? point.label : ''}
              </span>
            ))}
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {CHART_SERIES.map((item) => (
            <li key={item.key} className="flex items-center gap-2">
              <span aria-hidden className={cn('h-2.5 w-2.5 rounded-sm', item.swatch)} />
              {item.label}
            </li>
          ))}
        </ul>

        <table className="sr-only">
          <caption>Records created per day, last {range} days</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              {CHART_SERIES.map((item) => (
                <th key={item.key} scope="col">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((point) => (
              <tr key={point.date}>
                <th scope="row">{point.label}</th>
                {CHART_SERIES.map((item) => (
                  <td key={item.key}>{point[item.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}