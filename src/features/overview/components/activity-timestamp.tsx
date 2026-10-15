'use client'

import * as React from 'react'
import { formatEventTime, formatRelativeTime } from '@/lib/format/dates'

/**
 * "Today, 9:02 AM · 18 min ago". Server HTML only contains the time-zone-free part ("18 min ago");
 * the clock part is added in the browser so it matches the viewer's time zone.
 */
export function ActivityTimestamp({ iso }: { iso: string }) {
  const [label, setLabel] = React.useState<string | null>(null)

  React.useEffect(() => {
    const now = new Date()
    setLabel(`${formatEventTime(iso, now)} · ${formatRelativeTime(iso, now)}`)
  }, [iso])

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {label ?? formatRelativeTime(iso)}
    </time>
  )
}