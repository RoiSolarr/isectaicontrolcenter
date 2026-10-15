'use client'

import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatClockTime } from '@/lib/format/dates'
import { cn } from '@/lib/utils'

/** Re-runs the server queries for this page and shows when the data was last loaded. */
export function RefreshButton({ updatedAt }: { updatedAt: string }) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [updatedLabel, setUpdatedLabel] = React.useState<string | null>(null)

  // Formatted in the browser so it uses the viewer's time zone.
  React.useEffect(() => {
    setUpdatedLabel(formatClockTime(new Date(updatedAt)))
  }, [updatedAt])

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-muted-foreground sm:inline" aria-live="polite">
        {updatedLabel ? `Updated ${updatedLabel}` : ''}
      </span>
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => startTransition(() => router.refresh())}>
        <RefreshCw className={cn('h-4 w-4', isPending && 'animate-spin')} aria-hidden />
        Refresh
      </Button>
    </div>
  )
}