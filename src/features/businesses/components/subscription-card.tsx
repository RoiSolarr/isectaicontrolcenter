import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BusinessProfile } from '@/features/businesses/types'
import { HEALTH_META } from '@/features/overview/utils/health'
import { formatNumber, formatPercent } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{children}</dd>
    </div>
  )
}

/** Plan, isolation model, customer count, storage and uptime. */
export function SubscriptionCard({ business }: { business: BusinessProfile }) {
  const health = HEALTH_META[business.health]
  const storageRatio = business.storageLimitGb > 0 ? Math.min(business.storageUsedGb / business.storageLimitGb, 1) : 0
  const storagePercent = Math.round(storageRatio * 100)
  const storageBar = storageRatio >= 0.9 ? 'bg-red-500' : storageRatio >= 0.75 ? 'bg-amber-500' : 'bg-brand-teal-500'

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Tenant &amp; subscription</CardTitle>
        <Badge variant={health.badge}>{health.label}</Badge>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Row label="Platform plan">
              <span className="capitalize">{business.plan}</span>
            </Row>
            <Row label="Uptime">{formatPercent(business.uptimePct)}</Row>
          </div>
          <Row label="Tenant data scope">Business ID + row-level security</Row>
          <Row label="Customer records">
            {formatNumber(business.stats.customerCount)} <span className="font-normal text-muted-foreground">· fictional sample set</span>
          </Row>
          <div>
            <dt className="text-xs text-muted-foreground">Storage usage</dt>
            <dd className="mt-1.5">
              <div
                role="progressbar"
                aria-label="Storage used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={storagePercent}
                className="h-1.5 overflow-hidden rounded-full bg-secondary"
              >
                <div className={cn('h-full rounded-full', storageBar)} style={{ width: `${storagePercent}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {business.storageUsedGb} GB of {business.storageLimitGb} GB used
              </p>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}