import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BrandLogo } from '@/components/shared/brand-logo'
import { LoginForm } from '@/features/auth/components/login-form'
import { LoginHero } from '@/features/auth/components/login-hero'
import { LOGIN_NOTICES, isLoginNoticeKey } from '@/features/auth/constants'
import { getAdminSession } from '@/features/auth/server/get-admin-session'
import { sanitizeRedirectPath } from '@/features/auth/utils/sanitize-redirect-path'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export const metadata: Metadata = { title: 'Sign in' }

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, reason } = await searchParams
  const redirectTo = sanitizeRedirectPath(next)

  // Already signed in as an administrator? Skip the form.
  const session = await getAdminSession()
  if (session) redirect(redirectTo)

  const notice = reason && isLoginNoticeKey(reason) ? LOGIN_NOTICES[reason] : null

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <LoginHero />

      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[470px]">
          <BrandLogo tone="dark" className="mb-10 lg:hidden" />

          <header className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Internal staff access only
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Sign in to the iSectAI administrator console. This workspace is separate from customer portals.
            </p>
          </header>

          <LoginForm
            redirectTo={redirectTo}
            notice={notice}
            supabaseReady={isSupabaseConfigured()}
            supportEmail={process.env.NEXT_PUBLIC_SUPPORT_EMAIL || undefined}
          />
        </div>
      </main>
    </div>
  )
}
