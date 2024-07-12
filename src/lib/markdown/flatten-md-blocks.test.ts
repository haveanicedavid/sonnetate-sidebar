import { describe, expect, test } from 'vitest'
import { flattenParsedMd } from './flatten-md-blocks'
import type { MdBlock } from './types'

describe('flattenParsedMd', () => {
  test('flattens parsed markdown structure, extracts topics, and uses null for root parentId', () => {
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
          path: 'Header 1',
          topic: 'Header 1',
          parentId: null,
          id: 'tree1',
          blockId: 'id1',
        },
        {
          path: 'Header 1/Subheader',
          topic: 'Subheader',
          parentId: 'tree1',
          id: 'tree2',
          blockId: 'id3',
        },
      ],
      topics: ['Header 1', 'Subheader'],
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
})
