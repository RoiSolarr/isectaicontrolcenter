import { Badge } from '@/components/ui/badge'
import type { AppointmentListItem } from '@/features/businesses/types'
import { APPOINTMENT_STATUS_META } from '@/features/businesses/utils/record-status'
import { dayHint, formatZonedDate, formatZonedTime } from '@/features/businesses/utils/time-zone'

const HEAD_CELL = 'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'

/** Clinic appointments. Dates and times are shown in the clinic's own time zone. */
export function AppointmentsTable({ rows, timeZone }: { rows: AppointmentListItem[]; timeZone: string }) {
  const now = new Date()

  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">Appointments for this business</caption>
        <thead>
          <tr>
            <th scope="col" className={HEAD_CELL}>
              Patient &amp; visit
            </th>
            <th scope="col" className={HEAD_CELL}>
              Provider
            </th>
            <th scope="col" className={HEAD_CELL}>
              Date &amp; time
            </th>
            <th scope="col" className={HEAD_CELL}>
              Location
            </th>
            <th scope="col" className={HEAD_CELL}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = APPOINTMENT_STATUS_META[row.status]
            const hint = dayHint(row.startsAt, now, timeZone)

            return (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-3">
                  <p className="font-semibold">{row.customerName}</p>
                  <p className="text-xs text-muted-foreground">{row.visitType}</p>
                </td>
                <td className="px-3 py-3">{row.providerName ?? <span className="text-muted-foreground">Unassigned</span>}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {formatZonedDate(row.startsAt, timeZone)} · {formatZonedTime(row.startsAt, timeZone)}
                  {hint ? (
                    <Badge variant="brand" className="ml-2">
                      {hint}
                    </Badge>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{row.locationName ?? '—'}</td>
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