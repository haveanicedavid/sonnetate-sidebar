import { id } from '@instantdb/react'

export interface MdTreeNode {
  treeId: string
  parentTreeId: string | null
  label: string
  children: MdTreeNode[]
}

export interface MdFlatTreeNode {
  treeId: string
  parentTreeId: string | null
  label: string
}

export function createTopicTree(trees: string[]): MdTreeNode[] {
  const root: MdTreeNode[] = []

  function addNode(
    parts: string[],
    parentTreeId: string | null = null
  ): MdTreeNode {
    const label = parts[0]
    const treeId = id()
    const node: MdTreeNode = { treeId, parentTreeId, label, children: [] }

    if (parts.length > 1) {
      node.children.push(addNode(parts.slice(1), treeId))
    }

    return node
  }

  for (const tree of trees) {
    const parts = tree.split('/').map((part) => part.trim())
    let currentLevel = root
    let currentParentTreeId: string | null = null

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      let existingNode = currentLevel.find((node) => node.label === part)

      if (!existingNode) {
        existingNode = addNode(parts.slice(i), currentParentTreeId)
        currentLevel.push(existingNode)
      }

      currentLevel = existingNode.children
      currentParentTreeId = existingNode.treeId
    }
  }

  return root
}

export function flattenTopicTree(tree: MdTreeNode[]): MdFlatTreeNode[] {
  const flatNodes: MdFlatTreeNode[] = []

  function flatten(node: MdTreeNode) {
    const { children, ...flatNode } = node
    flatNodes.push(flatNode)

    for (const child of children) {
      flatten(child)
    }
  }

  for (const node of tree) {
    flatten(node)
  }

  return flatNodes
}
