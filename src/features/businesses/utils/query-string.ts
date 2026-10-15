type Value = string | number | null | undefined

/** "?a=1&b=2" from a params object. Empty values and values equal to their default are left out to keep URLs short. */
export function buildQueryString(params: Record<string, Value>, defaults: Record<string, Value> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    if (defaults[key] !== undefined && String(defaults[key]) === String(value)) continue
    search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

/** Next.js gives string | string[] | undefined for each query parameter. */
export function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}