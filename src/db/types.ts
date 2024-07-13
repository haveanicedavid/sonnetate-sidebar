export interface Block {
  id: string
  children?: Block[]
  order: number
  parent?: Block
  text: string
  tree?: Tree
  type: string
  user?: User
}

export interface Summary {
  id: string
  dayCreated: number
  description: string
  isPublic: boolean
  pageTitle: string
  prompt?: string
  rootBlock: Block
  site: Site[]
  title: string
  url: string
  user: User
}


interface Topic {
  id: string
  label: string
  lastReferenced: number
  name: string
  trees?: Tree[]
  users?: User[]
}

interface Tree {
  id: string
  block?: Block[]
  children?: Tree[]
  context: string
  dayCreated: number
  isPublic?: boolean
  parents?: Tree[]
  path: string
  summary?: Summary[]
  topic?: Topic
  user?: User
}

interface Site {
  id: string
  name: string
  domain: string
  url: string
  summaries: Summary[]
  users: User[]
}

export interface User {
  id: string
  apiKey: string
  blocks?: Block[]
  handle: string
  summaries?: Summary[]
  topics?: Topic[]
  trees?: Tree[]
  sites?: Site[]
}

export type DbSchema = {
  blocks: Block
  summaries: Summary
  sites: Site
  topics: Topic
  trees: Tree
  users: User
}
