import * as React from 'react'
import { Activity, Building2, Clock, type LucideIcon } from 'lucide-react'
import { RelativeTime } from '@/features/activity/components/relative-time'
import type { ActivityRange, ActivitySummary } from '@/features/activity/types'
import { getEventMeta } from '@/features/activity/utils/event-types'
import { describeRange } from '@/features/activity/utils/range'
import { formatNumber } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  footer: React.ReactNode
  /** Smaller type for text values such as "Appointment booked". */
  compactValue?: boolean
}

/** Same look as the Overview KPI cards. */
function StatCard({ label, value, icon: Icon, footer, compactValue = false }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={cn('mt-1 font-display font-extrabold tracking-tight', compactValue ? 'flex h-10 items-center text-2xl' : 'text-4xl')}>{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{footer}</p>
    </div>
  )
}

/** The four headline numbers at the top of the Activity page. They follow the Business and Range filters. */
export function ActivityStatCards({ summary, range }: { summary: ActivitySummary; range: ActivityRange }) {
  const topType = summary.byType[0]
  const TopIcon = topType ? getEventMeta(topType.type).icon : Activity
  const topShare = topType && summary.total > 0 ? Math.round((topType.count / summary.total) * 100) : 0

  return (
    <section aria-label="Activity figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Events logged"
        value={`${formatNumber(summary.total)}${summary.truncated ? '+' : ''}`}
        icon={Activity}
        footer={
          summary.truncated ? (
            <span className="font-semibold text-amber-700">Counting the newest {formatNumber(summary.total)} only</span>
          ) : (
            describeRange(range)
          )
        }
      />
      <StatCard
        label="Businesses reporting"
        value={
          <>
            {formatNumber(summary.activeBusinesses)}
            <span className="ml-1.5 text-lg font-bold text-muted-foreground">/ {formatNumber(summary.totalBusinesses)}</span>
          </>
        }
        icon={Building2}
        footer="With at least one event"
      />
      <StatCard
        compactValue
        label="Most common event"
        value={topType ? getEventMeta(topType.type).label : '—'}
        icon={TopIcon}
        footer={
          topType ? (
            <>
              <span className="font-semibold text-foreground">{formatNumber(topType.count)}</span> events · {topShare}% of the log
            </>
          ) : (
            'No events yet'
          )
        }
      />
      <StatCard
        compactValue
        label="Latest event"
        value={summary.latestAt ? <RelativeTime iso={summary.latestAt} /> : '—'}
        icon={Clock}
        footer={summary.latestAt ? 'Newest entry in the log' : 'No events yet'}
      />
    </section>
  )
}