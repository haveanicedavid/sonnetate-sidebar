import type { MdBlockType } from './types'

export function getBlockType(text: string): MdBlockType {
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

export function getDescription(markdown: string): string {
  const lines = markdown.split('\n')
  const firstHeaderIndex = lines.findIndex((line) => line.startsWith('#'))

  if (firstHeaderIndex === -1 || firstHeaderIndex === lines.length - 1) {
    return ''
  }

  const contentAfterHeader = lines.slice(firstHeaderIndex + 1)
  const nextHeaderIndex = contentAfterHeader.findIndex((line) =>
    line.startsWith('#')
  )

  if (nextHeaderIndex === -1) {
    return contentAfterHeader.join('\n').trim()
  }

  return contentAfterHeader.slice(0, nextHeaderIndex).join('\n').trim()
}
