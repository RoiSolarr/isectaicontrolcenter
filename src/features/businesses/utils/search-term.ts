/**
 * Cleans text typed in a search box before it is placed inside a PostgREST filter string.
 * Commas, parentheses, dots, quotes and the LIKE wildcards would change the meaning of the filter,
 * so they are replaced by spaces. Length is capped.
 */
export function sanitizeSearchTerm(raw: string): string {
  return raw
    .replace(/[%_\\,()*"'.:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i