import { id } from '@instantdb/react'
import { groupBy } from 'remeda'

import type { MdBlock, MdBlockType } from './types'
import {
  ensureHeadingSeparation,
  extractWikilinkContent,
  getBlockType,
  getHeadingLevel,
} from './utils'

interface TreeInfo {
  path: string
  topic: string
  parentId: string | null
  id: string
}

interface Chunk {
  id: string
  text: string
  type: MdBlockType
  parentId: string
  docIndex: number
  tree: TreeInfo | null
}

interface OrderedChunk extends Chunk {
  order: number
}

type ChildMap = { [headerId: string]: string[] }

type OrderedChunkById = { [id: string]: OrderedChunk }

export function parseMd(markdown: string): MdBlock[] {
  const markdownWithSpacingEnsured = ensureHeadingSeparation(markdown.trim())

  if (markdownWithSpacingEnsured === '') {
    return []
  }

  const textWithDocIndex: { text: string; docIndex: number }[] =
    markdownWithSpacingEnsured
      .split(/\n{2,}/)
      .map((text, index) => ({ text: text.trim(), docIndex: index }))

  const headerIdByDepth: { [depth: number]: string } = {
    0: 'root',
    1: 'root',
    2: 'root',
    3: 'root',
    4: 'root',
    5: 'root',
    6: 'root',
  }

  const treeIdByDepth: { [depth: number]: string } = {
    0: 'root',
    1: 'root',
    2: 'root',
    3: 'root',
    4: 'root',
    5: 'root',
    6: 'root',
  }

  const childrenByParentId: ChildMap = {}
  const orderedBlocksById: OrderedChunkById = {}

  let currDepth = 0

  const basicBlocks: Chunk[] = textWithDocIndex.map(({ text, docIndex }) => {
    const type = getBlockType(text)
    const blockId = id()
    let parentId = headerIdByDepth[currDepth]
    let tree: TreeInfo | null = null

    if (type === 'heading') {
      const headingDepth = getHeadingLevel(text)
      parentId = headerIdByDepth[headingDepth - 1]
      currDepth = headingDepth

      const { path, topic } = extractWikilinkContent(text)
      const treeId = id()
      tree = {
        path,
        topic,
        parentId: headingDepth === 1 ? null : treeIdByDepth[headingDepth - 1],
        id: treeId,
      }

      for (const depth in headerIdByDepth) {
        if (parseInt(depth) >= headingDepth) {
          headerIdByDepth[depth] = blockId
        }
      }

      for (const depth in treeIdByDepth) {
        if (parseInt(depth) >= headingDepth) {
          treeIdByDepth[depth] = treeId
        }
      }
    }

    childrenByParentId[parentId] = childrenByParentId[parentId]
      ? [...childrenByParentId[parentId], blockId]
      : [blockId]

    return {
      id: blockId,
      text,
      type,
      parentId,
      docIndex,
      tree,
    }
  })

  const grouped = groupBy(basicBlocks, (block) => block.parentId)
  const blocksNoChildren: OrderedChunk[] = []
  for (const parentId in grouped) {
    grouped[parentId].forEach((block, i) => {
      const orderedBlock: OrderedChunk = {
        ...block,
        order: i,
      }
      orderedBlocksById[block.id] = orderedBlock
      blocksNoChildren.push(orderedBlock)
    })
  }

  blocksNoChildren.sort((a, b) => a.docIndex - b.docIndex)

  function buildNestedStructure(parentId: string): MdBlock[] {
    const children = childrenByParentId[parentId] || []
    return children.map((childId) => {
      const block = orderedBlocksById[childId]
      return {
        id: block.id,
        text: block.text,
        type: block.type,
        tree: block.tree,
        parentId: block.parentId,
        children: buildNestedStructure(childId),
        order: block.order,
      }
    })
  }

  return buildNestedStructure('root')
}
