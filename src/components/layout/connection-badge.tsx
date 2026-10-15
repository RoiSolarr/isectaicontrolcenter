import { isSupabaseConfigured } from '@/lib/supabase/env'
import { cn } from '@/lib/utils'

/** Backend status pill. The dashboard layout only renders after a verified Supabase session, so "connected" is accurate. */
export function ConnectionBadge() {
  const connected = isSupabaseConfigured()

  return (
    <span
      className={cn(
        'hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex',
        connected ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800',
      )}
    >
      <span aria-hidden className={cn('h-2 w-2 rounded-full', connected ? 'bg-emerald-500' : 'bg-amber-500')} />
      {connected ? 'Supabase connected' : 'Supabase not configured'}
    </span>
  )
}