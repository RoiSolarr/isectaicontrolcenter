'use client'

import * as React from 'react'
import { formatRelativeTime } from '@/lib/format/dates'

/**
 * "18 min ago" that keeps itself up to date every 30 seconds.
 * The server's clock and the viewer's clock differ by a few seconds, so the text is allowed to change right after hydration.
 */
export function RelativeTime({ iso }: { iso: string }) {
  const [text, setText] = React.useState(() => formatRelativeTime(iso))

  React.useEffect(() => {
    const update = () => setText(formatRelativeTime(iso))
    update()
    const timer = setInterval(update, 30_000)
    return () => clearInterval(timer)
  }, [iso])

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  )
}