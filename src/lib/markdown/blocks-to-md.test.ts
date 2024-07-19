import { describe, expect, test } from 'vitest'

import { blockToMd } from './blocks-to-md'
import type { MdBlock } from './types'

describe('blockToMd', () => {
  test('creates markdown string from nested blocks with proper spacing', () => {
    const rootBlock: MdBlock = {
      id: 'id1',
      text: '# Root Header',
      type: 'heading',
      tree: {
        path: 'Root Header',
        topic: 'Root Header',
        parentId: null,
        id: 'tree1',
      },
      parentId: 'root',
      order: 0,
      children: [
        {
          id: 'id2',
          text: 'First paragraph',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          order: 1,
          children: [],
        },
        {
          id: 'id3',
          text: '## Subheader',
          type: 'heading',
          tree: {
            path: 'Root Header/Subheader',
            topic: 'Subheader',
            parentId: 'tree1',
            id: 'tree2',
          },
          parentId: 'id1',
          order: 2,
          children: [
            {
              id: 'id4',
              text: 'Nested paragraph',
              type: 'paragraph',
              tree: null,
              parentId: 'id3',
              order: 0,
              children: [],
            },
          ],
        },
        {
          id: 'id5',
          text: 'Last paragraph',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          order: 3,
          children: [],
        },
      ],
    }

    const result = blockToMd(rootBlock)

    const expectedMarkdown = `# Root Header

First paragraph

## Subheader

Nested paragraph

Last paragraph`

    expect(result).toBe(expectedMarkdown)
  })

  test('handles blocks with no children', () => {
    const singleBlock: MdBlock = {
      id: 'id1',
      text: 'Single paragraph',
      type: 'paragraph',
      tree: null,
      parentId: 'root',
      order: 0,
      children: [],
    }

    const result = blockToMd(singleBlock)

    expect(result).toBe('Single paragraph')
  })

  test('sorts children by order and maintains proper spacing', () => {
    const rootBlock: MdBlock = {
      id: 'id1',
      text: '# Root',
      type: 'heading',
      tree: {
        path: 'Root',
        topic: 'Root',
        parentId: null,
        id: 'tree1',
      },
      parentId: 'root',
      order: 0,
      children: [
        {
          id: 'id2',
          text: 'Third',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          order: 2,
          children: [],
        },
        {
          id: 'id3',
          text: 'First',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          order: 0,
          children: [],
        },
        {
          id: 'id4',
          text: 'Second',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          order: 1,
          children: [],
        },
      ],
    }

    const result = blockToMd(rootBlock)

    const expectedMarkdown = `# Root

First

Second

Third`

    expect(result).toBe(expectedMarkdown)
  })

  test('handles an array of blocks', () => {
    const blocks: MdBlock[] = [
      {
        id: 'id1',
        text: '# First Header',
        type: 'heading',
        tree: null,
        parentId: 'root',
        order: 0,
        children: [],
      },
      {
        id: 'id2',
        text: 'First paragraph',
        type: 'paragraph',
        tree: null,
        parentId: 'root',
        order: 1,
        children: [],
      },
      {
        id: 'id3',
        text: '## Second Header',
        type: 'heading',
        tree: null,
        parentId: 'root',
        order: 2,
        children: [],
      },
    ]

    const result = blockToMd(blocks)

    const expectedMarkdown = `# First Header

First paragraph

## Second Header`

    expect(result).toBe(expectedMarkdown)
  })

  test('handles an array of blocks with different orders', () => {
    const blocks: MdBlock[] = [
      {
        id: 'id2',
        text: 'Second paragraph',
        type: 'paragraph',
        tree: null,
        parentId: 'root',
        order: 1,
        children: [],
      },
      {
        id: 'id1',
        text: '# First Header',
        type: 'heading',
        tree: null,
        parentId: 'root',
        order: 0,
        children: [],
      },
      {
        id: 'id3',
        text: '## Third Header',
        type: 'heading',
        tree: null,
        parentId: 'root',
        order: 2,
        children: [],
      },
    ]

    const result = blockToMd(blocks)

    const expectedMarkdown = `# First Header

Second paragraph

## Third Header`

    expect(result).toBe(expectedMarkdown)
  })
})
