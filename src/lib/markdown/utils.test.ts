import { describe, expect, it, test } from 'vitest'

import {
  ensureHeadingSeparation,
  getBlockType,
  getDescription,
  getHeadingLevel,
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

describe('ensureHeadingSeparation', () => {
  it('should add single empty lines before and after headings', () => {
    const input = `# Heading 1
Content under heading 1
## Heading 2
Content under heading 2`

    const expected = `# Heading 1

Content under heading 1

## Heading 2

Content under heading 2`

    expect(ensureHeadingSeparation(input)).toBe(expected)
  })

  it('should add only one empty line between consecutive headings', () => {
    const input = `# Heading 1
## Heading 2
### Heading 3`

    const expected = `# Heading 1

## Heading 2

### Heading 3`

    expect(ensureHeadingSeparation(input)).toBe(expected)
  })

  it('should preserve existing empty lines', () => {
    const input = `# Heading 1

Content under heading 1

## Heading 2
Content under heading 2

# Heading 3`

    const expected = `# Heading 1

Content under heading 1

## Heading 2

Content under heading 2

# Heading 3`

    expect(ensureHeadingSeparation(input)).toBe(expected)
  })

  it('should handle mixed content types', () => {
    const input = `# Heading 1
- List item 1
- List item 2
## Heading 2
Paragraph
\`\`\`
Code block
\`\`\`
### Heading 3`

    const expected = `# Heading 1

- List item 1
- List item 2

## Heading 2

Paragraph
\`\`\`
Code block
\`\`\`

### Heading 3`

    expect(ensureHeadingSeparation(input)).toBe(expected)
  })

  it('should not add extra newlines at the start or end of the document', () => {
    const input = `# Heading 1
Content
# Heading 2`

    const expected = `# Heading 1

Content

# Heading 2`

    expect(ensureHeadingSeparation(input)).toBe(expected)
  })
})
