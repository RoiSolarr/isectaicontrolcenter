import { Database, ShieldCheck, type LucideIcon } from 'lucide-react'
import type { ArchitectureView } from '@/features/architecture/types'

export const DEFAULT_VIEW: ArchitectureView = 'database'

export const VIEW_TABS: { id: ArchitectureView; label: string; icon: LucideIcon }[] = [
  { id: 'database', label: 'Database architecture', icon: Database },
  { id: 'security', label: 'Security & decisions', icon: ShieldCheck },
]

/** Page header text for each view (same layout as the other pages: eyebrow, title, description). */
export const VIEW_HEADERS: Record<ArchitectureView, { eyebrow: string; title: string; description: string }> = {
  database: {
    eyebrow: 'Data model',
    title: 'Database architecture',
    description: 'A shared relational core supports clinics and field-service businesses without mixing tenant data.',
  },
  security: {
    eyebrow: 'Design decisions',
    title: 'Architecture & security',
    description: 'How the prototype keeps each business separate, and how a production version would harden it.',
  },
}

/** Quick links at the top of the Security view. Each answers one question from the trial brief (section 2C). */
export const BRIEF_QUESTIONS: { id: string; label: string }[] = [
  { id: 'technology', label: 'Why this technology' },
  { id: 'industries', label: 'Multiple industries' },
  { id: 'separation', label: 'Keeping businesses separate' },
  { id: 'access', label: 'Admin vs customer access' },
  { id: 'tradeoffs', label: 'Advantages & limitations' },
  { id: 'roadmap', label: 'Production roadmap' },
]