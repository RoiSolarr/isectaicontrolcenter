import { Building2, Plus, Wrench } from 'lucide-react'
import type { RecordType } from '@/types/database'
import { cn } from '@/lib/utils'

/** Square icon tile for a business: green plus for clinics, amber wrench for field service. */
export function BusinessAvatar({ recordType, className }: { recordType: RecordType | null; className?: string }) {
  const Icon = recordType === 'appointment' ? Plus : recordType === 'job' ? Wrench : Building2

  return (
    <span
      aria-hidden
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
        recordType === 'job' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
        className,
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={recordType === 'appointment' ? 3 : 2} />
    </span>
  )
}