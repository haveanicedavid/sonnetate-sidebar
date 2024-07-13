import type { BlockSeed, MdBlock, TreeSeed } from './types'

interface FlattenedMd {
  blocks: BlockSeed[]
  trees: TreeSeed[]
  topics: string[]
}

export function flattenParsedMd(parsedMd: MdBlock[]): FlattenedMd {
  const blocks: BlockSeed[] = []
  const trees: TreeSeed[] = []
  const topicsSet = new Set<string>()

  function flattenBlock(block: MdBlock, parentId: string | null = null): void {
    const { children, tree, ...rest } = block
    const flattenedBlock: BlockSeed = {
      ...rest,
      parentId,
      treeId: tree?.id || null,
    }

    blocks.push(flattenedBlock)

    if (tree) {
      const treeWithBlockId: TreeSeed = {
        ...tree,
        path: tree.path.toLowerCase(),
        blockId: block.id,
        parentId: tree.parentId === 'root' ? null : tree.parentId,
      }
      trees.push(treeWithBlockId)
      topicsSet.add(tree.topic)
    }

    if (children) {
      children.forEach((child) => flattenBlock(child, block.id))
    }
  }

  parsedMd.forEach((block) => flattenBlock(block))

  const topics = Array.from(topicsSet)

  return { blocks, trees, topics }
}
