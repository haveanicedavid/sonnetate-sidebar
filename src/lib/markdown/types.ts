export type MdBlockType =
  | 'heading'
  | 'paragraph'
  | 'ordered-list'
  | 'unordered-list'
  | 'task-list'
  | 'blockquote'
  | 'codeblock'
  | 'image'

export interface TreeInfo {
  path: string
  topic: string
  parentId: string | null
  id: string
}

export interface MdBlock {
  id: string
  text: string
  type: MdBlockType
  tree: TreeInfo | null
  parentId: string | null
  children: MdBlock[]
  order: number
}

export type BlockSeed = Omit<MdBlock, 'children' | 'tree'> & {
  treeId: string | null
}

export interface TreeSeed extends TreeInfo {
  blockId: string
}
