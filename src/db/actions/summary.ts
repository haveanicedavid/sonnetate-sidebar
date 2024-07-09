import { tx, id } from '@instantdb/react'

import { db } from '@/db'
import { parseMd } from '@/lib/markdown/parse-md'

export function createSummary({ md }: { md: string }) {
  const mdBlocks = parseMd(md)
  db.transact([
    tx.summaries[id()].update({
    }),
  ])
}
