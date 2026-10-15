'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { LIVE_REFRESH_MS } from '@/features/activity/constants'
import { cn } from '@/lib/utils'

/**
 * "Live" switch: while it is on, the log re-reads the database every 30 seconds (only while this tab is visible).
 * It is off by default and resets on reload, so nobody leaves a hidden refresh loop running by accident.
 */
export function LiveToggle() {
  const router = useRouter()
  const [isLive, setIsLive] = React.useState(false)
  const [, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (!isLive) return
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') startTransition(() => router.refresh())
    }, LIVE_REFRESH_MS)
    return () => clearInterval(timer)
  }, [isLive, router])

  return (
    <button
      type="button"
      aria-pressed={isLive}
      title={isLive ? 'Refreshing every 30 seconds. Click to stop.' : 'Refresh the log automatically every 30 seconds'}
      onClick={() => setIsLive((value) => !value)}
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), isLive && 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-50')}
    >
      <span aria-hidden className="relative flex h-2 w-2">
        {isLive ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" /> : null}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', isLive ? 'bg-emerald-500' : 'bg-muted-foreground/50')} />
      </span>
      {isLive ? 'Live' : 'Go live'}
    </button>
  )
}