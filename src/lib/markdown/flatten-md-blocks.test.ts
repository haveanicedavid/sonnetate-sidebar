import { describe, expect, test } from 'vitest'

import { flattenParsedMd } from './flatten-md-blocks'
import type { MdBlock } from './types'

describe('flattenParsedMd', () => {
  test('flattens parsed markdown structure, extracts topics with labels and parent names, uses null for root parentId, and lowercases paths', () => {
    const parsedMd: MdBlock[] = [
      {
        id: 'id1',
        text: '# [[Header 1]]',
        type: 'heading',
        tree: {
          path: 'Header 1',
          topic: 'Header 1',
          parentId: null,
          id: 'tree1',
        },
        parentId: 'root',
        order: 0,
        children: [
          {
            id: 'id2',
            text: 'Paragraph 1',
            type: 'paragraph',
            tree: null,
            parentId: 'id1',
            order: 0,
            children: [],
          },
          {
            id: 'id3',
            text: '## [[Header 1/Subheader]]',
            type: 'heading',
            tree: {
              path: 'Header 1/Subheader',
              topic: 'Subheader',
              parentId: 'tree1',
              id: 'tree2',
            },
            parentId: 'id1',
            order: 1,
            children: [
              {
                id: 'id4',
                text: 'Paragraph 2',
                type: 'paragraph',
                tree: null,
                parentId: 'id3',
                order: 0,
                children: [],
              },
            ],
          },
        ],
      },
    ]

    const result = flattenParsedMd(parsedMd)

    expect(result).toEqual({
      blocks: [
        {
          id: 'id1',
          text: '# [[Header 1]]',
          type: 'heading',
          parentId: null,
          order: 0,
          treeId: 'tree1',
        },
        {
          id: 'id2',
          text: 'Paragraph 1',
          type: 'paragraph',
          parentId: 'id1',
          order: 0,
          treeId: null,
        },
        {
          id: 'id3',
          text: '## [[Header 1/Subheader]]',
          type: 'heading',
          parentId: 'id1',
          order: 1,
          treeId: 'tree2',
        },
        {
          id: 'id4',
          text: 'Paragraph 2',
          type: 'paragraph',
          parentId: 'id3',
          order: 0,
          treeId: null,
        },
      ],
      trees: [
        {
          path: 'header 1',
          topic: 'Header 1',
          parentId: null,
          id: 'tree1',
          blockId: 'id1',
        },
        {
          path: 'header 1/subheader',
          topic: 'Subheader',
          parentId: 'tree1',
          id: 'tree2',
          blockId: 'id3',
        },
      ],
      topics: [
        {
          name: 'header 1',
          label: 'Header 1',
          parentName: null,
          blockId: 'id1',
        },
        {
          name: 'subheader',
          label: 'Subheader',
          parentName: 'header 1',
          blockId: 'id3',
        },
      ],
    })
  })

  test('handles empty input', () => {
    const result = flattenParsedMd([])

    expect(result).toEqual({
      blocks: [],
      trees: [],
      topics: [],
    })
  })

  test('handles input with no trees', () => {
    const parsedMd: MdBlock[] = [
      {
        id: 'id1',
        text: 'Paragraph',
        type: 'paragraph',
        tree: null,
        parentId: 'root',
        order: 0,
        children: [],
      },
    ]

    const result = flattenParsedMd(parsedMd)

    expect(result).toEqual({
      blocks: [
        {
          id: 'id1',
          text: 'Paragraph',
          type: 'paragraph',
          parentId: null,
          order: 0,
          treeId: null,
        },
      ],
      trees: [],
      topics: [],
    })
  })

  test('correctly assigns parents and labels for deeply nested topics', () => {
    const parsedMd: MdBlock[] = [
      {
        id: 'id1',
        text: '# [[Root Topic]]',
        type: 'heading',
        tree: {
          path: 'Root Topic',
          topic: 'Root Topic',
          parentId: null,
          id: 'tree1',
        },
        parentId: 'root',
        order: 0,
        children: [
          {
            id: 'id2',
            text: '## [[Root Topic/Level 1]]',
            type: 'heading',
            tree: {
              path: 'Root Topic/Level 1',
              topic: 'Level 1',
              parentId: 'tree1',
              id: 'tree2',
            },
            parentId: 'id1',
            order: 0,
            children: [
              {
                id: 'id3',
                text: '### [[Root Topic/Level 1/Level 2A]]',
                type: 'heading',
                tree: {
                  path: 'Root Topic/Level 1/Level 2A',
                  topic: 'Level 2A',
                  parentId: 'tree2',
                  id: 'tree3',
                },
                parentId: 'id2',
                order: 0,
                children: [],
              },
              {
                id: 'id4',
                text: '### [[Root Topic/Level 1/Level 2B]]',
                type: 'heading',
                tree: {
                  path: 'Root Topic/Level 1/Level 2B',
                  topic: 'Level 2B',
                  parentId: 'tree2',
                  id: 'tree4',
                },
                parentId: 'id2',
                order: 1,
                children: [
                  {
                    id: 'id5',
                    text: '#### [[Root Topic/Level 1/Level 2B/Level 3]]',
                    type: 'heading',
                    tree: {
                      path: 'Root Topic/Level 1/Level 2B/Level 3',
                      topic: 'Level 3',
                      parentId: 'tree4',
                      id: 'tree5',
                    },
                    parentId: 'id4',
                    order: 0,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: 'id6',
            text: '## [[Root Topic/Another Level 1]]',
            type: 'heading',
            tree: {
              path: 'Root Topic/Another Level 1',
              topic: 'Another Level 1',
              parentId: 'tree1',
              id: 'tree6',
            },
            parentId: 'id1',
            order: 1,
            children: [],
          },
        ],
      },
    ]

    const result = flattenParsedMd(parsedMd)

    // Check if all blocks are present
    expect(result.blocks).toHaveLength(6)

    // Check if all trees are present
    expect(result.trees).toHaveLength(6)

    // Check if all topics are present and have correct parent names and labels
    expect(result.topics).toEqual([
      {
        name: 'root topic',
        label: 'Root Topic',
        parentName: null,
        blockId: 'id1',
      },
      {
        name: 'level 1',
        label: 'Level 1',
        parentName: 'root topic',
        blockId: 'id2',
      },
      {
        name: 'level 2a',
        label: 'Level 2A',
        parentName: 'level 1',
        blockId: 'id3',
      },
      {
        name: 'level 2b',
        label: 'Level 2B',
        parentName: 'level 1',
        blockId: 'id4',
      },
      {
        name: 'level 3',
        label: 'Level 3',
        parentName: 'level 2b',
        blockId: 'id5',
      },
      {
        name: 'another level 1',
        label: 'Another Level 1',
        parentName: 'root topic',
        blockId: 'id6',
      },
    ])

    // Additional checks for specific relationships
    const topicMap = new Map(result.topics.map((topic) => [topic.name, topic]))

    expect(topicMap.get('level 1')?.parentName).toBe('root topic')
    expect(topicMap.get('level 2a')?.parentName).toBe('level 1')
    expect(topicMap.get('level 2b')?.parentName).toBe('level 1')
    expect(topicMap.get('level 3')?.parentName).toBe('level 2b')
    expect(topicMap.get('another level 1')?.parentName).toBe('root topic')

    // Check labels
    expect(topicMap.get('root topic')?.label).toBe('Root Topic')
    expect(topicMap.get('level 1')?.label).toBe('Level 1')
    expect(topicMap.get('level 2a')?.label).toBe('Level 2A')
    expect(topicMap.get('level 2b')?.label).toBe('Level 2B')
    expect(topicMap.get('level 3')?.label).toBe('Level 3')
    expect(topicMap.get('another level 1')?.label).toBe('Another Level 1')
  })
})
