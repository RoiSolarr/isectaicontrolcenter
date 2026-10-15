import { ClipboardCheck, Database, ShieldCheck, type LucideIcon } from 'lucide-react'
import { BrandLogo } from '@/components/shared/brand-logo'

const TRUST_POINTS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ShieldCheck, title: 'Staff-only access', description: 'Separate from every customer portal.' },
  { icon: Database, title: 'Tenant-aware data controls', description: 'Row-level policies keep each business isolated.' },
  { icon: ClipboardCheck, title: 'Audit-ready operations', description: 'Activity is recorded across every business.' },
]

/** Left-hand brand panel of the login page. Desktop only (hidden below `lg`). */
export function LoginHero() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-b from-brand-navy-900 via-brand-navy-800 to-brand-teal-700 text-white lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-14">
      {/* Decorative rings — purely visual */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full border-[72px] border-white/[0.04]" />
        <div className="absolute -right-24 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute bottom-24 left-1/3 h-72 w-72 rounded-full bg-brand-teal-400/20 blur-3xl" />
      </div>

      <BrandLogo tone="light" className="relative" />

      <div className="relative max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal-300">Internal administrator portal</p>
        <p className="mt-5 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
          One view across every business you support.
        </p>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
          Monitor clinic appointments and field-service jobs from one secure platform workspace.
        </p>

        <ul className="mt-10 space-y-4">
          {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                <Icon className="h-[18px] w-[18px] text-brand-teal-300" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-sm text-white/65">{description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/60">© {new Date().getFullYear()} iSectAI · Internal systems</p>
    </aside>
  )
}
