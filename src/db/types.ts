type BlockType = 'block' | 'topic'

export interface Block {
  children: Block[]
  id: string
  order: number
  parent: Block
  text: string
  type: BlockType
  tree: Tree
}

export interface Tree {
  id: string
  topic: Topic
  up: Tree | null
  down: Tree[] | null
}

export interface Topic {
  id: string
  name: string
  meta: Topic | null
  subtopics: Topic[] | null
}


export interface Summary {
  id: string
  blocks: Block[]
  topics: Topic[]
  createdAt: number
  subject: string
}
