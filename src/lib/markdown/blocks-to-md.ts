import type { Block } from '@/db/types'

import type { MdBlock } from './types'

export function blockToMd(rootBlock: MdBlock | Block): string {
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

  return buildMarkdown(rootBlock).trim()
}
