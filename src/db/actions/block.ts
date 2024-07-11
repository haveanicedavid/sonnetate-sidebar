import { id, tx } from '@instantdb/react'

import { db } from '@/db'

export function createUrlBlock({ url, title }: { url: string; title: string }) {
  const urlId = id()
  db.transact([
    tx.blocks[urlId].update({
    }),
  ])
}
