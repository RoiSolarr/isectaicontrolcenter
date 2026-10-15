import { DEFAULT_VIEW, VIEW_TABS } from '@/features/architecture/constants'
import type { ArchitectureView } from '@/features/architecture/types'

/** ?view=security -> 'security'. Anything missing or unknown falls back to the default view. */
export function parseArchitectureView(raw: string | string[] | undefined): ArchitectureView {
  const value = Array.isArray(raw) ? raw[0] : raw
  return VIEW_TABS.find((tab) => tab.id === value)?.id ?? DEFAULT_VIEW
}