import type { Block, BlockType } from './types'
import { getBlockType, getHeadingLevel } from './utils'
import { groupBy } from 'remeda'

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
  const textWithDocIndex: { text: string; docIndex: number }[] = markdown
    .split('\n\n')
    .map((text, index) => {
      return { text, docIndex: index }
    })

  /**
   * Key represents the depth of the heading, where 0 represents the root level.
   * Value represents the docIndex of the parent heading.
   */
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

  // represents root level
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

  return []
}
