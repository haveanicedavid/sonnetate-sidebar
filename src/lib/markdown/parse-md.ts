import { id } from '@instantdb/react'
import { groupBy } from 'remeda'

import type { MdBlock, MdBlockType } from './types'
import { getBlockType, getHeadingLevel } from './utils'

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

function extractWikilinkContent(text: string): { path: string; topic: string } {
  const match = text.match(/\[\[(.*?)\]\]/)
  if (match) {
    const content = match[1]
    const parts = content.split('|')
    const path = parts[0]
    const pathParts = path.split('/')
    const topic = parts[1] || pathParts[pathParts.length - 1]
    return { path, topic }
  }
  return { path: '', topic: '' }
}

export function parseMd(markdown: string): MdBlock[] {
  const trimmedMarkdown = markdown.trim()

  if (trimmedMarkdown === '') {
    return []
  }

  const lines = trimmedMarkdown.split('\n')
  const textWithDocIndex: { text: string; docIndex: number }[] = []
  let currentBlock = ''
  let currentDocIndex = 0

  lines.forEach((line, index) => {
    if (line.trim() === '') {
      if (currentBlock.trim() !== '') {
        textWithDocIndex.push({ text: currentBlock.trim(), docIndex: currentDocIndex })
        currentBlock = ''
        currentDocIndex = index + 1
      }
    } else {
      if (currentBlock === '' || getBlockType(line) === 'heading') {
        if (currentBlock !== '') {
          textWithDocIndex.push({ text: currentBlock.trim(), docIndex: currentDocIndex })
        }
        currentBlock = line
        currentDocIndex = index
      } else {
        currentBlock += '\n' + line
      }
    }
  })

  if (currentBlock.trim() !== '') {
    textWithDocIndex.push({ text: currentBlock.trim(), docIndex: currentDocIndex })
  }

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
