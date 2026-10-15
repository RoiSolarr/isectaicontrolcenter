import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessAvatar } from '@/components/shared/business-avatar'
import { RouteLink } from '@/components/shared/route-link'
import type { OverviewBusiness } from '@/features/overview/types'
import { STATUS_META } from '@/features/overview/utils/health'
import { ROUTES } from '@/lib/constants/routes'
import { formatDateOnly } from '@/lib/format/dates'
import { formatNumber } from '@/lib/format/numbers'

const HEAD_CELL = 'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'

type BusinessesTableProps = {
  businesses: OverviewBusiness[]
  totalBusinesses: number
  className?: string
}

export function BusinessesTable({ businesses, totalBusinesses, className }: BusinessesTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Businesses on the platform</CardTitle>
          <CardDescription>
            Showing {formatNumber(businesses.length)} of {formatNumber(totalBusinesses)} · oldest member first
          </CardDescription>
        </div>
        <RouteLink href={ROUTES.businesses} className="text-sm font-semibold text-primary hover:underline">
          Open business directory →
        </RouteLink>
      </CardHeader>

      <CardContent className="pt-3 sm:pt-4">
        {businesses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No businesses on the platform yet.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className={HEAD_CELL}>
                    Business
                  </th>
                  <th scope="col" className={HEAD_CELL}>
                    Industry
                  </th>
                  <th scope="col" className={HEAD_CELL}>
                    Records · 30d
                  </th>
                  <th scope="col" className={HEAD_CELL}>
                    Plan
                  </th>
                  <th scope="col" className={HEAD_CELL}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => {
                  const status = STATUS_META[business.status]

                  return (
                    <tr key={business.id} className="border-t border-border">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <BusinessAvatar recordType={business.recordType} />
                          <div className="min-w-0">
                            <RouteLink
                              href={`${ROUTES.businesses}/${business.id}`}
                              className="block truncate font-semibold hover:text-primary hover:underline"
                            >
                              {business.name}
                            </RouteLink>
                            <p className="truncate text-xs text-muted-foreground">
                              {business.city}, {business.state} · Joined {formatDateOnly(business.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{business.industryLabel}</td>
                      <td className="px-3 py-3 font-semibold tabular-nums">{formatNumber(business.records30d)}</td>
                      <td className="px-3 py-3">
                        <Badge variant="info" className="capitalize">
                          {business.plan}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={status.badge} dot>
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}