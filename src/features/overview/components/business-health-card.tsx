import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RouteLink } from '@/components/shared/route-link'
import type { OverviewBusiness } from '@/features/overview/types'
import { HEALTH_META } from '@/features/overview/utils/health'
import { ROUTES } from '@/lib/constants/routes'
import { formatPercent } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

export function BusinessHealthCard({ businesses, className }: { businesses: OverviewBusiness[]; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Business health</CardTitle>
          <CardDescription>Current platform status · lowest uptime first</CardDescription>
        </div>
        <RouteLink href={ROUTES.businesses} className="text-sm font-semibold text-primary hover:underline">
          View all →
        </RouteLink>
      </CardHeader>

      <CardContent>
        {businesses.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No businesses on the platform yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {businesses.map((business) => {
              const meta = HEALTH_META[business.health]
              const uptime = Math.min(Math.max(business.uptimePct, 0), 100)

              return (
                <li key={business.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold">{business.name}</p>
                    <Badge variant={meta.badge}>{meta.label}</Badge>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${business.name} uptime`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={uptime}
                    className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary"
                  >
                    <div className={cn('h-full rounded-full', meta.bar)} style={{ width: `${uptime}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="truncate">{business.industryLabel}</span>
                    <span className="shrink-0">{formatPercent(uptime)} uptime</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <p className="mt-5 rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Uptime comes from each business’s stored health metric (sample data). In production it would be fed by sync and monitoring jobs.
        </p>
      </CardContent>
    </Card>
  )
}