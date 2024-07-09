import type { BlockType } from './types'

export function getBlockType(text: string): BlockType {
  const firstLine = text.split('\n')[0]

  if (firstLine.startsWith('#')) return 'heading'
  if (firstLine.startsWith('- [ ] ') || firstLine.startsWith('- [x] '))
    return 'task-list'
  if (firstLine.startsWith('- ') || firstLine.startsWith('* '))
    return 'unordered-list'
  if (/^\d+\.\s/.test(firstLine)) return 'ordered-list'
  if (firstLine.startsWith('>')) return 'blockquote'
  if (firstLine.startsWith('```')) return 'codeblock'
  if (firstLine.startsWith('![')) return 'image'
  return 'paragraph'
}

export function getHeadingLevel(text: string): number {
  const match = text.match(/^(#{1,6})\s/)
  return match ? match[1].length : 0
}
