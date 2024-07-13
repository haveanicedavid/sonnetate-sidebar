export interface Block {
  id: string
  order: number
  text: string
  tree?: Tree
  type: string
  children?: Block[]
  parent?: Block
  user?: User
}

export interface Summary {
  id: string
  dayCreated: number
  description: string
  isPublic: boolean
  pageTitle: string
  prompt?: string
  site: Site[]
  title: string
  url: string
  rootBlock: Block[]
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
  context: string
  dayCreated: number
  isPublic?: boolean
  path: string
  block?: Block[]
  children?: Tree[]
  parents?: Tree[]
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
  handle: string
  blocks?: Block[]
  sites?: Site[]
  summaries?: Summary[]
  topics?: Topic[]
  trees?: Tree[]
}

export type DbSchema = {
  blocks: Block
  summaries: Summary
  sites: Site
  topics: Topic
  trees: Tree
  users: User
}
