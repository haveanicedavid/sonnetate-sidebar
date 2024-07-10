import { init } from '@instantdb/react'

import type { DbSchema } from './types'

// ID for app: sonnetate
const APP_ID = '498c8e19-4219-457a-b906-3dbab509878a'

export const db = init<DbSchema>({ appId: APP_ID })
