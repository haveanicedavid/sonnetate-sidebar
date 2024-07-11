import * as InstantDB from '@instantdb/react'
import { describe, expect, test, vi } from 'vitest'

import { createTopicTree, flattenTopicTree } from './md-trees'

describe('createTopicTree and flattenTopicTree', () => {
  vi.spyOn(InstantDB, 'id')
    .mockReturnValueOnce('tree1')
    .mockReturnValueOnce('tree2')
    .mockReturnValueOnce('tree3')
    .mockReturnValueOnce('tree4')
    .mockReturnValueOnce('tree5')
    .mockReturnValueOnce('tree6')
    .mockReturnValueOnce('tree7')

  test('creates tree structure with treeIds and flattens it correctly', () => {
    const trees = [
      'Topic 1/Subtopic 1/Subsubtopic 1',
      'Topic 1/Subtopic 2',
      'Topic 2/Subtopic 3',
      'Topic 3',
    ]

    const topicTree = createTopicTree(trees)
    const flattenedTree = flattenTopicTree(topicTree)

    // Check the nested structure
    expect(topicTree).toEqual([
      {
        treeId: 'tree1',
        parentTreeId: null,
        label: 'Topic 1',
        children: [
          {
            treeId: 'tree2',
            parentTreeId: 'tree1',
            label: 'Subtopic 1',
            children: [
              {
                treeId: 'tree3',
                parentTreeId: 'tree2',
                label: 'Subsubtopic 1',
                children: [],
              },
            ],
          },
          {
            treeId: 'tree4',
            parentTreeId: 'tree1',
            label: 'Subtopic 2',
            children: [],
          },
        ],
      },
      {
        treeId: 'tree5',
        parentTreeId: null,
        label: 'Topic 2',
        children: [
          {
            treeId: 'tree6',
            parentTreeId: 'tree5',
            label: 'Subtopic 3',
            children: [],
          },
        ],
      },
      {
        treeId: 'tree7',
        parentTreeId: null,
        label: 'Topic 3',
        children: [],
      },
    ])

    // Check the flattened structure
    expect(flattenedTree).toEqual([
      { treeId: 'tree1', parentTreeId: null, label: 'Topic 1' },
      { treeId: 'tree2', parentTreeId: 'tree1', label: 'Subtopic 1' },
      { treeId: 'tree3', parentTreeId: 'tree2', label: 'Subsubtopic 1' },
      { treeId: 'tree4', parentTreeId: 'tree1', label: 'Subtopic 2' },
      { treeId: 'tree5', parentTreeId: null, label: 'Topic 2' },
      { treeId: 'tree6', parentTreeId: 'tree5', label: 'Subtopic 3' },
      { treeId: 'tree7', parentTreeId: null, label: 'Topic 3' },
    ])
  })

  test('handles empty input', () => {
    const topicTree = createTopicTree([])
    const flattenedTree = flattenTopicTree(topicTree)

    expect(topicTree).toEqual([])
    expect(flattenedTree).toEqual([])
  })
})
