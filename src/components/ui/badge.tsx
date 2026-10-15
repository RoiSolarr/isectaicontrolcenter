import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      neutral: 'bg-secondary text-secondary-foreground',
      success: 'bg-emerald-50 text-emerald-800',
      warning: 'bg-amber-50 text-amber-800',
      danger: 'bg-red-50 text-red-800',
      info: 'bg-sky-50 text-sky-800',
      brand: 'bg-teal-50 text-teal-800',
    },
  },
  defaultVariants: { variant: 'neutral' },
})

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** Adds a small coloured dot before the label (status badges). */
    dot?: boolean
  }

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }