import Link from 'next/link'
import { RelativeTime } from '@/features/activity/components/relative-time'
import type { ActivityEventItem } from '@/features/activity/types'
import { getEventMeta } from '@/features/activity/utils/event-types'
import { ROUTES } from '@/lib/constants/routes'
import { formatClockTime } from '@/lib/format/dates'
import { cn } from '@/lib/utils'

type ActivityEventRowProps = {
  event: ActivityEventItem
  /** Show the clock time ("9:02 AM"). Only true after mount, because it depends on the viewer's time zone. */
  showClock: boolean
  /** Last row of its day group: no connector line below the icon. */
  isLast: boolean
}

/** One event in the log: coloured icon on a timeline line, title, business, detail and time. */
export function ActivityEventRow({ event, showClock, isLast }: ActivityEventRowProps) {
  const meta = getEventMeta(event.eventType)
  const Icon = meta.icon

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {isLast ? null : <span aria-hidden className="absolute bottom-0 left-4 top-9 w-px -translate-x-1/2 bg-border" />}

      <span aria-hidden className={cn('relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full', meta.tone)}>
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              {event.businessName ? (
                <Link href={`${ROUTES.businesses}/${event.businessId}`} className="font-medium text-foreground/80 hover:text-primary hover:underline">
                  {event.businessName}
                </Link>
              ) : (
                <span>Unknown business</span>
              )}
              <span aria-hidden>·</span>
              <span>{meta.label}</span>
            </p>
          </div>

          <p className="shrink-0 text-xs text-muted-foreground sm:text-right">
            {showClock ? <span className="mr-2 font-medium text-foreground/80 sm:mr-0 sm:block">{formatClockTime(new Date(event.createdAt))}</span> : null}
            <RelativeTime iso={event.createdAt} />
          </p>
        </div>

        {event.detail ? <p className="mt-1.5 text-sm text-muted-foreground">{event.detail}</p> : null}
      </div>
    </li>
  )
}