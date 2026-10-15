/** Skeleton shown while the Overview queries run. Mirrors the real layout so nothing jumps. */
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'

function Block({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-border/60 ${className}`} />
}

export default function OverviewLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading platform overview">
      <div className="space-y-2">
        <Block className="h-3 w-40" />
        <Block className="h-9 w-72" />
        <Block className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Block key={index} className="h-[132px]" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Block className="h-[420px]" />
        <Block className="h-[420px]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Block className="h-[360px]" />
        <Block className="h-[360px]" />
      </div>
      <span className="sr-only">Loading…</span>
      <PageLoadingOverlay label="Loading Overview…" />
    </div>
  )
}