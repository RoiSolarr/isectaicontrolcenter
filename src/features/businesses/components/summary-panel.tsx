import { ActivityTimestamp } from '@/features/overview/components/activity-timestamp'
import { ACTIVITY_ICONS, FALLBACK_ACTIVITY_ICON } from '@/features/overview/constants'
import type { BusinessSummary } from '@/features/businesses/server/get-business-profile'
import { formatNumber } from '@/lib/format/numbers'

/** "Records by status" bars + this business's latest activity events. */
export function SummaryPanel({ summary, recordLabel }: { summary: BusinessSummary; recordLabel: string }) {
  const max = Math.max(1, ...summary.statusCounts.map((item) => item.count))
  const total = summary.statusCounts.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section aria-labelledby="status-heading">
        <h3 id="status-heading" className="font-display text-lg font-bold tracking-tight">
          {recordLabel} by status
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{formatNumber(total)} records in total</p>
        <ul className="mt-4 space-y-3">
          {summary.statusCounts.map((item) => (
            <li key={item.status}>
              <div className="flex items-center justify-between text-sm">
                <span>{item.status}</span>
                <span className="font-semibold tabular-nums">{formatNumber(item.count)}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-teal-500" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="activity-heading">
        <h3 id="activity-heading" className="font-display text-lg font-bold tracking-tight">
          Recent activity
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Latest events for this business</p>
        {summary.recentActivity.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {summary.recentActivity.map((event) => {
              const Icon = ACTIVITY_ICONS[event.eventType] ?? FALLBACK_ACTIVITY_ICON
              return (
                <li key={event.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold">{event.title}</p>
                    {event.detail ? <p className="truncate text-xs text-muted-foreground">{event.detail}</p> : null}
                    <p className="mt-0.5 text-xs text-muted-foreground/80">
                      <ActivityTimestamp iso={event.createdAt} />
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}