import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BusinessAvatar } from '@/components/shared/business-avatar'
import type { DirectoryRow } from '@/features/businesses/types'
import { STATUS_META } from '@/features/overview/utils/health'
import { ROUTES } from '@/lib/constants/routes'
import { formatDateOnly } from '@/lib/format/dates'
import { formatNumber } from '@/lib/format/numbers'

const HEAD_CELL = 'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'

type DirectoryTableProps = {
  rows: DirectoryRow[]
  /** True when the empty result is caused by filters (not by an empty platform). */
  isFiltered: boolean
  resetHref: string
}

export function DirectoryTable({ rows, isFiltered, resetHref }: DirectoryTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-center">
        <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </span>
        <p className="font-semibold">{isFiltered ? 'No businesses match these filters' : 'No businesses on the platform yet'}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isFiltered ? 'Try a different search term or clear a filter.' : 'Businesses will appear here as soon as they are added to the platform.'}
        </p>
        {isFiltered ? (
          <Link href={resetHref} className="mt-1 text-sm font-semibold text-primary hover:underline">
            Reset filters
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className={HEAD_CELL}>
              Business
            </th>
            <th scope="col" className={HEAD_CELL}>
              Industry
            </th>
            <th scope="col" className={HEAD_CELL}>
              Location
            </th>
            <th scope="col" className={HEAD_CELL}>
              Joined
            </th>
            <th scope="col" className={HEAD_CELL}>
              Plan
            </th>
            <th scope="col" className={HEAD_CELL}>
              Records · 30d
            </th>
            <th scope="col" className={HEAD_CELL}>
              Status
            </th>
            <th scope="col" className={`${HEAD_CELL} text-right`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((business) => {
            const status = STATUS_META[business.status]
            const href = `${ROUTES.businesses}/${business.id}`

            return (
              <tr key={business.id} className="border-t border-border transition-colors hover:bg-muted/50">
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <BusinessAvatar recordType={business.recordType} />
                    <div className="min-w-0">
                      <Link href={href} className="block truncate font-semibold hover:text-primary hover:underline">
                        {business.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{business.legalName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-muted-foreground">{business.industryLabel}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">
                  {business.city}, {business.state}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{formatDateOnly(business.joinedAt)}</td>
                <td className="px-3 py-3.5">
                  <Badge variant="info" className="capitalize">
                    {business.plan}
                  </Badge>
                </td>
                <td className="px-3 py-3.5 font-semibold tabular-nums">{formatNumber(business.records30d)}</td>
                <td className="px-3 py-3.5">
                  <Badge variant={status.badge} dot>
                    {status.label}
                  </Badge>
                </td>
                <td className="px-3 py-3.5 text-right">
                  <Link
                    href={href}
                    aria-label={`View ${business.name}`}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}