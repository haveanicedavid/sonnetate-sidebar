import { id, tx } from '@instantdb/react'

import { db } from '@/db'

export function signUpUser(handle: string, password: string) {
  db.transact([
    tx.users[id()].update({
      handle,
      password,
    }),
  ])
}
