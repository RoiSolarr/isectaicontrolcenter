'use client'

import { useActionState, useEffect } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, ExternalLink, Info, Loader2, Lock, TriangleAlert } from 'lucide-react'
import { PasswordInput } from '@/components/shared/password-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAction } from '@/features/auth/actions'
import type { LoginNotice } from '@/features/auth/constants'
import { initialLoginState } from '@/features/auth/types'

type LoginFormProps = {
  /** Where to go after a successful sign-in (already sanitized on the server). */
  redirectTo: string
  notice: LoginNotice | null
  supabaseReady: boolean
  supportEmail?: string
}

const NOTICE_ICONS = {
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
} as const

export function LoginForm({ redirectTo, notice, supabaseReady, supportEmail }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, initialLoginState)
  const emailError = state.fieldErrors?.email
  const passwordError = state.fieldErrors?.password
  const NoticeIcon = notice ? NOTICE_ICONS[notice.variant] : null

  // While signing in, lock page scrolling (the overlay below blocks clicks and `inert` blocks the keyboard).
  useEffect(() => {
    if (!isPending) return

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    // Keep the layout from jumping sideways when the scrollbar disappears.
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [isPending])

  return (
    <>
      <div inert={isPending} className="space-y-6">
        {notice && NoticeIcon && (
          <Alert variant={notice.variant}>
            <NoticeIcon aria-hidden />
            <AlertTitle>{notice.title}</AlertTitle>
            <AlertDescription>{notice.description}</AlertDescription>
          </Alert>
        )}

        {!supabaseReady && (
          <Alert variant="warning">
            <TriangleAlert aria-hidden />
            <AlertTitle>Supabase is not connected yet.</AlertTitle>
            <AlertDescription>
              Add <code className="font-mono text-[13px]">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code className="font-mono text-[13px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
              <code className="font-mono text-[13px]">.env.local</code>, then restart the dev server.
            </AlertDescription>
          </Alert>
        )}

        {state.status === 'error' && state.message && (
          <Alert variant="destructive" role="alert">
            <AlertCircle aria-hidden />
            <AlertTitle>We could not sign you in.</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="next" value={redirectTo} />

          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="name@isectai.com"
              required
              defaultValue={state.email}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'email-error' : undefined}
            />
            {emailError && (
              <p id="email-error" className="text-sm font-medium text-destructive">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {supportEmail && (
                <a
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent('iSectAI admin password reset')}`}
                  className="rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? 'password-error' : undefined}
            />
            {passwordError && (
              <p id="password-error" className="text-sm font-medium text-destructive">
                {passwordError}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Protected staff session · MFA required in production
            </p>
          </div>
        </form>

        <div role="separator" className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled
          title="Company SSO is not enabled in this prototype"
        >
          Continue with company SSO
          <ExternalLink className="h-4 w-4" aria-hidden />
        </Button>

        <div className="rounded-lg border border-border bg-card/70 p-4 text-sm">
          <p className="font-semibold text-foreground">Are you a clinic or service customer?</p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Customer access is provided through each business’s dedicated portal — not this administrator login.
          </p>
        </div>
      </div>

      {/* Full-screen lock while signing in: blocks clicks and touch scrolling until the request finishes. */}
      {isPending && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex touch-none items-center justify-center bg-background/70 backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
            Signing you in… please wait.
          </div>
        </div>
      )}
    </>
  )
}