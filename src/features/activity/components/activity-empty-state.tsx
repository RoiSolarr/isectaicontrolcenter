import Link from 'next/link'
import { Inbox, SearchX } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

/** Shown instead of the log when there is nothing to list. `isFiltered` separates "nothing matches" from "nothing has happened yet". */
export function ActivityEmptyState({ isFiltered }: { isFiltered: boolean }) {
  const Icon = isFiltered ? SearchX : Inbox

  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <p className="font-semibold">{isFiltered ? 'No events match these filters' : 'No activity recorded yet'}</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {isFiltered
          ? 'Try a different search term, a wider date range, or clear a filter.'
          : 'Events such as new appointments, completed jobs and schedule syncs will appear here as soon as businesses start using the platform.'}
      </p>
      {isFiltered ? (
        <Link href={ROUTES.activity} className="mt-1 text-sm font-semibold text-primary hover:underline">
          Reset filters
        </Link>
      ) : null}
    </div>
  )
}