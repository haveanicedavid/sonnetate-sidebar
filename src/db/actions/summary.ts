import { id, lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'
import {
  assignIds,
  createTopicTree,
  flattenMdBlocks, // flattenTopicTree,
  getDescription,
  getTopics,
  getTrees,
} from '@/lib/markdown/utils'

export function createSummary({
  md,
  url,
  userId,
  isShared = false,
}: {
  md: string
  url: string
  userId: string
  isShared?: boolean
}) {
  const summaryId = id()
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  console.log('🪚 mdBlocks:', mdBlocks)
  const trees = getTrees(mdBlocks)
  const topicTree = createTopicTree(trees)
  const summaryTopic = topicTree[0].label
  // const topicsWithParents = flattenTopicTree(topicTree)

  const createTopicTxs = getTopics(trees).map((topic) => {
    const name = topic.toLowerCase()
    return tx.topics[lookup('name', name)]
      .update({ label: topic })
      .link({ users: userId })
  })

  const withIds = assignIds(mdBlocks)
  const rootBlock = withIds[0]
  console.log('🪚 rootBlock:', rootBlock)
  const flatBlocksWithId = flattenMdBlocks(withIds)

  const createPathTxns = trees.map((tree) => {
    const pathName = tree.toLowerCase()
    return tx.paths[lookup('name', pathName)].update({
      // TODO: there's something weird with instant where passing the actual
      // name throws an error, but passing a random key works. So I'm just
      // passing createdAt even if it's not needed
      createdAt: new Date().getTime(),
    })
  })

  const treeMap: { [path: string]: string } = {}
  const treeTxs = trees.map((tree) => {
    const treeId = id()
    treeMap[tree] = treeId
    const topics = getTopics([tree]).map((topic) =>
      lookup('name', topic.toLowerCase())
    )

    return tx.trees[treeId].update({ name: tree.toLowerCase() }).link({
      summary: summaryId,
      user: userId,
      topics,
      path: lookup('name', tree.toLowerCase()),
    })
  })

  const blockTxs = flatBlocksWithId.map((block) => {
    const { id, text, tree, order, type, parentId } = block

    return tx.blocks[id]
      .update({
        text,
        order,
        type: type === 'heading' ? 'tree' : 'block',
      })
      .link({
        user: userId,
        ...(parentId ? { parent: parentId } : {}),
        ...(tree.length > 0 ? { tree: treeMap[tree] } : {}),
      })
  })

  // TODO: not really sure if this is correct or guaranteed, but setting up the
  // trees first prevents a not-null error in blocks. I assume because of the
  // tree lookup
  db.transact([
    ...createTopicTxs,
    ...createPathTxns,
    ...treeTxs,
    tx.summaries[summaryId]
      .update({
        description,
        isShared,
        for: url,
        createdAt: new Date().getTime(),
        topicName: summaryTopic.toLowerCase(),
      })
      .link({
        user: userId,
        rootBlock: rootBlock.id,
      }),
    ...blockTxs,
  ])
}

export function shareSummary(summaryId: string) {
  db.transact([tx.summaries[summaryId].update({ isShared: true })])
}
