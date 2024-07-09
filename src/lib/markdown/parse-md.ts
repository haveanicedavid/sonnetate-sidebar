import { groupBy } from 'remeda'

import type { MdBlock, MdBlockType } from './types'
import { getBlockType, getHeadingLevel } from './utils'

interface Chunk {
  text: string
  type: MdBlockType
  parentIndex: number
  docIndex: number
  tree: string
}

interface OrderedChunk extends Chunk {
  order: number
}

type ChildMap = { [headerId: number]: number[] }

type OrderedChunkByIndex = { [docIndex: number]: OrderedChunk }

function extractWikilinkContent(text: string): string {
  const match = text.match(/\[\[(.*?)\]\]/)
  if (match) {
    const content = match[1]
    const parts = content.split('|')
    return parts[0] // Return the lowercase path part, ignoring the alias if present
  }
  return ''
}

export function parseMd(markdown: string): MdBlock[] {
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
  let currTree: string[] = []

  const basicBlocks: Chunk[] = textWithDocIndex.map(({ text, docIndex }) => {
    const type = getBlockType(text)
    let parentIndex = headerIndexByDepth[currDepth]
    let tree = currTree.join('/')

    if (type === 'heading') {
      const headingDepth = getHeadingLevel(text)
      parentIndex = headerIndexByDepth[headingDepth - 1]
      currDepth = headingDepth

      const wikilinkContent = extractWikilinkContent(text)
      const pathParts = wikilinkContent.split('/')
      currTree = pathParts.slice(0, headingDepth)

      tree = currTree.slice(0, -1).join('/')

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
      tree,
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

  function buildNestedStructure(parentIndex: number): MdBlock[] {
    const children = childrenByParentIndex[parentIndex] || []
    return children.map((childIndex) => {
      const block = orderedBlocksByIndex[childIndex]
      return {
        text: block.text,
        type: block.type,
        tree: block.tree,
        children: buildNestedStructure(childIndex),
        order: block.order,
      }
    })
  }

  return buildNestedStructure(-1)
}
