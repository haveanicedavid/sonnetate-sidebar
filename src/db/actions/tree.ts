import { id, lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'
import {
  assignMdBlockIds,
  createTopicTree,
  flattenMdBlocks, // flattenTopicTree,
  getDescription,
  getTopics,
  getTrees,
} from '@/lib/markdown/utils'

export function buildTree({
  isPublic = false,
  md,
  url,
  userId,
}: {
  isPublic?: boolean
  md: string
  url: string
  userId: string
}) {
  const treeId = id()
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  const trees = getTrees(mdBlocks)
  const topicTree = createTopicTree(trees)
  const withIds = assignMdBlockIds(mdBlocks)
  const rootBlock = withIds[0]
}
