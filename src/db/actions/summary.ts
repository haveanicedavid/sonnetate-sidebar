import { id, lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'
import { MdBlock } from '@/lib/markdown/types'
import { createTopicTree, getDescription, getTrees } from '@/lib/markdown/utils'

export function createSummary({
  md,
  url,
  userId,
}: {
  md: string
  url: string
  userId: string
}) {
  const summaryId = id()
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  const trees = getTrees(mdBlocks)
  const topicTree = createTopicTree(trees)

  const topicTxs = topicTree.map((topic) => {
    return tx.topics[lookup('name', topic.label.toLowerCase())].link({
      summary: summaryId,
    })
  })

  const createBlockTxns = (blocks: MdBlock[], parentId?: string) => {
    return blocks.map((block) => {
      const blockId = id()
      // const blockTx = tx.blocks[blockId]
      //   .update({
      //     text: block.text,
      //     type: block.type,
      //     order: block.order,
      //   })
      //   .link({
      //     summary: summaryId,
      //     tree: lookup('path', block.tree.toLowerCase()),
      //     ...(parentId && { parent: parentId }),
      //   })

      if (block.children.length > 0) {
        return createBlockTxns(block.children, blockId)
      }

      return blockTx
    })
  }

  // path: id
  const treeMap = new Map<string, string>()

  const treeTxs = trees.map((tree) => {
    const treeId = id()
    treeMap.set(tree, treeId)
    return tx.trees[treeId]
      .update({ path: tree.toLowerCase() })
      .link({ summary: summaryId })
  })

  db.transact([
    tx.summaries[summaryId].update({
      for: url,
      description,
    }),
    ...treeTxs,
  ])
}
