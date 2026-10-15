import { Badge } from '@/components/ui/badge'
import type { BusinessStaffMember } from '@/features/businesses/types'

const HEAD_CELL = 'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'

function initials(fullName: string): string {
  const parts = fullName.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim().split(/\s+/).filter(Boolean)
  return `${parts[0]?.[0] ?? '?'}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toUpperCase()
}

export function StaffPanel({ staff, providerLabel }: { staff: BusinessStaffMember[]; providerLabel: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold tracking-tight">
          Staff<span className="ml-2 text-sm font-medium text-muted-foreground">· {staff.length}</span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">People who work at this business, including the {providerLabel.toLowerCase()} who deliver the service.</p>
      </div>

      {staff.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No staff have been added yet.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Staff of this business</caption>
            <thead>
              <tr>
                <th scope="col" className={HEAD_CELL}>
                  Name
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Role
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Location
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Type
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-t border-border">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {initials(member.fullName)}
                      </span>
                      <span className="font-semibold">{member.fullName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{member.role}</td>
                  <td className="px-3 py-3 text-muted-foreground">{member.locationName ?? '—'}</td>
                  <td className="px-3 py-3">
                    <Badge variant={member.isProvider ? 'brand' : 'neutral'}>{member.isProvider ? providerLabel : 'Support'}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={member.isActive ? 'success' : 'neutral'} dot>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}