'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>

/** Password field with a show/hide toggle and a Caps Lock warning. */
export function PasswordInput({ className, onKeyDown, onKeyUp, onBlur, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  const [capsLockOn, setCapsLockOn] = React.useState(false)

  const syncCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(event.getModifierState('CapsLock'))
  }

  return (
    <div>
      <div className="relative">
        <Input
          {...props}
          type={visible ? 'text' : 'password'}
          className={cn('pr-12', className)}
          onKeyDown={(event) => {
            syncCapsLock(event)
            onKeyDown?.(event)
          }}
          onKeyUp={(event) => {
            syncCapsLock(event)
            onKeyUp?.(event)
          }}
          onBlur={(event) => {
            setCapsLockOn(false)
            onBlur?.(event)
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? <Eye className="h-[18px] w-[18px]" aria-hidden /> : <EyeOff className="h-[18px] w-[18px]" aria-hidden />}
        </button>
      </div>
      {capsLockOn && (
        <p role="status" className="mt-1.5 text-xs font-medium text-amber-800">
          Caps Lock is on.
        </p>
      )}
    </div>
  )
}