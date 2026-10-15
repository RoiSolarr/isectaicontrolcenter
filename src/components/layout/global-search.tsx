import { Search } from 'lucide-react'
import { isRouteAvailable } from '@/lib/constants/navigation'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Top-bar search. Submits to the Businesses directory (/businesses?q=...).
 * Disabled until that page exists, so it never sends people to a 404.
 */
export function GlobalSearch() {
  const enabled = isRouteAvailable(ROUTES.businesses)

  return (
    <form action={ROUTES.businesses} method="get" role="search" className="relative w-full">
      <label htmlFor="global-search" className="sr-only">
        Search businesses and records
      </label>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id="global-search"
        name="q"
        type="search"
        autoComplete="off"
        disabled={!enabled}
        placeholder={enabled ? 'Search businesses, records…' : 'Search (available soon)'}
        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  )
}