export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'ordered-list'
  | 'unordered-list'
  | 'task-list'
  | 'blockquote'
  | 'codeblock'
  | 'image'

export interface Block {
  text: string
  type: BlockType
  children: Block[]
  order: number
}
