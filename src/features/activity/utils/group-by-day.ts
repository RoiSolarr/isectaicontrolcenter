import type { ActivityEventItem } from '@/features/activity/types'

export type ActivityDayGroup = {
  key: string
  /** "Today", "Yesterday", "Tuesday, Oct 13". null = a single ungrouped list (before the browser clock is known). */
  label: string | null
  events: ActivityEventItem[]
}

function dayLabel(date: Date, now: Date, yesterday: Date): string {
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (sameDay(date, now)) return 'Today'
  if (sameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  })
}

/**
 * Splits newest-first events into one group per day in the VIEWER's time zone.
 * `now` is null on the server and during hydration (the server does not know the viewer's time zone),
 * so everything is returned as one group without a heading and the headings appear right after mount.
 */
export function groupEventsByLocalDay(events: ActivityEventItem[], now: Date | null): ActivityDayGroup[] {
  if (events.length === 0) return []
  if (!now) return [{ key: 'all', label: null, events }]

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const groups: ActivityDayGroup[] = []
  for (const event of events) {
    const date = new Date(event.createdAt)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    const last = groups.at(-1)

    if (last && last.key === key) last.events.push(event)
    else groups.push({ key, label: dayLabel(date, now, yesterday), events: [event] })
  }
  return groups
}