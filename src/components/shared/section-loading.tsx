'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type SectionLoadingContextValue = {
  isPending: boolean
  label: string
  navigate: (href: string, label: string) => void
}

const SectionLoadingContext = React.createContext<SectionLoadingContextValue | null>(null)

/**
 * Why this exists: a tab/chip lives in the URL (?tab=staff), so Next.js builds the page again on the server and
 * swaps the whole page in. The browser then lands back at the top, which feels like the entire screen refreshed.
 * So the scroll position is saved when a tab/chip is clicked and put back once the new content is on screen.
 *
 * It is a module-level variable (not React state) because the page, including the provider below, is replaced
 * by the new page, so React state would be lost at exactly the moment it is needed.
 */
let savedScroll: { y: number; path: string; time: number } | null = null

/** A saved position older than this is ignored (e.g. the navigation was cancelled). */
const SCROLL_MAX_AGE_MS = 30_000
/** How long (in frames, ~60 per second) to keep the position pinned while the new content finishes rendering. */
const SCROLL_PIN_FRAMES = 90

function restoreSavedScroll() {
  const saved = savedScroll
  savedScroll = null
  if (!saved || saved.path !== window.location.pathname || Date.now() - saved.time > SCROLL_MAX_AGE_MS) return

  let frames = 0
  let stopped = false
  const events = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const

  const stop = () => {
    stopped = true
    for (const name of events) window.removeEventListener(name, stop)
  }
  // The moment the user scrolls or presses a key themselves, stop pinning so we never fight them.
  for (const name of events) window.addEventListener(name, stop, { passive: true })

  const pin = () => {
    if (stopped) return
    // The new content may still be streaming in (shorter page), so keep re-applying for a moment.
    if (Math.abs(window.scrollY - saved.y) > 1) window.scrollTo(0, saved.y)
    frames += 1
    if (frames >= SCROLL_PIN_FRAMES) return stop()
    window.requestAnimationFrame(pin)
  }
  pin()
}

/**
 * Tracks a "tab or chip was clicked, the new content is still loading" state for ONE section of a page.
 * Put it around the links (SectionLoadingLink) and the area they change (SectionLoadingArea).
 * It renders no HTML of its own.
 */
export function SectionLoadingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [label, setLabel] = React.useState('Loading…')

  // Runs when this provider appears (the new page replaced the old one) and when a load finishes in place.
  React.useLayoutEffect(() => {
    if (!isPending) restoreSavedScroll()
  }, [isPending])

  const navigate = React.useCallback(
    (href: string, nextLabel: string) => {
      savedScroll = { y: window.scrollY, path: window.location.pathname, time: Date.now() }
      setLabel(nextLabel)
      startTransition(() => router.push(href, { scroll: false }))
    },
    [router],
  )

  const value = React.useMemo(() => ({ isPending, label, navigate }), [isPending, label, navigate])

  return <SectionLoadingContext.Provider value={value}>{children}</SectionLoadingContext.Provider>
}

type SectionLoadingLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string
  /** Text shown in the loading card while this link's content loads, e.g. "Loading Staff…". */
  loadingLabel?: string
}

/**
 * A normal <Link> (still a real URL, so it can be shared and works without JavaScript).
 * A plain click is handled in a React transition instead, so the rest of the page stays on screen
 * and the SectionLoadingArea shows a loading card until the new content is ready.
 */
export function SectionLoadingLink({ href, loadingLabel = 'Loading…', onClick, children, ...props }: SectionLoadingLinkProps) {
  const section = React.useContext(SectionLoadingContext)

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!section || event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        if (props.target && props.target !== '_self') return
        // The tab/chip that is already open: nothing to load.
        if (props['aria-current']) return
        event.preventDefault()
        section.navigate(href, loadingLabel)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

/**
 * Wraps the content that changes when a SectionLoadingLink is clicked. While it loads, the old content
 * fades and a small loading card appears on top of this area only. The sidebar, top bar and the rest
 * of the page are not covered.
 */
export function SectionLoadingArea({ children, className }: { children: React.ReactNode; className?: string }) {
  const section = React.useContext(SectionLoadingContext)
  const isPending = section?.isPending ?? false

  return (
    <div className="relative" aria-busy={isPending}>
      <div className={cn('transition-opacity duration-150', isPending && 'pointer-events-none select-none opacity-40', className)}>{children}</div>

      {isPending ? (
        <div role="status" aria-live="polite" className="absolute inset-0 z-10 flex cursor-wait items-start justify-center pt-10">
          <div className="flex items-center gap-3 rounded-xl bg-card px-5 py-3.5 shadow-lg ring-1 ring-border">
            <span aria-hidden className="relative block h-6 w-6 shrink-0">
              <span className="absolute inset-0 rounded-full border-[3px] border-brand-teal-400/20" />
              <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand-teal-400" />
            </span>
            <span className="text-sm font-semibold text-foreground">{section?.label ?? 'Loading…'}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}