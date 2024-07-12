export interface Block {
  id: string
  children?: Block[]
  order: number
  parent?: Block
  text: string
  tree?: Tree
  type: 'block' | 'tree'
  user?: User
}

export interface Summary {
  id: string
  description: string
  // TODO: move these to DB object or create topics for them?
  domainName: string
  domainPath: string
  isPublic: boolean
  pageTitle: string
  prompt?: string
  rootBlockId: string
  url: string
  user: User
}

export interface Topic {
  id: string
  label: string
  lastReferenced: number
  name: string
  trees?: Tree[]
  users?: User[]
}

/**
 * a type of reference to a topic
 */
export interface Tree {
  id: string
  block?: Block
  children?: Tree[]
  isPublic?: boolean
  parents?: Tree[]
  path: string
  topic?: Topic
  user?: User
}

export interface User {
  id: string
  apiKey: string
  blocks?: Block[]
  handle: string
  summaries?: Summary[]
  topics?: Topic[]
  trees?: Tree[]
}

export type DbSchema = {
  blocks: Block
  summaries: Summary
  topics: Topic
  trees: Tree
  users: User
}
