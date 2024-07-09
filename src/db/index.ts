import { init } from '@instantdb/react'

import type { DbSchema } from './types'

// ID for app: mettatate-hackathon
const APP_ID = '4db3a9bf-dca6-46cc-acb0-62af5f834da8'

// TODO: not a great place for this, but needs to be called before app initialization
export const db = init<DbSchema>({ appId: APP_ID })
