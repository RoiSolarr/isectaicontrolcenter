/**
 * Reads Supabase settings from environment variables.
 * Placeholder values (from .env.example) are treated as "not configured" so the
 * app can still render the login page before real keys are added.
 */
const PLACEHOLDER_URL_PARTS = ['your-project-ref', 'placeholder']
const PLACEHOLDER_KEYS = ['your-anon-key', 'placeholder']

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv()

  if (!url || !anonKey) return false
  if (!/^https?:\/\//.test(url)) return false
  if (PLACEHOLDER_URL_PARTS.some((part) => url.includes(part))) return false
  if (PLACEHOLDER_KEYS.includes(anonKey)) return false

  return true
}
