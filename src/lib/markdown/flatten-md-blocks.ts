import type { BlockSeed, MdBlock, TreeSeed } from './types'

interface FlattenedMd {
  blocks: BlockSeed[]
  trees: TreeSeed[]
  topics: TopicSeed[]
}

interface TopicSeed {
  name: string
  label: string
  parentName: string | null
  blockId: string
}

export function flattenParsedMd(parsedMd: MdBlock[]): FlattenedMd {
  const blocks: BlockSeed[] = []
  const trees: TreeSeed[] = []
  const topics: TopicSeed[] = []
  const topicsMap = new Map<string, TopicSeed>()

  function flattenBlock(block: MdBlock, parentId: string | null = null, parentTopic: string | null = null): void {
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

      const topicName = tree.topic.toLowerCase()
      if (!topicsMap.has(topicName)) {
        const topicSeed: TopicSeed = {
          name: topicName,
          label: tree.topic,
          parentName: parentTopic,
          blockId: block.id,
        }
        topics.push(topicSeed)
        topicsMap.set(topicName, topicSeed)
      }
    }

    if (children) {
      children.forEach((child) => flattenBlock(child, block.id, tree?.topic.toLowerCase() || parentTopic))
    }
  }

  parsedMd.forEach((block) => flattenBlock(block))

  return { blocks, trees, topics }
}
