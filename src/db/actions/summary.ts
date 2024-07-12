import { id, lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { flattenParsedMd } from '@/lib/markdown/flatten-md-blocks'
import { parseMd } from '@/lib/markdown/parse-md'
import { getDescription } from '@/lib/markdown/utils'
import { getUrlDomainAndPath } from '@/lib/url'

export function createSummary({
  isPublic = false,
  md,
  pageTitle,
  prompt,
  url,
  userId,
}: {
  isPublic?: boolean
  md: string
  pageTitle: string
  prompt?: string
  url: string
  userId: string
}) {
  const summaryId = id()
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  const { trees, blocks, topics } = flattenParsedMd(mdBlocks)
  const { path, domain } = getUrlDomainAndPath(url)

  const topicTxs = topics.map((topic) => {
    const name = topic.toLowerCase()
    return tx.topics[lookup('name', name)].update({
      label: name,
      lastReferenced: new Date().getTime(),
      users: userId,
    })
  })

  const treeTxs = trees.map(({ parentId, blockId, path, id, topic }) => {
    return tx.trees[id]
      .update({
        isPublic,
        path,
      })
      .link({
        topic: lookup('name', topic.toLowerCase()),
        user: userId,
        block: blockId,
        ...(parentId ? { parents: parentId } : {}),
      })
  })

  const blockTxs = blocks.map(({ id, parentId, text, type, order }) => {
    return tx.blocks[id]
      .update({
        order,
        text,
        type,
      })
      .link({
        user: userId,
        ...(parentId ? { parent: parentId } : {}),
      })
  })

  db.transact([
    tx.summaries[summaryId]
      .update({
        description,
        domainName: domain,
        domainPath: path,
        pageTitle,
        prompt,
        title: trees[0].topic,
        isPublic,
        url,
      })
      .link({
        user: userId,
        rootBlock: mdBlocks[0].id,
      }),
    ...topicTxs,
    ...treeTxs,
    ...blockTxs,
  ])
}

export function shareSummary(summaryId: string) {
  db.transact([tx.summaries[summaryId].update({ isShared: true })])
}
