import { cn } from '@/lib/utils'

type BrandLogoProps = {
  /** "light" = for dark backgrounds, "dark" = for light backgrounds. */
  tone?: 'light' | 'dark'
  className?: string
}

export function BrandLogo({ tone = 'dark', className }: BrandLogoProps) {
  const isLight = tone === 'light'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal-400 to-brand-teal-600 font-display text-xl font-extrabold text-white shadow-sm"
      >
        i
      </span>
      <span className="leading-tight">
        <span className={cn('block font-display text-lg font-bold', isLight ? 'text-white' : 'text-foreground')}>
          iSectAI
        </span>
        <span
          className={cn(
            'block text-[11px] font-semibold uppercase tracking-[0.16em]',
            isLight ? 'text-brand-teal-200' : 'text-muted-foreground',
          )}
        >
          Control Center
        </span>
      </span>
    </div>
  )
}
