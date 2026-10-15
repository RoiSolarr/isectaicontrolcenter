'use client'

import * as React from 'react'
import { ActivityEventRow } from '@/features/activity/components/activity-event-row'
import type { ActivityEventItem } from '@/features/activity/types'
import { groupEventsByLocalDay } from '@/features/activity/utils/group-by-day'
import { useClientNow } from '@/lib/hooks/use-client-now'

/**
 * The event list, grouped by day ("Today", "Yesterday", "Tuesday, Oct 13").
 * Day boundaries depend on the viewer's time zone, which the server does not know,
 * so the page first renders one plain list and the day headings appear right after mount.
 */
export function ActivityFeed({ events }: { events: ActivityEventItem[] }) {
  const now = useClientNow()
  const groups = React.useMemo(() => groupEventsByLocalDay(events, now), [events, now])

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key} aria-label={group.label ?? 'Events'}>
          {group.label ? (
            <h3 className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{group.label}</span>
              <span aria-hidden className="h-px flex-1 bg-border" />
              <span className="font-medium normal-case tracking-normal">
                {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
              </span>
            </h3>
          ) : null}

          <ol>
            {group.events.map((event, index) => (
              <ActivityEventRow key={event.id} event={event} showClock={now !== null} isLast={index === group.events.length - 1} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}