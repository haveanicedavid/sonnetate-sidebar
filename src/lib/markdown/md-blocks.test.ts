import * as InstantDB from '@instantdb/react'
import { describe, expect, test, vi } from 'vitest'

import {
  assignMdBlockIds,
  createMarkdownFromBlocks,
  flattenMdBlocks,
} from './md-blocks'
import type { FlatMdBlock, MdBlock, MdBlockWithId } from './types'

describe('assignIds', () => {
  vi.spyOn(InstantDB, 'id')
    .mockReturnValueOnce('id1')
    .mockReturnValueOnce('id2')
    .mockReturnValueOnce('id3')
    .mockReturnValueOnce('id4')
    .mockReturnValueOnce('id5')

  test('assigns unique ids and parentIds to all blocks and their children', () => {
    const inputBlocks: MdBlock[] = [
      {
        text: '# Header 1',
        type: 'heading',
        tree: '',
        children: [
          {
            text: 'Paragraph 1',
            type: 'paragraph',
            tree: 'Header 1',
            children: [],
            order: 0,
          },
          {
            text: '## Subheader',
            type: 'heading',
            tree: 'Header 1',
            children: [
              {
                text: 'Paragraph 2',
                type: 'paragraph',
                tree: 'Header 1/Subheader',
                children: [],
                order: 0,
              },
            ],
            order: 1,
          },
        ],
        order: 0,
      },
    ]

    const result = assignMdBlockIds(inputBlocks)

    const expectedOutput: MdBlockWithId[] = [
      {
        id: 'id1',
        parentId: null,
        text: '# Header 1',
        type: 'heading',
        tree: '',
        children: [
          {
            id: 'id2',
            parentId: 'id1',
            text: 'Paragraph 1',
            type: 'paragraph',
            tree: 'Header 1',
            children: [],
            order: 0,
          },
          {
            id: 'id3',
            parentId: 'id1',
            text: '## Subheader',
            type: 'heading',
            tree: 'Header 1',
            children: [
              {
                id: 'id4',
                parentId: 'id3',
                text: 'Paragraph 2',
                type: 'paragraph',
                tree: 'Header 1/Subheader',
                children: [],
                order: 0,
              },
            ],
            order: 1,
          },
        ],
        order: 0,
      },
    ]

    expect(result).toEqual(expectedOutput)
  })

  test('handles empty input', () => {
    expect(assignMdBlockIds([])).toEqual([])
  })
})

describe('createMarkdownFromBlocks', () => {
  test('creates markdown string from nested blocks with proper spacing', () => {
    const rootBlock: MdBlock = {
      text: '# Root Header',
      type: 'heading',
      tree: '',
      order: 0,
      children: [
        {
          text: 'First paragraph',
          type: 'paragraph',
          tree: 'Root Header',
          order: 1,
          children: [],
        },
        {
          text: '## Subheader',
          type: 'heading',
          tree: 'Root Header',
          order: 2,
          children: [
            {
              text: 'Nested paragraph',
              type: 'paragraph',
              tree: 'Root Header/Subheader',
              order: 0,
              children: [],
            },
          ],
        },
        {
          text: 'Last paragraph',
          type: 'paragraph',
          tree: 'Root Header',
          order: 3,
          children: [],
        },
      ],
    }

    const result = createMarkdownFromBlocks(rootBlock)

    const expectedMarkdown = `# Root Header

First paragraph

## Subheader

Nested paragraph

Last paragraph`

    expect(result).toBe(expectedMarkdown)
  })

  test('handles blocks with no children', () => {
    const singleBlock: MdBlock = {
      text: 'Single paragraph',
      type: 'paragraph',
      tree: '',
      order: 0,
      children: [],
    }

    const result = createMarkdownFromBlocks(singleBlock)

    expect(result).toBe('Single paragraph')
  })

  test('sorts children by order and maintains proper spacing', () => {
    const rootBlock: MdBlock = {
      text: '# Root',
      type: 'heading',
      tree: '',
      order: 0,
      children: [
        {
          text: 'Third',
          type: 'paragraph',
          tree: 'Root',
          order: 2,
          children: [],
        },
        {
          text: 'First',
          type: 'paragraph',
          tree: 'Root',
          order: 0,
          children: [],
        },
        {
          text: 'Second',
          type: 'paragraph',
          tree: 'Root',
          order: 1,
          children: [],
        },
      ],
    }

    const result = createMarkdownFromBlocks(rootBlock)

    const expectedMarkdown = `# Root

First

Second

Third`

    expect(result).toBe(expectedMarkdown)
  })
})

describe('flattenMdBlocks', () => {
  vi.spyOn(InstantDB, 'id')
    .mockReturnValueOnce('id1')
    .mockReturnValueOnce('id2')
    .mockReturnValueOnce('id3')
    .mockReturnValueOnce('id4')

  test('flattens nested MdBlockWithId structure', () => {
    const inputBlocks: MdBlock[] = [
      {
        text: '# Header 1',
        type: 'heading',
        tree: '',
        children: [
          {
            text: 'Paragraph 1',
            type: 'paragraph',
            tree: 'Header 1',
            children: [],
            order: 0,
          },
          {
            text: '## Subheader',
            type: 'heading',
            tree: 'Header 1',
            children: [
              {
                text: 'Paragraph 2',
                type: 'paragraph',
                tree: 'Header 1/Subheader',
                children: [],
                order: 0,
              },
            ],
            order: 1,
          },
        ],
        order: 0,
      },
    ]

    const blocksWithIds = assignMdBlockIds(inputBlocks)
    const result = flattenMdBlocks(blocksWithIds)

    const expectedOutput: FlatMdBlock[] = [
      {
        id: 'id1',
        parentId: null,
        text: '# Header 1',
        type: 'heading',
        tree: '',
        order: 0,
      },
      {
        id: 'id2',
        parentId: 'id1',
        text: 'Paragraph 1',
        type: 'paragraph',
        tree: 'Header 1',
        order: 0,
      },
      {
        id: 'id3',
        parentId: 'id1',
        text: '## Subheader',
        type: 'heading',
        tree: 'Header 1',
        order: 1,
      },
      {
        id: 'id4',
        parentId: 'id3',
        text: 'Paragraph 2',
        type: 'paragraph',
        tree: 'Header 1/Subheader',
        order: 0,
      },
    ]

    expect(result).toEqual(expectedOutput)
  })

  test('handles empty input', () => {
    expect(flattenMdBlocks([])).toEqual([])
  })
})
