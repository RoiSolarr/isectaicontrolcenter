import { cn } from '@/lib/utils'

/**
 * Shows which environment the app is running in, taken from NODE_ENV:
 * `next dev` -> DEV, `next build` / `next start` / Vercel -> PROD.
 */
export function EnvironmentBadge() {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200">
      <span className="flex items-center gap-2">
        <span aria-hidden className={cn('h-2 w-2 rounded-full', isProduction ? 'bg-emerald-400' : 'bg-amber-400')} />
        Platform environment
      </span>
      <span className="font-semibold tracking-wide text-slate-300">{isProduction ? 'PROD' : 'DEV'}</span>
    </div>
  )
}