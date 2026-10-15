const integerFormatter = new Intl.NumberFormat('en-US')

/** 8642 -> "8,642" */
export function formatNumber(value: number): string {
  return integerFormatter.format(value)
}

/** 12.43 -> "12.4%" (one decimal, trailing ".0" dropped). */
export function formatPercent(value: number): string {
  const rounded = Math.round(Math.abs(value) * 10) / 10
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`
}

/**
 * Percentage change between two periods.
 * Returns null when there is no previous period to compare against (avoids "Infinity%").
 */
export function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null
  return ((current - previous) / previous) * 100
}