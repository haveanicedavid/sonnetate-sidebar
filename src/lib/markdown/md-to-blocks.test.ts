import { beforeEach, expect, test, vi } from 'vitest'

import { mdToBlocks } from './md-to-blocks'

let counter: number

beforeEach(() => {
  counter = 0
  vi.mock('@instantdb/react', () => ({
    id: vi.fn(() => `id${++counter}`),
  }))
})

test('parses headings with wikilinks and includes distinct treeId and blockId', () => {
  const markdown = `# [[Header 1]]
Paragraph 1
## [[Header 1/Header 2|Alias 2]]

Paragraph 2

### [[Header 1/Header 2/Header 3|Alias 3]]

Paragraph 3
`

  const result = mdToBlocks(markdown)

  expect(result).toEqual([
    {
      id: 'id1',
      text: '# [[Header 1]]',
      type: 'heading',
      tree: {
        path: 'Header 1',
        topic: 'Header 1',
        parentId: null,
        id: 'id2',
      },
      parentId: 'root',
      children: [
        {
          id: 'id3',
          text: 'Paragraph 1',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          children: [],
          order: 0,
        },
        {
          id: 'id4',
          text: '## [[Header 1/Header 2|Alias 2]]',
          type: 'heading',
          tree: {
            path: 'Header 1/Header 2',
            topic: 'Alias 2',
            parentId: 'id2',
            id: 'id5',
          },
          parentId: 'id1',
          children: [
            {
              id: 'id6',
              text: 'Paragraph 2',
              type: 'paragraph',
              tree: null,
              parentId: 'id4',
              children: [],
              order: 0,
            },
            {
              id: 'id7',
              text: '### [[Header 1/Header 2/Header 3|Alias 3]]',
              type: 'heading',
              tree: {
                path: 'Header 1/Header 2/Header 3',
                topic: 'Alias 3',
                parentId: 'id5',
                id: 'id8',
              },
              parentId: 'id4',
              children: [
                {
                  id: 'id9',
                  text: 'Paragraph 3',
                  type: 'paragraph',
                  tree: null,
                  parentId: 'id7',
                  children: [],
                  order: 0,
                },
              ],
              order: 1,
            },
          ],
          order: 1,
        },
      ],
      order: 0,
    },
  ])
})

test('parses multiple top-level headings', () => {
  const markdown = `# [[Header 1]]

Content 1

# [[Header 2]]

Content 2
`

  const result = mdToBlocks(markdown)

  expect(result).toEqual([
    {
      id: 'id1',
      text: '# [[Header 1]]',
      type: 'heading',
      tree: {
        path: 'Header 1',
        topic: 'Header 1',
        parentId: null,
        id: 'id2',
      },
      parentId: 'root',
      children: [
        {
          id: 'id3',
          text: 'Content 1',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          children: [],
          order: 0,
        },
      ],
      order: 0,
    },
    {
      id: 'id4',
      text: '# [[Header 2]]',
      type: 'heading',
      tree: {
        path: 'Header 2',
        topic: 'Header 2',
        parentId: null,
        id: 'id5',
      },
      parentId: 'root',
      children: [
        {
          id: 'id6',
          text: 'Content 2',
          type: 'paragraph',
          tree: null,
          parentId: 'id4',
          children: [],
          order: 0,
        },
      ],
      order: 1,
    },
  ])
})

test('parses headings without wikilinks', () => {
  const markdown = `# Regular Header

Content
`

  const result = mdToBlocks(markdown)

  expect(result).toEqual([
    {
      id: 'id1',
      text: '# Regular Header',
      type: 'heading',
      tree: {
        path: '',
        topic: '',
        parentId: null,
        id: 'id2',
      },
      parentId: 'root',
      children: [
        {
          id: 'id3',
          text: 'Content',
          type: 'paragraph',
          tree: null,
          parentId: 'id1',
          children: [],
          order: 0,
        },
      ],
      order: 0,
    },
  ])
})

test('parses lists and code blocks', () => {
  const markdown = `# [[Main]]

## [[Main/Lists|Lists]]

- Item 1
- Item 2

## [[Main/Code|Code]]

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`

  const result = mdToBlocks(markdown)

  expect(result).toEqual([
    {
      id: 'id1',
      text: '# [[Main]]',
      type: 'heading',
      tree: {
        path: 'Main',
        topic: 'Main',
        parentId: null,
        id: 'id2',
      },
      parentId: 'root',
      children: [
        {
          id: 'id3',
          text: '## [[Main/Lists|Lists]]',
          type: 'heading',
          tree: {
            path: 'Main/Lists',
            topic: 'Lists',
            parentId: 'id2',
            id: 'id4',
          },
          parentId: 'id1',
          children: [
            {
              id: 'id5',
              text: '- Item 1\n- Item 2',
              type: 'unordered-list',
              tree: null,
              parentId: 'id3',
              children: [],
              order: 0,
            },
          ],
          order: 0,
        },
        {
          id: 'id6',
          text: '## [[Main/Code|Code]]',
          type: 'heading',
          tree: {
            path: 'Main/Code',
            topic: 'Code',
            parentId: 'id2',
            id: 'id7',
          },
          parentId: 'id1',
          children: [
            {
              id: 'id8',
              text: "```javascript\nconsole.log('Hello, world!');\n```",
              type: 'codeblock',
              tree: null,
              parentId: 'id6',
              children: [],
              order: 0,
            },
          ],
          order: 1,
        },
      ],
      order: 0,
    },
  ])
})

test('handles empty input', () => {
  const markdown = ''

  const result = mdToBlocks(markdown)

  expect(result).toEqual([])
})
