import { AccessModelCard } from '@/features/architecture/components/access-model-card'
import { BriefJumpLinks } from '@/features/architecture/components/brief-jump-links'
import { IndustriesCard } from '@/features/architecture/components/industries-card'
import { RequestPathCard } from '@/features/architecture/components/request-path-card'
import { RoadmapCard } from '@/features/architecture/components/roadmap-card'
import { SeparationCard } from '@/features/architecture/components/separation-card'
import { TechnologyCard } from '@/features/architecture/components/technology-card'
import { TradeoffsCard } from '@/features/architecture/components/tradeoffs-card'

/** The "Security & decisions" tab. Needs no database queries; it is all explanation. */
export function SecurityView() {
  return (
    <div className="space-y-6">
      <BriefJumpLinks />

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <TechnologyCard />
        <IndustriesCard />
      </div>

      <SeparationCard />
      <RequestPathCard />
      <AccessModelCard />
      <TradeoffsCard />
      <RoadmapCard />
    </div>
  )
}