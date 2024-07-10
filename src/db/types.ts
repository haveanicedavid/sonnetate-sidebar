type BlockType = 'block' | 'tree'

export type DbSchema = {
  blocks: Block
  summaries: Summary
  topics: Topic
  trees: Tree
  users: User
}

export interface Block {
  id: string
  children: Block[]
  order: number
  parent: Block
  summary: Summary
  text: string
  type: BlockType
  tree: Tree
  user: User
}

export interface Summary {
  id: string
  blocks?: Block[]
  topicName: string
  trees?: Tree[]
  createdAt: number
  for: string
  description: string
  user?: User
}

export interface Topic {
  id: string
  name: string
  label: string
  parents: Topic[] | null
  children: Topic[] | null
  trees: Tree[]
  summaries: Summary[]
  users: User[]
}

export interface Tree {
  id: string
  topics: Topic[]
  blocks: Block[]
  user: User
}

export interface User {
  id: string
  // blocks: Block[]
  handle: string
  apiKey: string
  // summaries: Summary[]
  // topics: Topic[]
  // trees: Tree[]
}
