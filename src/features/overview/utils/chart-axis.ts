const STEP_MULTIPLIERS = [1, 2, 3, 4, 5, 10]

/**
 * Rounds the tallest bar up to a clean axis maximum split into `tickCount` equal whole-number steps.
 * 83 -> 120 (ticks 30/60/90/120). Never returns less than `tickCount` so an empty chart still has an axis.
 */
export function niceAxisMax(maxValue: number, tickCount = 4): number {
  if (maxValue <= 0) return tickCount

  const rawStep = maxValue / tickCount
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const multiplier = STEP_MULTIPLIERS.find((candidate) => candidate >= rawStep / magnitude) ?? 10
  const step = Math.max(1, multiplier * magnitude)

  return step * tickCount
}

/** Which x-axis labels to print so they never overlap. The last (today) label is always shown. */
export function shouldShowLabel(index: number, total: number, maxLabels = 7): boolean {
  const step = Math.max(1, Math.ceil(total / maxLabels))
  return (total - 1 - index) % step === 0
}