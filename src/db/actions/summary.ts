import { lookup, tx } from '@instantdb/react'

import { db } from '@/db'
import { getDayTimestamp } from '@/lib/date'
import { flattenParsedMd } from '@/lib/markdown/flatten-md-blocks'
import { mdToBlocks } from '@/lib/markdown/md-to-blocks'
import { getDescription } from '@/lib/markdown/utils'
import { getUrlComponents } from '@/lib/url'

export function createSummary({
  id: summaryId,
  isPublic = false,
  md,
  pageTitle,
  prompt,
  url,
  userId,
  createdOn,
}: {
  id: string
  isPublic?: boolean
  md: string
  pageTitle: string
  prompt?: string
  url: string
  userId: string
  createdOn?: number // for stub data
}) {
  const { domain, baseUrl, name: siteName } = getUrlComponents(url)
  const description = getDescription(md)
  const mdBlocks = mdToBlocks(md)
  const { trees, blocks, topics } = flattenParsedMd(mdBlocks)
  const now = new Date()
  const dayCreated = createdOn || getDayTimestamp(now)

  const siteTx = tx.sites[lookup('url', baseUrl)]
    .update({
      domain,
      name: siteName,
      lastReferenced: now.getTime(),
    })
    .link({
      users: userId,
    })

  const topicTxs = topics.map(({ name, parentName, label }) => {
    return tx.topics[lookup('name', name)]
      .update({
        label,
        lastReferenced: now.getTime(),
      })
      .link({
        users: userId,
        ...(parentName ? { parents: lookup('name', parentName) } : {}),
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
        ...(parentId ? { parent: parentId } : {}),
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
        dayCreated,
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
