import { expect, test } from 'vitest'

import { parseMd } from './parse-md'

test('parses headings with wikilinks, paragraphs, and lowercase tree field', () => {
  const markdown = `# [[Header 1]]

Paragraph 1

## [[Header 1/Header 2|Header 2]]

Paragraph 2

### [[Header 1/Header 2/Header 3|Header 3]]

Paragraph 3
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# [[Header 1]]',
      type: 'heading',
      tree: '',
      children: [
        {
          text: 'Paragraph 1',
          type: 'paragraph',
          tree: 'header 1',
          children: [],
          order: 0,
        },
        {
          text: '## [[Header 1/Header 2|Header 2]]',
          type: 'heading',
          tree: 'header 1',
          children: [
            {
              text: 'Paragraph 2',
              type: 'paragraph',
              tree: 'header 1/header 2',
              children: [],
              order: 0,
            },
            {
              text: '### [[Header 1/Header 2/Header 3|Header 3]]',
              type: 'heading',
              tree: 'header 1/header 2',
              children: [
                {
                  text: 'Paragraph 3',
                  type: 'paragraph',
                  tree: 'header 1/header 2/header 3',
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

test('parses lists with wikilink headings and lowercase tree field', () => {
  const markdown = `
# [[List Examples]]

## [[List Examples/Unordered List|Unordered List]]

- Item 1
- Item 2
  - Nested Item 1
  - Nested Item 2

## [[List Examples/Ordered List|Ordered List]]

1. First
2. Second
   1. Nested First
   2. Nested Second

## [[List Examples/Task List|Task List]]

- [ ] Todo 1
- [x] Done 1
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# [[List Examples]]',
      type: 'heading',
      tree: '',
      children: [
        {
          text: '## [[List Examples/Unordered List|Unordered List]]',
          type: 'heading',
          tree: 'list examples',
          children: [
            {
              text: '- Item 1\n- Item 2\n  - Nested Item 1\n  - Nested Item 2',
              type: 'unordered-list',
              tree: 'list examples/unordered list',
              children: [],
              order: 0,
            },
          ],
          order: 0,
        },
        {
          text: '## [[List Examples/Ordered List|Ordered List]]',
          type: 'heading',
          tree: 'list examples',
          children: [
            {
              text: '1. First\n2. Second\n   1. Nested First\n   2. Nested Second',
              type: 'ordered-list',
              tree: 'list examples/ordered list',
              children: [],
              order: 0,
            },
          ],
          order: 1,
        },
        {
          text: '## [[List Examples/Task List|Task List]]',
          type: 'heading',
          tree: 'list examples',
          children: [
            {
              text: '- [ ] Todo 1\n- [x] Done 1',
              type: 'task-list',
              tree: 'list examples/task list',
              children: [],
              order: 0,
            },
          ],
          order: 2,
        },
      ],
      order: 0,
    },
  ])
})

test('parses blockquotes and code blocks with wikilink headings and lowercase tree field', () => {
  const markdown = `
# [[Quotes and Code]]

> This is a blockquote
> It can span multiple lines

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# [[Quotes and Code]]',
      type: 'heading',
      tree: '',
      children: [
        {
          text: '> This is a blockquote\n> It can span multiple lines',
          type: 'blockquote',
          tree: 'quotes and code',
          children: [],
          order: 0,
        },
        {
          text: '```javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n```',
          type: 'codeblock',
          tree: 'quotes and code',
          children: [],
          order: 1,
        },
      ],
      order: 0,
    },
  ])
})

test('parses images with wikilink headings and lowercase tree field', () => {
  const markdown = `
# [[Images]]

![Alt text](https://example.com/image.jpg)

Paragraph with ![inline image](https://example.com/inline.png) inside.

## [[Images/Nested Images|Nested Images]]

Another image here.
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# [[Images]]',
      type: 'heading',
      tree: '',
      children: [
        {
          text: '![Alt text](https://example.com/image.jpg)',
          type: 'image',
          tree: 'images',
          children: [],
          order: 0,
        },
        {
          text: 'Paragraph with ![inline image](https://example.com/inline.png) inside.',
          type: 'paragraph',
          tree: 'images',
          children: [],
          order: 1,
        },
        {
          text: '## [[Images/Nested Images|Nested Images]]',
          type: 'heading',
          tree: 'images',
          children: [
            {
              text: 'Another image here.',
              type: 'paragraph',
              tree: 'images/nested images',
              children: [],
              order: 0,
            },
          ],
          order: 2,
        },
      ],
      order: 0,
    },
  ])
})
