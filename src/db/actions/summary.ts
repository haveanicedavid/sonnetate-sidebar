import { id, tx } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'
import { getDescription, getTrees } from '@/lib/markdown/utils'

export function createSummary({ md, url }: { md: string; url: string }) {
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  const trees = getTrees(mdBlocks)

  const summaryId = id()

  // path: id
  const treeMap = new Map<string, string>()

  const treeTxs = trees.map((tree) => {
    const treeId = id()
    treeMap.set(tree, treeId)
    return tx.trees[treeId].update({ path: tree }).link({ summary: summaryId })
  })

  db.transact([
    tx.summaries[summaryId].update({
      for: url,
      description,
    }),
    ...treeTxs,
  ])
}
