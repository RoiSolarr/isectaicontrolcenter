'use client'

import * as React from 'react'
import { ER_EDGES, ER_GROUP_STYLE, ER_NODES, ER_VIEW_BOX } from '@/features/architecture/content/er-diagram'
import { NODE_HEIGHT, NODE_WIDTH, routeEdges } from '@/features/architecture/utils/diagram-geometry'
import { cn } from '@/lib/utils'

// The layout never changes, so the curves are worked out once, not on every render.
const ROUTED_EDGES = routeEdges(ER_NODES, ER_EDGES)

/**
 * The entity-relationship diagram. Hover or tab to a table to light up the tables it is linked to.
 * Client component only for that highlight; the layout itself lives in content/er-diagram.ts.
 * A text version of the same information is in "Tables by schema" below, for screen readers and small screens.
 */
export function ErDiagram() {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const linkedIds = React.useMemo(() => {
    if (!activeId) return null
    const ids = new Set<string>([activeId])
    for (const edge of ROUTED_EDGES) {
      if (edge.from === activeId) ids.add(edge.to)
      if (edge.to === activeId) ids.add(edge.from)
    }
    return ids
  }, [activeId])

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-background/60">
      <svg
        viewBox={`0 0 ${ER_VIEW_BOX.width} ${ER_VIEW_BOX.height}`}
        role="group"
        aria-label="Entity relationship diagram: industries, businesses, locations, staff, customers, activity events, members, administrators, appointments and jobs."
        className="block h-auto w-full min-w-[760px]"
      >
        <defs>
          <marker id="er-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 1 L 9 5 L 0 9 z" className="fill-slate-500" />
          </marker>
          <marker id="er-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 1 L 9 5 L 0 9 z" className="fill-teal-700" />
          </marker>
        </defs>

        {ROUTED_EDGES.map((edge) => {
          const isActive = activeId !== null && (edge.from === activeId || edge.to === activeId)
          const isDimmed = activeId !== null && !isActive
          return (
            <path
              key={edge.key}
              d={edge.path}
              fill="none"
              strokeWidth={isActive ? 2.2 : 1.5}
              strokeDasharray={edge.dashed ? '5 4' : undefined}
              markerEnd={isActive ? 'url(#er-arrow-active)' : 'url(#er-arrow)'}
              className={cn('transition-opacity', isActive ? 'stroke-teal-700' : 'stroke-slate-400', isDimmed && 'opacity-15')}
            />
          )
        })}

        {ER_NODES.map((node) => {
          const style = ER_GROUP_STYLE[node.group]
          const isActive = node.id === activeId
          const isDimmed = linkedIds !== null && !linkedIds.has(node.id)
          return (
            <g
              key={node.id}
              tabIndex={0}
              aria-label={`${node.schemaLabel}${node.title}: ${node.subtitle}`}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              className={cn('cursor-default outline-none transition-opacity', isDimmed && 'opacity-35')}
            >
              <rect
                x={node.x}
                y={node.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={10}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={node.group === 'external' ? '5 4' : undefined}
                className={style.box}
              />
              <text x={node.x + 14} y={node.y + 25} className={cn('font-mono text-[12px] font-semibold', style.title)}>
                <tspan className="fill-slate-500 font-normal">{node.schemaLabel}</tspan>
                {node.title}
              </text>
              <text x={node.x + 14} y={node.y + 44} className="fill-slate-600 text-[11px]">
                {node.subtitle}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}