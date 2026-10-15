import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { Pagination } from '@/components/shared/pagination'
import { AppointmentsTable } from '@/features/businesses/components/appointments-table'
import { JobsTable } from '@/features/businesses/components/jobs-table'
import { RecordsToolbar } from '@/features/businesses/components/records-toolbar'
import type { BusinessProfile, RecordFilters, RecordsPage } from '@/features/businesses/types'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { timeZoneAbbreviation } from '@/features/businesses/utils/time-zone'
import { ROUTES } from '@/lib/constants/routes'
import { formatNumber } from '@/lib/format/numbers'

type RecordsPanelProps = { business: BusinessProfile; records: RecordsPage; filters: RecordFilters }

/** The business-specific records tab: appointments for clinics, service jobs for field-service companies. */
export function RecordsPanel({ business, records, filters }: RecordsPanelProps) {
  const basePath = `${ROUTES.businesses}/${business.id}`
  const isFiltered = Boolean(filters.q || filters.status || filters.when !== 'all')
  const exportHref = `${basePath}/export${buildQueryString({ q: filters.q, when: filters.when, status: filters.status }, { when: 'all' })}`
  const hrefFor = (page: number) => `${basePath}${buildQueryString({ ...filters, page }, { page: 1, when: 'all' })}`
  const noun = business.industry.recordType === 'appointment' ? 'appointments' : 'jobs'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight">
            {business.industry.recordLabel}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              · {formatNumber(records.total)} {isFiltered ? 'matching' : 'total'}
            </span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {business.industry.recordType === 'appointment' ? 'Patient appointments' : 'Work orders and dispatch schedule'} for this business only.{' '}
            <span className="font-semibold text-emerald-700">All rows scoped to this tenant.</span> Times shown in {timeZoneAbbreviation(business.timezone)}.
          </p>
        </div>
        <RecordsToolbar filters={filters} recordType={business.industry.recordType} exportHref={exportHref} />
      </div>

      {records.rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="font-semibold">{isFiltered ? `No ${noun} match these filters` : `No ${noun} yet`}</p>
          {isFiltered ? (
            <Link href={basePath} scroll={false} className="text-sm font-semibold text-primary hover:underline">
              Clear filters
            </Link>
          ) : null}
        </div>
      ) : records.kind === 'appointment' ? (
        <AppointmentsTable rows={records.rows} timeZone={business.timezone} />
      ) : (
        <JobsTable rows={records.rows} timeZone={business.timezone} />
      )}

      <Pagination page={records.page} pageCount={records.pageCount} total={records.total} pageSize={records.pageSize} noun={noun} hrefFor={hrefFor} />
      <p className="text-xs text-muted-foreground">Sample records are fictional and for design demonstration only.</p>
    </div>
  )
}