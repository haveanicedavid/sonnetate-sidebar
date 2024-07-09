export type MdBlockType =
  | 'heading'
  | 'paragraph'
  | 'ordered-list'
  | 'unordered-list'
  | 'task-list'
  | 'blockquote'
  | 'codeblock'
  | 'image'

export interface MdBlock {
  text: string
  type: MdBlockType
  tree: string
  children: MdBlock[]
  order: number
}

export interface MdBlockWithId extends MdBlock {
  id: string
  parentId: string | null
  children: MdBlockWithId[]
}

export interface FlatMdBlock extends Omit<MdBlockWithId, 'children'> {}
