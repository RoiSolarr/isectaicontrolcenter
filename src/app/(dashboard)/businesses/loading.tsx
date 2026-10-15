/** Skeleton shown while the directory query runs. */
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'

function Block({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-border/60 ${className}`} />
}

export default function BusinessesLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading businesses">
      <div className="space-y-2">
        <Block className="h-3 w-24" />
        <Block className="h-9 w-56" />
        <Block className="h-4 w-80 max-w-full" />
      </div>
      <Block className="h-[460px]" />
      <span className="sr-only">Loading…</span>
      <PageLoadingOverlay label="Loading Businesses…" />
    </div>
  )
}