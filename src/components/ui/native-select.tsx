import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type NativeSelectProps = React.ComponentProps<'select'> & {
  /** Accessible label (visually hidden). */
  label: string
  id: string
  wrapperClassName?: string
}

/** A styled browser <select> with a hidden label. Works with keyboards, screen readers and phones out of the box. */
function NativeSelect({ label, id, className, wrapperClassName, children, ...props }: NativeSelectProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          'h-10 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-sm text-foreground shadow-sm transition-opacity',
          'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { NativeSelect }