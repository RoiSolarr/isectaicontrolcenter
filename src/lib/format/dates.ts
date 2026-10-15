const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Formats a Postgres `date` ("2026-05-22") as "May 22, 2026".
 * Parsed by hand so the result never shifts by a day because of the viewer's time zone.
 */
export function formatDateOnly(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

/** Local-time long date, e.g. "Thursday, October 15, 2026". Call in the browser so it uses the viewer's time zone. */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/** Local-time clock, e.g. "9:02 AM". */
export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** "Just now", "18 min ago", "5 hr ago", "2 days ago". Independent of time zone. */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000)
  if (seconds < 45) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDateOnly(iso)
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** "Today, 9:02 AM" / "Yesterday, 4:18 PM" / "Oct 13, 4:18 PM" in the viewer's local time. */
export function formatEventTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const clock = formatClockTime(date)
  if (isSameLocalDay(date, now)) return `Today, ${clock}`
  if (isSameLocalDay(date, yesterday)) return `Yesterday, ${clock}`
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${clock}`
}

/** Time-of-day greeting for a local hour (0-23). */
export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** "2026-10-15" for the given instant, in UTC. */
export function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** First day of the calendar quarter containing `now`, as "YYYY-MM-DD" (UTC). */
export function startOfQuarterUtc(now: Date): string {
  const firstMonth = Math.floor(now.getUTCMonth() / 3) * 3
  return `${now.getUTCFullYear()}-${String(firstMonth + 1).padStart(2, '0')}-01`
}

/** Short label for a UTC date key: "Thu 9". */
export function formatDayLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00Z`)
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()}`
}