import { id } from '@instantdb/react'

import type { Block } from '@/db/types'
import type { FlatMdBlock, MdBlock, MdBlockType, MdBlockWithId } from './types'

export function assignMdBlockIds(blocks: MdBlock[]): MdBlockWithId[] {
  function assignIdRecursively(
    block: MdBlock,
    parentId: string | null
  ): MdBlockWithId {
    const newId = id()
    const blockWithId: MdBlockWithId = {
      ...block,
      id: newId,
      parentId,
      children: block.children.map((child) =>
        assignIdRecursively(child, newId)
      ),
    }
    return blockWithId
  }

  return blocks.map((block) => assignIdRecursively(block, null))
}

export function flattenMdBlocks(blocks: MdBlockWithId[]): FlatMdBlock[] {
  const flatBlocks: FlatMdBlock[] = []

  function flatten(block: MdBlockWithId) {
    const { children, ...flatBlock } = block
    flatBlocks.push(flatBlock)

    for (const child of children) {
      flatten(child)
    }
  }

  for (const block of blocks) {
    flatten(block)
  }

  return flatBlocks
}

export function createMarkdownFromBlocks(
  rootBlock: MdBlock | MdBlockWithId | Block
): string {
  function buildMarkdown(block: MdBlock | MdBlockWithId | Block): string {
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
