import { lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { flattenParsedMd } from '@/lib/markdown/flatten-md-blocks'
import { parseMd } from '@/lib/markdown/parse-md'
import { getDescription } from '@/lib/markdown/utils'
import { getDayTimestamp } from '@/lib/today-timestamp'
import { getUrlComponents } from '@/lib/url'

export function createSummary({
  id: summaryId,
  isPublic = false,
  md,
  pageTitle,
  prompt,
  url,
  userId,
}: {
  id: string
  isPublic?: boolean
  md: string
  pageTitle: string
  prompt?: string
  url: string
  userId: string
}) {
  const { domain, baseUrl, name: siteName } = getUrlComponents(url)
  const description = getDescription(md)
  const mdBlocks = parseMd(md)
  const { trees, blocks, topics } = flattenParsedMd(mdBlocks)
  const now = new Date()
  const dayCreated = getDayTimestamp(now)

  const siteTx = tx.sites[lookup('url', baseUrl)].update({
    domain,
    name: siteName,
  })

  const topicTxs = topics.map((topic) => {
    const name = topic.toLowerCase()
    return tx.topics[lookup('name', name)].update({
      label: name,
      lastReferenced: now.getTime(),
      users: userId,
    })
  })

  const treeTxs = trees.map(({ parentId, blockId, path, id, topic }) => {
    return tx.trees[id]
      .update({
        isPublic,
        context: description,
        dayCreated,
        path,
      })
      .link({
        topic: lookup('name', topic.toLowerCase()),
        user: userId,
        block: blockId,
        summary: summaryId,
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
    siteTx,
    tx.summaries[summaryId]
      .update({
        description,
        pageTitle,
        prompt: prompt || 'Summarize this page',
        title: trees[0].topic,
        isPublic,
        url,
      })
      .link({
        user: userId,
        rootBlock: mdBlocks[0].id,
        site: lookup('url', baseUrl),
      }),
    ...topicTxs,
    ...treeTxs,
    ...blockTxs,
  ])
}

export function shareSummary(summaryId: string) {
  db.transact([tx.summaries[summaryId].update({ isShared: true })])
}
