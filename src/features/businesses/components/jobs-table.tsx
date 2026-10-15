import { Badge } from '@/components/ui/badge'
import type { JobListItem } from '@/features/businesses/types'
import { JOB_STATUS_META } from '@/features/businesses/utils/record-status'
import { dayHint, formatZonedDate, formatZonedTime } from '@/features/businesses/utils/time-zone'

const HEAD_CELL = 'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'

/** Field-service jobs. Dates and times are shown in the company's own time zone. */
export function JobsTable({ rows, timeZone }: { rows: JobListItem[]; timeZone: string }) {
  const now = new Date()

  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">Service jobs for this business</caption>
        <thead>
          <tr>
            <th scope="col" className={HEAD_CELL}>
              Customer &amp; service address
            </th>
            <th scope="col" className={HEAD_CELL}>
              Service type
            </th>
            <th scope="col" className={HEAD_CELL}>
              Technician
            </th>
            <th scope="col" className={HEAD_CELL}>
              Scheduled
            </th>
            <th scope="col" className={HEAD_CELL}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = JOB_STATUS_META[row.status]
            const hint = dayHint(row.scheduledAt, now, timeZone)

            return (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-3">
                  <p className="font-semibold">{row.customerName}</p>
                  <p className="text-xs text-muted-foreground">{row.serviceAddress}</p>
                </td>
                <td className="px-3 py-3">{row.serviceType}</td>
                <td className="px-3 py-3">{row.technicianName ?? <span className="text-muted-foreground">Unassigned</span>}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {formatZonedDate(row.scheduledAt, timeZone)} · {formatZonedTime(row.scheduledAt, timeZone)}
                  {hint ? (
                    <Badge variant="brand" className="ml-2">
                      {hint}
                    </Badge>
                  ) : null}
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
  )
}