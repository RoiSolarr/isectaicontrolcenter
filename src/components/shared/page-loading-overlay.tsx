'use client'

import * as React from 'react'

/**
 * Several overlays can briefly exist at the same time (e.g. the click-time overlay handing over to
 * the route's loading.tsx overlay), so the scroll/keyboard lock is reference-counted.
 */
let lockCount = 0
let previousHtmlOverflow = ''

function blockKeys(event: KeyboardEvent) {
  // Stops keyboard users from tabbing to, or "clicking", a link behind the overlay.
  if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
  }
}

function acquireLock() {
  if (lockCount === 0) {
    previousHtmlOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', blockKeys, true)
  }
  lockCount += 1
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.documentElement.style.overflow = previousHtmlOverflow
    window.removeEventListener('keydown', blockKeys, true)
  }
}

/**
 * Full-screen loading layer shown while the user moves between pages.
 * It sits above the sidebar and top bar, so nothing can be clicked, scrolled or tabbed to until it unmounts.
 *
 * `!m-0` is deliberate: the route loading.tsx files render this inside a `space-y-*` wrapper, whose
 * `> * ~ *` rule adds a top margin to every later sibling. On a `fixed inset-0` element that margin pushes
 * the overlay down and leaves an uncovered strip at the top of the screen.
 */
export function PageLoadingOverlay({ label = 'Loading page…' }: { label?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    acquireLock()
    // Pull focus off the link that was just clicked.
    ref.current?.focus({ preventScroll: true })
    return releaseLock
  }, [])

  return (
    <div
      ref={ref}
      tabIndex={-1}
      aria-busy="true"
      aria-live="polite"
      className="!m-0 fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-brand-navy-900/40 outline-none backdrop-blur-[2px]"
    >
      <div className="flex min-w-[220px] flex-col items-center gap-4 rounded-2xl bg-card px-10 py-8 shadow-xl ring-1 ring-border">
        <span aria-hidden className="relative block h-12 w-12">
          <span className="absolute inset-0 rounded-full border-4 border-brand-teal-400/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-teal-400" />
        </span>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">Please wait…</p>
        </div>
      </div>
    </div>
  )
}