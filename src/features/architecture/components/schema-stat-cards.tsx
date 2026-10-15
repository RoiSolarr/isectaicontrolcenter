import * as React from 'react'
import { Boxes, Database, KeyRound, Rows3, type LucideIcon } from 'lucide-react'
import { SCHEMA_COUNT, SCHEMA_GROUPS, TABLE_COUNT, TENANT_TABLE_COUNT, VIEW_COUNT } from '@/features/architecture/content/schema-tables'
import type { TableCounts } from '@/features/architecture/types'
import { formatNumber } from '@/lib/format/numbers'

type StatCardProps = {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  footer: React.ReactNode
}

/** Same look as the Overview KPI cards. */
function StatCard({ label, value, icon: Icon, footer }: StatCardProps) {
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

/** Four headline numbers for the Database view. The row total is read live; the rest comes from the schema documentation. */
export function SchemaStatCards({ counts }: { counts: TableCounts | null }) {
  const known = counts ? Object.values(counts).filter((value): value is number => value !== null) : []
  const totalRows = known.reduce((sum, value) => sum + value, 0)

  return (
    <section aria-label="Schema figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Schemas" value={formatNumber(SCHEMA_COUNT)} icon={Boxes} footer={SCHEMA_GROUPS.map((group) => group.schema).join(' · ')} />
      <StatCard
        label="Tables"
        value={formatNumber(TABLE_COUNT)}
        icon={Database}
        footer={VIEW_COUNT > 0 ? `Plus ${formatNumber(VIEW_COUNT)} summary ${VIEW_COUNT === 1 ? 'view' : 'views'}` : 'No views'}
      />
      <StatCard
        label="Tenant-owned tables"
        value={
          <>
            {formatNumber(TENANT_TABLE_COUNT)}
            <span className="ml-1.5 text-lg font-bold text-muted-foreground">/ {formatNumber(TABLE_COUNT)}</span>
          </>
        }
        icon={KeyRound}
        footer="Carry business_id on every row"
      />
      <StatCard
        label="Rows you can see"
        value={known.length > 0 ? formatNumber(totalRows) : '—'}
        icon={Rows3}
        footer={known.length > 0 ? 'Counted live · Row Level Security applies' : 'Live count unavailable'}
      />
    </section>
  )
}