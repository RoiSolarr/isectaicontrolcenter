import type { RecordsPage } from '@/features/businesses/types'
import { formatZonedDate, formatZonedTime } from '@/features/businesses/utils/time-zone'

/** Escapes one CSV cell. Cells starting with = + - @ get a leading apostrophe so spreadsheets never run them as formulas. */
function cell(value: string | null): string {
  const text = value ?? ''
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

function toLine(cells: (string | null)[]): string {
  return cells.map(cell).join(',')
}

/** CSV text for a page of records, with dates and times in the business's own time zone. */
export function recordsToCsv(records: RecordsPage, timeZone: string): string {
  const lines: string[] = []

  if (records.kind === 'appointment') {
    lines.push(toLine(['Patient', 'Visit type', 'Provider', 'Location', 'Date', 'Time', 'Status']))
    for (const row of records.rows) {
      lines.push(
        toLine([
          row.customerName,
          row.visitType,
          row.providerName,
          row.locationName,
          formatZonedDate(row.startsAt, timeZone),
          formatZonedTime(row.startsAt, timeZone),
          row.status,
        ]),
      )
    }
  } else {
    lines.push(toLine(['Customer', 'Service type', 'Service address', 'Technician', 'Location', 'Date', 'Time', 'Status']))
    for (const row of records.rows) {
      lines.push(
        toLine([
          row.customerName,
          row.serviceType,
          row.serviceAddress,
          row.technicianName,
          row.locationName,
          formatZonedDate(row.scheduledAt, timeZone),
          formatZonedTime(row.scheduledAt, timeZone),
          row.status,
        ]),
      )
    }
  }

  return `\uFEFF${lines.join('\r\n')}\r\n`
}