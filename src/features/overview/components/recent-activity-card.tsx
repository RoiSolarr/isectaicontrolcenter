import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RouteLink } from '@/components/shared/route-link'
import { ActivityTimestamp } from '@/features/overview/components/activity-timestamp'
import { ACTIVITY_ICONS, FALLBACK_ACTIVITY_ICON } from '@/features/overview/constants'
import type { OverviewActivityEvent } from '@/features/overview/types'
import { ROUTES } from '@/lib/constants/routes'

export function RecentActivityCard({ events, className }: { events: OverviewActivityEvent[]; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest events from every business</CardDescription>
        </div>
        <RouteLink href={ROUTES.activity} className="text-sm font-semibold text-primary hover:underline">
          Full activity log →
        </RouteLink>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((event) => {
              const Icon = ACTIVITY_ICONS[event.eventType] ?? FALLBACK_ACTIVITY_ICON

              return (
                <li key={event.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p>
                      <span className="font-semibold">{event.title}</span>
                      {event.businessName ? <span className="text-muted-foreground"> · {event.businessName}</span> : null}
                    </p>
                    {event.detail ? <p className="truncate text-xs text-muted-foreground">{event.detail}</p> : null}
                    <p className="mt-0.5 text-xs text-muted-foreground/80">
                      <ActivityTimestamp iso={event.createdAt} />
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}