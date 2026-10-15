import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type AdminSession = {
  user: User
  admin: Pick<Tables<'platform_admins'>, 'full_name' | 'role'>
}

/**
 * Returns the signed-in iSectAI platform administrator, or null.
 *
 * A valid Supabase session is NOT enough: the user must also have a row in
 * `platform_admins`. Customer accounts (rows in `business_members`) are rejected here.
 * Cached per request, so layouts and pages can call it freely.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured()) return null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: admin } = await supabase
      .schema('core')
      .from('platform_admins')
      .select('full_name, role')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!admin) return null

    return { user, admin }
  } catch {
    return null
  }
})
