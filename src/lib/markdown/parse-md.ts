import { groupBy } from 'remeda'

import type { Block, BlockType } from './types'
import { getBlockType, getHeadingLevel } from './utils'

interface Chunk {
  text: string
  type: BlockType
  parentIndex: number
  docIndex: number
}

interface OrderedChunk extends Chunk {
  order: number
}

type ChildMap = { [headerId: number]: number[] }

type OrderedChunkByIndex = { [docIndex: number]: OrderedChunk }

export function parseMd(markdown: string): Block[] {
  // Trim leading and trailing whitespace, and split by double newlines
  const textWithDocIndex: { text: string; docIndex: number }[] = markdown
    .trim()
    .split(/\n{2,}/)
    .map((text, index) => ({ text: text.trim(), docIndex: index }))

  const headerIndexByDepth: { [depth: number]: number } = {
    0: -1,
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
    6: -1,
  }

  const childrenByParentIndex: ChildMap = {}
  const orderedBlocksByIndex: OrderedChunkByIndex = {}

  let currDepth = 0

  const basicBlocks: Chunk[] = textWithDocIndex.map(({ text, docIndex }) => {
    const type = getBlockType(text)
    let parentIndex = headerIndexByDepth[currDepth]

    if (type === 'heading') {
      const headingDepth = getHeadingLevel(text)
      parentIndex = headerIndexByDepth[headingDepth - 1]
      currDepth = headingDepth

      for (const depth in headerIndexByDepth) {
        if (parseInt(depth) >= headingDepth) {
          headerIndexByDepth[depth] = docIndex
        }
      }
    }

    childrenByParentIndex[parentIndex] = childrenByParentIndex[parentIndex]
      ? [...childrenByParentIndex[parentIndex], docIndex]
      : [docIndex]

    return {
      text,
      type,
      docIndex,
      parentIndex,
    }
  })

  const grouped = groupBy(basicBlocks, (block) => block.parentIndex)
  const blocksNoChildren: OrderedChunk[] = []
  for (const parentId in grouped) {
    grouped[parentId].forEach((block, i) => {
      const orderedBlock: OrderedChunk = {
        ...block,
        order: i,
      }
      orderedBlocksByIndex[block.docIndex] = orderedBlock
      blocksNoChildren.push(orderedBlock)
    })
  }

  blocksNoChildren.sort((a, b) => a.docIndex - b.docIndex)

  function buildNestedStructure(parentIndex: number): Block[] {
    const children = childrenByParentIndex[parentIndex] || []
    return children.map((childIndex) => {
      const block = orderedBlocksByIndex[childIndex]
      return {
        text: block.text,
        type: block.type,
        children: buildNestedStructure(childIndex),
        order: block.order,
      }
    })
  }

  return buildNestedStructure(-1)
}
