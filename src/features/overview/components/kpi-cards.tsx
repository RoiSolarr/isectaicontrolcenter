import * as React from 'react'
import { ArrowDownRight, ArrowUpRight, Building2, CalendarCheck, CheckCircle2, ClipboardList, Minus, type LucideIcon } from 'lucide-react'
import type { OverviewKpis } from '@/features/overview/types'
import { formatDateOnly } from '@/lib/format/dates'
import { formatNumber, formatPercent } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

type KpiCardProps = {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  footer: React.ReactNode
}

function KpiCard({ label, value, icon: Icon, footer }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{footer}</p>
    </div>
  )
}

/** Up / down / flat indicator for the 30-day record trend. */
function Trend({ changePct }: { changePct: number | null }) {
  if (changePct === null) return <span>No earlier period to compare</span>

  const direction = changePct > 0.05 ? 'up' : changePct < -0.05 ? 'down' : 'flat'
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus
  const readable = direction === 'flat' ? 'No change' : `${direction === 'up' ? 'Up' : 'Down'} ${formatPercent(changePct)}`

  return (
    <span
      title="Compared with the previous 30 days"
      className={cn(
        'inline-flex items-center gap-0.5 font-semibold',
        direction === 'up' && 'text-emerald-700',
        direction === 'down' && 'text-red-700',
        direction === 'flat' && 'text-muted-foreground',
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span aria-hidden>{direction === 'flat' ? '0%' : formatPercent(changePct)}</span>
      <span className="sr-only">{readable} compared with the previous 30 days</span>
    </span>
  )
}

/** The four headline numbers at the top of the Overview page. */
export function KpiCards({ kpis }: { kpis: OverviewKpis }) {
  const allOperational = kpis.needAttention === 0

  return (
    <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total businesses"
        value={formatNumber(kpis.totalBusinesses)}
        icon={Building2}
        footer={
          kpis.addedThisQuarter > 0 ? (
            <span className="font-semibold text-emerald-700">↑ {formatNumber(kpis.addedThisQuarter)} added this quarter</span>
          ) : kpis.latestJoinedAt ? (
            `Latest joined ${formatDateOnly(kpis.latestJoinedAt)}`
          ) : (
            'No businesses yet'
          )
        }
      />
      <KpiCard
        label="Appointments & jobs · all time"
        value={formatNumber(kpis.recordsAllTime)}
        icon={CalendarCheck}
        footer={
          <>
            <span className="font-semibold text-foreground">{formatNumber(kpis.records30d)}</span> in the last 30 days ·{' '}
            <Trend changePct={kpis.changePct} />
          </>
        }
      />
      <KpiCard
        label="Open records"
        value={formatNumber(kpis.openRecords)}
        icon={ClipboardList}
        footer="Across appointments and field jobs"
      />
      <KpiCard
        label="Active businesses"
        value={
          <>
            {formatNumber(kpis.activeBusinesses)}
            <span className="ml-1.5 text-lg font-bold text-muted-foreground">/ {formatNumber(kpis.totalBusinesses)}</span>
          </>
        }
        icon={CheckCircle2}
        footer={
          allOperational ? (
            'All systems operational'
          ) : (
            <span className="font-semibold text-amber-700">
              {formatNumber(kpis.needAttention)} {kpis.needAttention === 1 ? 'business needs' : 'businesses need'} attention
            </span>
          )
        }
      />
    </section>
  )
}