import { tx } from '@instantdb/react'

import { db } from '@/db'

export function createOrUpdateUser({
  id,
  handle,
  apiKey,
}: {
  id: string
  handle: string
  apiKey: string
}) {
  db.transact([
    tx.users[id].update({
      handle,
      apiKey,
    }),
  ])
}

