'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'
import { findNavItem, isRouteAvailable } from '@/lib/constants/navigation'

/** If a navigation never finishes (offline, cancelled, ...), unlock the screen after this long. */
const MAX_LOCK_MS = 20_000

function trimTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/**
 * Locks the whole screen from the moment a link to ANOTHER page is clicked until that page's
 * loading screen takes over (each route's loading.tsx renders the same overlay, so the lock
 * continues until the real page content is ready).
 *
 * Links that only change the query string (filters, tabs, pagination), downloads, external links,
 * and ctrl/cmd/shift-clicks are ignored.
 */
export function NavigationLock() {
  const pathname = usePathname()
  const [pendingLabel, setPendingLabel] = React.useState<string | null>(null)

  // The new route has committed: its loading.tsx overlay takes over from here.
  React.useEffect(() => {
    setPendingLabel(null)
  }, [pathname])

  React.useEffect(() => {
    // Capture phase: runs before <Link> calls preventDefault() on the same click.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest('a')
      if (!anchor || !anchor.href) return
      if (anchor.hasAttribute('download') || anchor.getAttribute('aria-disabled') === 'true') return
      if (anchor.target && anchor.target !== '_self') return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return

      const target = trimTrailingSlash(url.pathname)
      if (target === trimTrailingSlash(window.location.pathname)) return
      if (target.endsWith('/export')) return // CSV download routes, not pages
      if (!isRouteAvailable(target)) return

      const item = findNavItem(target)
      setPendingLabel(item && item.href === target ? `Loading ${item.label}…` : 'Loading page…')
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  React.useEffect(() => {
    if (!pendingLabel) return
    const timer = window.setTimeout(() => setPendingLabel(null), MAX_LOCK_MS)
    return () => window.clearTimeout(timer)
  }, [pendingLabel])

  return pendingLabel ? <PageLoadingOverlay label={pendingLabel} /> : null
}