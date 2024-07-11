export interface Block {
  id: string
  children?: Block[]
  order: number
  parent?: Block
  text: string
  tree?: Tree
  type: 'block' | 'tree' | 'topic' | 'url'
  user?: User
}

export interface Topic {
  id: string
  children?: Topic[] | null
  createdAt: number
  label: string
  name: string
  parents?: Topic[]
  trees?: Tree[]
  users?: User[]
  blocks?: Block[]
}

export interface Tree {
  id: string
  isPublic?: boolean
  path: string
  topic?: Topic
  blocks?: Block[]
  user?: User
}

export interface User {
  id: string
  apiKey: string
  blocks?: Block[]
  handle: string
  topics?: Topic[]
  trees?: Tree[]
}

export type DbSchema = {
  blocks: Block
  topics: Topic
  trees: Tree
  users: User
}
