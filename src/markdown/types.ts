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
  children: MdBlock[]
  order: number
}
