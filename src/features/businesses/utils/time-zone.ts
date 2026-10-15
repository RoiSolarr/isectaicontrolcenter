/** Falls back to UTC if the stored time zone name is not valid, so a bad row can never crash the page. */
export function safeTimeZone(timeZone: string): string {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone })
    return timeZone
  } catch {
    return 'UTC'
  }
}

type LocalParts = { year: number; month: number; day: number }

function localParts(date: Date, timeZone: string): LocalParts {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: read('year'), month: read('month'), day: read('day') }
}

/** How far `timeZone` is ahead of UTC at the given instant, in milliseconds. */
function offsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const asUtc = Date.UTC(read('year'), read('month') - 1, read('day'), read('hour'), read('minute'), read('second'))
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/** The UTC instant at which a calendar day starts in `timeZone` (two passes handle daylight-saving changes). */
function startOfZonedDay(year: number, month: number, day: number, timeZone: string): Date {
  const guess = Date.UTC(year, month - 1, day)
  const firstPass = guess - offsetMs(new Date(guess), timeZone)
  return new Date(guess - offsetMs(new Date(firstPass), timeZone))
}

/** [start, end) of "today" in the business's own time zone, as UTC instants. */
export function zonedDayRange(now: Date, timeZone: string): { start: Date; end: Date } {
  const zone = safeTimeZone(timeZone)
  const { year, month, day } = localParts(now, zone)
  return {
    start: startOfZonedDay(year, month, day, zone),
    end: startOfZonedDay(year, month, day + 1, zone),
  }
}

/** "Oct 15, 2026" in the business's time zone. */
export function formatZonedDate(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString('en-US', { timeZone: safeTimeZone(timeZone), month: 'short', day: 'numeric', year: 'numeric' })
}

/** "10:30 AM" in the business's time zone. */
export function formatZonedTime(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { timeZone: safeTimeZone(timeZone), hour: 'numeric', minute: '2-digit' })
}

/** "CDT" / "MDT" for a time zone at the given moment. */
export function timeZoneAbbreviation(timeZone: string, now: Date = new Date()): string {
  const zone = safeTimeZone(timeZone)
  const part = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')
  return part?.value ?? zone
}

/** "Today" / "Tomorrow" / null, judged in the business's time zone. */
export function dayHint(iso: string, now: Date, timeZone: string): 'Today' | 'Tomorrow' | null {
  const { start, end } = zonedDayRange(now, timeZone)
  const time = new Date(iso).getTime()
  if (time >= start.getTime() && time < end.getTime()) return 'Today'
  const nextEnd = zonedDayRange(new Date(end.getTime() + 60_000), timeZone).end
  if (time >= end.getTime() && time < nextEnd.getTime()) return 'Tomorrow'
  return null
}