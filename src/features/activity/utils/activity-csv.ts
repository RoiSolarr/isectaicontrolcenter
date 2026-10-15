import type { ActivityEventItem } from '@/features/activity/types'
import { getEventMeta } from '@/features/activity/utils/event-types'

/** Same rules as the business records export: cells starting with = + - @ get a leading apostrophe so spreadsheets never run them as formulas. */
function cell(value: string | null): string {
  const text = value ?? ''
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

function toLine(cells: (string | null)[]): string {
  return cells.map(cell).join(',')
}

/** "2026-10-15 09:02:11" in UTC. Exports use UTC so the file means the same thing for everyone who opens it. */
function formatUtc(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 19)
}

/** CSV text for a list of activity events. */
export function activityToCsv(events: ActivityEventItem[]): string {
  const lines = [toLine(['Time (UTC)', 'Business', 'Event type', 'Title', 'Detail'])]

  for (const event of events) {
    lines.push(toLine([formatUtc(event.createdAt), event.businessName, getEventMeta(event.eventType).label, event.title, event.detail]))
  }

  return `\uFEFF${lines.join('\r\n')}\r\n`
}