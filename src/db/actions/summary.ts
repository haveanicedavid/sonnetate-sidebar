import { tx, id as uuid } from '@instantdb/react'

import { db } from '@/db'

export function createSummary({ md }: { md: string }) {
  db.transact([
    tx.summaries[uuid()].update({
    }),
  ])
}
