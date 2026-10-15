import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES, isPublicPath } from '@/lib/constants/routes'
import { getSupabaseEnv, isSupabaseConfigured } from '@/lib/supabase/env'
import type { Database } from '@/types/database'

function redirectToLogin(request: NextRequest, sessionResponse?: NextResponse) {
  const url = request.nextUrl.clone()
  const { pathname, search } = request.nextUrl

  url.pathname = ROUTES.login
  url.search = ''
  if (pathname !== '/') url.searchParams.set('next', `${pathname}${search}`)

  const redirect = NextResponse.redirect(url)
  // Keep any refreshed auth cookies on the redirect response.
  sessionResponse?.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}

/**
 * Refreshes the Supabase session cookie and sends signed-out visitors to /login.
 * Only checks "is there a user?" — the platform-admin check happens in
 * src/app/(dashboard)/layout.tsx so middleware stays fast.
 */
export async function updateSession(request: NextRequest) {
  const isPublic = isPublicPath(request.nextUrl.pathname)
  let response = NextResponse.next({ request })

  if (!isSupabaseConfigured()) {
    return isPublic ? response : redirectToLogin(request)
  }

  const { url, anonKey } = getSupabaseEnv()
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  let hasUser = false
  try {
    const { data } = await supabase.auth.getUser()
    hasUser = Boolean(data.user)
  } catch {
    hasUser = false
  }

  if (!hasUser && !isPublic) return redirectToLogin(request, response)
  return response
}