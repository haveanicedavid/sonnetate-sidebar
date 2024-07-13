import type { Block } from '@/db/types'

import type { MdBlock } from './types'

export function blockToMd(
  rootBlock: MdBlock | Block,
  removeTitle?: boolean
): string {
  const _rootBlock = removeTitle ? { ...rootBlock, text: '' } : rootBlock
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

  return buildMarkdown(_rootBlock).trim()
}
