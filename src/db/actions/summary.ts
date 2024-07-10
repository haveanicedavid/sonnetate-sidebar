import { id, lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'
import {
  assignIds,
  createTopicTree,
  flattenMdBlocks,
  flattenTopicTree,
  getDescription,
  getTopics,
  getTrees,
} from '@/lib/markdown/utils'

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
  const allTopics = getTopics(trees)
  const topicsWithParents = flattenTopicTree(createTopicTree(trees))

  const createTopicTxs = allTopics.map((topic) => {
    const name = topic.toLowerCase()
    return tx.topics[lookup('name', name)].update({ label: topic }).link({
      summaries: summaryId,
    })
  })

  const linkTopicTxs = topicsWithParents.map((topic) => {
    return (
      tx.topics[lookup('name', topic.label.toLowerCase())]
        // .update({
        //   label: topic.label,
        //   name: topic.label.toLowerCase(),
        // })
        .link({
          summaries: summaryId,
          users: userId,
          ...(topic.parent
            ? { parents: lookup('name', topic.parent.toLowerCase()) }
            : {}),
        })
    )
  })

  const mdBlocksWithId = flattenMdBlocks(assignIds(mdBlocks))

  const treeTxs = trees.map((tree) => {
    const treeId = id()
    const topics = getTopics([tree]).map((topic) =>
      lookup('name', topic.toLowerCase())
    )

    return tx.trees[treeId]
      .update({ path: tree.toLowerCase() })
      .link({ summary: summaryId, user: userId, topics })
  })

  const blockTxs = mdBlocksWithId.map((block) => {
    const { id, text, tree, order, type, parentId } = block

    return tx.blocks[id]
      .update({
        text,
        order,
        type: type === 'heading' ? 'tree' : 'block',
      })
      .link({
        summary: summaryId,
        user: userId,
        ...(parentId ? { parent: parentId } : {}),
        ...(tree.length > 0
          ? { tree: lookup('path', tree.toLowerCase()) }
          : {}),
      })
  })

  // TODO: not really sure if this is correct or guaranteed, but setting up the
  // trees first prevents a not-null error in blocks. I assume because of the
  // tree lookup
  db.transact(createTopicTxs)
  db.transact(treeTxs)
  db.transact([
    tx.summaries[summaryId]
      .update({
        for: url,
        description,
      })
      .link({ user: userId }),
    ...blockTxs,
  ])
  db.transact(linkTopicTxs)
}
