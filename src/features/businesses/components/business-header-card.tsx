import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BusinessAvatar } from '@/components/shared/business-avatar'
import type { BusinessProfile } from '@/features/businesses/types'
import { STATUS_META } from '@/features/overview/utils/health'
import { formatNumber } from '@/lib/format/numbers'

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-5 first:pl-0 last:pr-0 sm:px-7">
      <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight">{formatNumber(value)}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

/** Name, industry, tenant id, badges and the three headline numbers. */
export function BusinessHeaderCard({ business }: { business: BusinessProfile }) {
  const status = STATUS_META[business.status]

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <BusinessAvatar recordType={business.industry.recordType} className="h-14 w-14 rounded-xl" />
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-bold tracking-tight">{business.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {business.industry.label} · {business.city}, {business.state} · Tenant ID{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{business.tenantCode}</code>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={status.badge} dot>
                {status.label}
              </Badge>
              <Badge variant="info" className="capitalize">
                {business.plan} plan
              </Badge>
              <Badge variant="brand">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Data isolated
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 divide-x divide-border">
          <Stat value={business.stats.records30d} label="Records · 30 days" />
          <Stat value={business.stats.openRecords} label="Open records" />
          <Stat value={business.stats.staffCount} label="Staff members" />
        </div>
      </CardContent>
    </Card>
  )
}