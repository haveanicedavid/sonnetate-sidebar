import type { Block } from '@/db/types'

import type { MdBlock } from './types'

export function blockToMd(
  input?: MdBlock | Block | (MdBlock | Block)[]
): string {
  if (!input) {
    console.warn('No input provided to blockToMd')
    return ''
  }

  function buildMarkdown(block: MdBlock | Block): string {
    let markdown = block?.text || ''

    if (block.children && block.children.length > 0) {
      const sortedChildren = [...block.children].sort(
        (a, b) => a.order - b.order
      )

      for (const child of sortedChildren) {
        markdown += '\n\n' + buildMarkdown(child)
      }
    }

    return markdown
  }

  if (Array.isArray(input)) {
    const sortedBlocks = [...input].sort((a, b) => a.order - b.order)
    return sortedBlocks
      .map((block) => buildMarkdown(block))
      .join('\n\n')
      .trim()
  } else {
    return buildMarkdown(input).trim()
  }
}
