/** Skeleton shown while the architecture page loads. */
import { PageLoadingOverlay } from '@/components/shared/page-loading-overlay'

function Block({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-border/60 ${className}`} />
}

export default function ArchitectureLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading architecture">
      <div className="space-y-2">
        <Block className="h-3 w-24" />
        <Block className="h-9 w-72 max-w-full" />
        <Block className="h-4 w-96 max-w-full" />
      </div>
      <Block className="h-11 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
        <Block className="h-[124px]" />
      </div>
      <Block className="h-[560px]" />
      <span className="sr-only">Loading…</span>
      <PageLoadingOverlay label="Loading Architecture…" />
    </div>
  )
}