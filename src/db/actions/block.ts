import { tx, id as uuid } from '@instantdb/react'

import { db } from '@/db'

export function createBlock({
  id,
  handle,
  apiKey,
}: {
  id?: string
  handle: string
  apiKey: string
}) {
  const _id = id || uuid()
  db.transact([
    tx.blocks[_id].update({
      handle,
      apiKey,
    }),
  ])
}
