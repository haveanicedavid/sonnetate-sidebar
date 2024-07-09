import { expect, test } from 'vitest'

import { parseMd } from './parse-md'

test('parses headings and paragraphs', () => {
  const markdown = `# Heading 1

Paragraph 1

## Heading 2

Paragraph 2

### Heading 3

Paragraph 3
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# Heading 1',
      type: 'heading',
      children: [
        {
          text: 'Paragraph 1',
          type: 'paragraph',
          children: [],
          order: 0,
        },
        {
          text: '## Heading 2',
          type: 'heading',
          children: [
            {
              text: 'Paragraph 2',
              type: 'paragraph',
              children: [],
              order: 0,
            },
            {
              text: '### Heading 3',
              type: 'heading',
              children: [
                {
                  text: 'Paragraph 3',
                  type: 'paragraph',
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

test('parses lists', () => {
  const markdown = `
# List Examples

## Unordered List

- Item 1
- Item 2
  - Nested Item 1
  - Nested Item 2

## Ordered List

1. First
2. Second
   1. Nested First
   2. Nested Second

## Task List

- [ ] Todo 1
- [x] Done 1
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# List Examples',
      type: 'heading',
      children: [
        {
          text: '## Unordered List',
          type: 'heading',
          children: [
            {
              text: '- Item 1\n- Item 2\n  - Nested Item 1\n  - Nested Item 2',
              type: 'unordered-list',
              children: [],
              order: 0,
            },
          ],
          order: 0,
        },
        {
          text: '## Ordered List',
          type: 'heading',
          children: [
            {
              text: '1. First\n2. Second\n   1. Nested First\n   2. Nested Second',
              type: 'ordered-list',
              children: [],
              order: 0,
            },
          ],
          order: 1,
        },
        {
          text: '## Task List',
          type: 'heading',
          children: [
            {
              text: '- [ ] Todo 1\n- [x] Done 1',
              type: 'task-list',
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

test('parses blockquotes and code blocks', () => {
  const markdown = `
# Quotes and Code

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
      text: '# Quotes and Code',
      type: 'heading',
      children: [
        {
          text: '> This is a blockquote\n> It can span multiple lines',
          type: 'blockquote',
          children: [],
          order: 0,
        },
        {
          text: '```javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n```',
          type: 'codeblock',
          children: [],
          order: 1,
        },
      ],
      order: 0,
    },
  ])
})

test('parses images', () => {
  const markdown = `
# Images

![Alt text](https://example.com/image.jpg)

Paragraph with ![inline image](https://example.com/inline.png) inside.
`

  const result = parseMd(markdown)

  expect(result).toEqual([
    {
      text: '# Images',
      type: 'heading',
      children: [
        {
          text: '![Alt text](https://example.com/image.jpg)',
          type: 'image',
          children: [],
          order: 0,
        },
        {
          text: 'Paragraph with ![inline image](https://example.com/inline.png) inside.',
          type: 'paragraph',
          children: [],
          order: 1,
        },
      ],
      order: 0,
    },
  ])
})
