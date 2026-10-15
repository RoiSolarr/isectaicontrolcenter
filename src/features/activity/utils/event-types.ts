import type { LucideIcon } from 'lucide-react'
import { EVENT_TYPE_META, FALLBACK_EVENT_ICON, FALLBACK_EVENT_TONE } from '@/features/activity/constants'

/** "schedule_synced" -> "Schedule synced". Used for event types that have no entry in EVENT_TYPE_META. */
export function humanizeEventType(type: string): string {
  const words = type.replace(/[_-]+/g, ' ').trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Event'
}

/** Label, icon and colour for an event type. Never throws, so new event types in the database cannot break the page. */
export function getEventMeta(type: string): { label: string; icon: LucideIcon; tone: string } {
  const known = EVENT_TYPE_META[type]
  if (known) return known
  return { label: humanizeEventType(type), icon: FALLBACK_EVENT_ICON, tone: FALLBACK_EVENT_TONE }
}