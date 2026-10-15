import type { DiagramEdge, DiagramNode, RoutedEdge } from '@/features/architecture/types'

export const NODE_WIDTH = 186
export const NODE_HEIGHT = 58

/**
 * Where along a node's side the n-th of `count` connectors attaches (0 = top edge, NODE_HEIGHT = bottom edge).
 * Spreading them out stops several arrowheads from landing on the same point.
 */
function attachmentOffset(index: number, count: number): number {
  const step = count > 1 ? Math.min(0.22, 0.6 / (count - 1)) : 0
  return NODE_HEIGHT * (0.5 + (index - (count - 1) / 2) * step)
}

function groupBy(edges: DiagramEdge[], key: 'from' | 'to'): Map<string, DiagramEdge[]> {
  const groups = new Map<string, DiagramEdge[]>()
  for (const edge of edges) {
    const list = groups.get(edge[key])
    if (list) list.push(edge)
    else groups.set(edge[key], [edge])
  }
  return groups
}

/**
 * Turns the diagram's one-to-many links into SVG curves.
 * The layout is in columns, so every link runs from the right side of its parent to the left side of its child.
 * Connectors on the same side of a node are ordered by where they lead, which keeps the curves from crossing needlessly.
 */
export function routeEdges(nodes: DiagramNode[], edges: DiagramEdge[]): RoutedEdge[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const centerY = (id: string) => (nodeById.get(id)?.y ?? 0) + NODE_HEIGHT / 2

  const outgoing = groupBy(edges, 'from')
  const incoming = groupBy(edges, 'to')
  for (const list of outgoing.values()) list.sort((a, b) => centerY(a.to) - centerY(b.to))
  for (const list of incoming.values()) list.sort((a, b) => centerY(a.from) - centerY(b.from))

  const routed: RoutedEdge[] = []
  for (const edge of edges) {
    const parent = nodeById.get(edge.from)
    const child = nodeById.get(edge.to)
    if (!parent || !child) continue // A typo in the diagram data should not crash the page.

    const outList = outgoing.get(edge.from) ?? []
    const inList = incoming.get(edge.to) ?? []
    const startX = parent.x + NODE_WIDTH
    const startY = parent.y + attachmentOffset(outList.indexOf(edge), outList.length)
    const endX = child.x
    const endY = child.y + attachmentOffset(inList.indexOf(edge), inList.length)
    const midX = (startX + endX) / 2

    routed.push({
      key: `${edge.from}->${edge.to}`,
      from: edge.from,
      to: edge.to,
      dashed: edge.dashed ?? false,
      path: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`,
    })
  }
  return routed
}