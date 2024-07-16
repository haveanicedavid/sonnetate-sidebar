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

/**
 * extract the description / paragraph under first heading from a markdown string
 * Could grab from `MdBlock` in future
 */
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

export function extractWikilinkContent(text: string): {
  path: string
  topic: string
} {
  const match = text.match(/\[\[(.*?)\]\]/)
  if (match) {
    const content = match[1]
    const parts = content.split('|')
    const rawPath = parts[0]

    // Split on one or more forward slashes and filter out empty strings
    const pathParts = rawPath.split(/\/+/).filter(Boolean)

    const path = pathParts.join('/')
    const topic = parts[1] || pathParts[pathParts.length - 1]

    return { path, topic }
  }
  return { path: '', topic: '' }
}
export function ensureHeadingSeparation(markdown: string): string {
  const lines = markdown.split('\n')
  const processedLines: string[] = []
  let lastLineWasHeading = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isHeading = getBlockType(line) === 'heading'

    if (
      isHeading &&
      !lastLineWasHeading &&
      processedLines.length > 0 &&
      processedLines[processedLines.length - 1] !== ''
    ) {
      processedLines.push('')
    }

    processedLines.push(line)

    if (isHeading && i < lines.length - 1 && lines[i + 1].trim() !== '') {
      processedLines.push('')
    }

    lastLineWasHeading = isHeading
  }

  // Remove any extra newlines at the start and end of the document
  while (processedLines[0] === '') processedLines.shift()
  while (processedLines[processedLines.length - 1] === '') processedLines.pop()

  return processedLines.join('\n')
}
