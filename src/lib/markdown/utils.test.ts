import { describe, expect, test } from 'vitest'

import { MdBlock } from './types'
import {
  getBlockType,
  getDescription,
  getHeadingLevel,
  getTrees,
} from './utils'

test('getBlockType correctly identifies block types', () => {
  expect(getBlockType('# Heading')).toBe('heading')
  expect(getBlockType('## Subheading')).toBe('heading')
  expect(getBlockType('Regular paragraph')).toBe('paragraph')
  expect(getBlockType('- List item')).toBe('unordered-list')
  expect(getBlockType('* List item')).toBe('unordered-list')
  expect(getBlockType('1. Ordered item')).toBe('ordered-list')
  expect(getBlockType('- [ ] Todo item')).toBe('task-list')
  expect(getBlockType('- [x] Completed item')).toBe('task-list')
  expect(getBlockType('> Blockquote')).toBe('blockquote')
  expect(getBlockType('```javascript\ncode\n```')).toBe('codeblock')
  expect(getBlockType('![Alt text](image.jpg)')).toBe('image')
})

test('getHeadingLevel correctly identifies heading levels', () => {
  expect(getHeadingLevel('# Heading 1')).toBe(1)
  expect(getHeadingLevel('## Heading 2')).toBe(2)
  expect(getHeadingLevel('### Heading 3')).toBe(3)
  expect(getHeadingLevel('#### Heading 4')).toBe(4)
  expect(getHeadingLevel('##### Heading 5')).toBe(5)
  expect(getHeadingLevel('###### Heading 6')).toBe(6)
  // fails
  expect(getHeadingLevel('######7 not Heading 7')).toBe(0)
  expect(getHeadingLevel('not a header')).toBe(0)
  expect(getHeadingLevel('#not-a-header')).toBe(0)
})

describe('getDescription', () => {
  test('extracts content under the first header', () => {
    const markdown = `# Heading

paragraph describing
more description

## Another heading
This should not be included`

    expect(getDescription(markdown)).toBe(
      'paragraph describing\nmore description'
    )
  })

  test('returns empty string if no content after header', () => {
    const markdown = `# Heading

## Another heading
Content under second heading`

    expect(getDescription(markdown)).toBe('')
  })

  test('returns empty string if no headers', () => {
    const markdown = `This is just a paragraph
without any headers`

    expect(getDescription(markdown)).toBe('')
  })

  test('handles markdown with only one header', () => {
    const markdown = `# Single Heading
This is the only content`

    expect(getDescription(markdown)).toBe('This is the only content')
  })
})

describe('getTrees', () => {
  test('returns unique lowercase trees from parsed markdown', () => {
    const parsedMd: MdBlock[] = [
      {
        text: '# [[Header 1]]',
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
            text: '## [[Header 1/Header 2|Header 2]]',
            type: 'heading',
            tree: 'Header 1',
            children: [
              {
                text: 'Paragraph 2',
                type: 'paragraph',
                tree: 'Header 1/Header 2',
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

    const result = getTrees(parsedMd)
    expect(result).toEqual(['Header 1', 'Header 1/Header 2'])
  })

  test('returns empty array for markdown with no trees', () => {
    const parsedMd: MdBlock[] = [
      {
        text: 'Just a paragraph',
        type: 'paragraph',
        tree: '',
        children: [],
        order: 0,
      },
    ]

    const result = getTrees(parsedMd)
    expect(result).toEqual([])
  })

  test('handles nested structures correctly and converts to lowercase', () => {
    const parsedMd: MdBlock[] = [
      {
        text: '# [[Header 1]]',
        type: 'heading',
        tree: '',
        children: [
          {
            text: '## [[Header 1/Header 2|Header 2]]',
            type: 'heading',
            tree: 'Header 1',
            children: [
              {
                text: '### [[Header 1/Header 2/HEADER 3|HEADER 3]]',
                type: 'heading',
                tree: 'Header 1/Header 2',
                children: [
                  {
                    text: 'Deep paragraph',
                    type: 'paragraph',
                    tree: 'Header 1/Header 2/HEADER 3',
                    children: [],
                    order: 0,
                  },
                ],
                order: 0,
              },
            ],
            order: 0,
          },
        ],
        order: 0,
      },
    ]

    const result = getTrees(parsedMd)
    expect(result).toEqual([
      'Header 1',
      'Header 1/Header 2',
      'Header 1/Header 2/HEADER 3',
    ])
  })
})
