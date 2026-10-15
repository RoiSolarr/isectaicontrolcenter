'use server'

import { redirect } from 'next/navigation'
import { loginSchema } from '@/features/auth/schemas'
import type { LoginState } from '@/features/auth/types'
import { sanitizeRedirectPath } from '@/features/auth/utils/sanitize-redirect-path'
import { ROUTES } from '@/lib/constants/routes'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

const MESSAGES = {
  notConfigured:
    'Supabase is not configured yet. Add your project URL and anon key to .env.local, then restart the dev server.',
  invalidCredentials: 'The email or password is incorrect. Check both and try again.',
  rateLimited: 'Too many sign-in attempts. Wait a minute, then try again.',
  serviceUnavailable: 'We could not reach the authentication service. Check your connection and try again.',
  notAdmin: 'This account does not have administrator access. Customers sign in through their business portal.',
} as const

type SignInOutcome = { ok: true } | { ok: false; message: string }

/** Signs in with email + password, then verifies the user is a platform administrator. */
async function authenticateAdmin(email: string, password: string): Promise<SignInOutcome> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      if (error?.status === 429 || error?.code === 'over_request_rate_limit') {
        return { ok: false, message: MESSAGES.rateLimited }
      }
      if (error?.code === 'invalid_credentials' || error?.status === 400) {
        return { ok: false, message: MESSAGES.invalidCredentials }
      }
      return { ok: false, message: MESSAGES.serviceUnavailable }
    }

    const { data: admin, error: adminError } = await supabase
      .schema('core')
      .from('platform_admins')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()

    if (adminError) {
      await supabase.auth.signOut()
      return { ok: false, message: MESSAGES.serviceUnavailable }
    }
    if (!admin) {
      // Valid account, but not an iSectAI staff member (e.g. a customer user).
      await supabase.auth.signOut()
      return { ok: false, message: MESSAGES.notAdmin }
    }

    return { ok: true }
  } catch {
    return { ok: false, message: MESSAGES.serviceUnavailable }
  }
}

export async function signInAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = sanitizeRedirectPath(String(formData.get('next') ?? ''))

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      status: 'error',
      email,
      fieldErrors: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] },
    }
  }

  if (!isSupabaseConfigured()) {
    return { status: 'error', email, message: MESSAGES.notConfigured }
  }

  const outcome = await authenticateAdmin(parsed.data.email, parsed.data.password)
  if (!outcome.ok) {
    return { status: 'error', email, message: outcome.message }
  }

  // redirect() throws, so it must stay outside of try/catch.
  redirect(redirectTo)
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut()
    } catch {
      // Nothing else to do — we still send the user back to the login page.
    }
  }
  redirect(`${ROUTES.login}?reason=signed_out`)
}
