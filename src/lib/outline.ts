import type { OutlineProps } from '@/components/outline'

export function mergeDuplicateOutlineNodes(
  nodes: OutlineProps[]
): OutlineProps[] {
  const mergedMap = new Map<string, OutlineProps>()

  nodes.forEach((node) => {
    const existingNode = mergedMap.get(node.label)
    if (existingNode) {
      // Merge children
      existingNode.children = mergeDuplicateOutlineNodes([
        ...existingNode.children,
        ...node.children,
      ])
    } else {
      // Add new node with merged children
      mergedMap.set(node.label, {
        ...node,
        children: mergeDuplicateOutlineNodes(node.children),
      })
    }
  })

  return Array.from(mergedMap.values())
}
