/** Skeleton shown while the activity log loads. */
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'

function Block({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-border/60 ${className}`} />
}

export default function ActivityLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading activity">
      <div className="space-y-2">
        <Block className="h-3 w-24" />
        <Block className="h-9 w-48" />
        <Block className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Block className="h-[340px]" />
        <Block className="h-[340px]" />
      </div>
      <Block className="h-[560px]" />
      <span className="sr-only">Loading…</span>
      <PageLoadingOverlay label="Loading Activity…" />
    </div>
  )
}