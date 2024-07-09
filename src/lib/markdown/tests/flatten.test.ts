import { describe, expect, test, vi } from 'vitest'

import { FlatMdBlock, MdBlock } from '../types'
import { assignIds, flattenMdBlocks } from '../utils'

// Mock the id() function from InstantDB
vi.mock('@instantdb/react', () => ({
  id: vi
    .fn()
    .mockReturnValueOnce('id1')
    .mockReturnValueOnce('id2')
    .mockReturnValueOnce('id3')
    .mockReturnValueOnce('id4'),
}))

describe('flattenMdBlocks', () => {
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

    const blocksWithIds = assignIds(inputBlocks)
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
