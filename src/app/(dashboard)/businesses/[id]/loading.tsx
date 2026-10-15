/** Skeleton shown while a business profile loads. */
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'

function Block({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-border/60 ${className}`} />
}

export default function BusinessLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading business profile">
      <div className="space-y-2">
        <Block className="h-3 w-32" />
        <Block className="h-9 w-72" />
        <Block className="h-4 w-80 max-w-full" />
      </div>
      <Block className="h-[132px]" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Block className="h-[230px]" />
        <Block className="h-[230px]" />
      </div>
      <Block className="h-[480px]" />
      <span className="sr-only">Loading…</span>
      <PageLoadingOverlay label="Loading business profile…" />
    </div>
  )
}