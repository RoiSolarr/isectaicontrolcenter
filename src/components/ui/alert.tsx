import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:h-4 [&>svg]:w-4 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-foreground',
        info: 'border-teal-200 bg-teal-50 text-teal-950 [&>svg]:text-teal-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-950 [&>svg]:text-emerald-700',
        warning: 'border-amber-300 bg-amber-50 text-amber-950 [&>svg]:text-amber-700',
        destructive: 'border-red-200 bg-red-50 text-red-950 [&>svg]:text-red-700',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>

function Alert({ className, variant, role = 'status', ...props }: AlertProps) {
  return <div role={role} className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('font-semibold leading-snug', className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('mt-0.5 leading-relaxed opacity-90', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
