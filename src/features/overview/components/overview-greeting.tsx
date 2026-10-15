'use client'

import { formatLongDate, greetingForHour } from '@/lib/format/dates'
import { useClientNow } from '@/lib/hooks/use-client-now'

/** "Thursday, October 15, 2026" in the viewer's time zone (neutral "Today" until the browser takes over). */
export function TodayEyebrow() {
  const now = useClientNow()
  return <>{now ? formatLongDate(now) : 'Today'}</>
}

/** "Good morning, Alex. Here's the cross-business snapshot for today." */
export function GreetingLine({ firstName }: { firstName: string }) {
  const now = useClientNow()
  const greeting = now ? greetingForHour(now.getHours()) : 'Welcome back'

  return (
    <>
      {greeting}, {firstName}. Here’s the cross-business snapshot for today.
    </>
  )
}