import { describe, expect, test, vi } from 'vitest'

import { FlatMdBlock, MdBlock } from '../types'
import {
  type FlatTreeNode,
  assignIds,
  createTopicTree,
  flattenMdBlocks,
  flattenTopicTree,
} from '../utils'

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

describe('flattenTopicTree', () => {
  test('flattens nested topic tree structure', () => {
    const trees = [
      'Topic 1/Subtopic 1/Subsubtopic 1',
      'Topic 1/Subtopic 2',
      'Topic 2/Subtopic 3',
      'Topic 3',
    ]

    const topicTree = createTopicTree(trees)
    const result = flattenTopicTree(topicTree)

    const expectedOutput: FlatTreeNode[] = [
      { label: 'Topic 1', parent: null },
      { label: 'Subtopic 1', parent: 'Topic 1' },
      { label: 'Subsubtopic 1', parent: 'Subtopic 1' },
      { label: 'Subtopic 2', parent: 'Topic 1' },
      { label: 'Topic 2', parent: null },
      { label: 'Subtopic 3', parent: 'Topic 2' },
      { label: 'Topic 3', parent: null },
    ]

    expect(result).toEqual(expectedOutput)
  })

  test('handles empty input', () => {
    expect(flattenTopicTree([])).toEqual([])
  })

  test('handles single-level topics', () => {
    const trees = ['Topic A', 'Topic B', 'Topic C']
    const topicTree = createTopicTree(trees)
    const result = flattenTopicTree(topicTree)

    expect(result).toEqual([
      { label: 'Topic A', parent: null },
      { label: 'Topic B', parent: null },
      { label: 'Topic C', parent: null },
    ])
  })
})
