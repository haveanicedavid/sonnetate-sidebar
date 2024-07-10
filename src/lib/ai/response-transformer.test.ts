import Anthropic from '@anthropic-ai/sdk'
import { describe, expect, test } from 'vitest'

import { StreamingMarkdownTransformer } from './response-transformer'

type MessageStreamEvent = Anthropic.MessageStreamEvent

describe('StreamingMarkdownTransformer', () => {
  test('transforms Anthropic stream events correctly', () => {
    const transformer = new StreamingMarkdownTransformer()
    const events: Partial<MessageStreamEvent>[] = [
      {
        type: 'content_block_start',
        content_block: { type: 'text', text: '# Head' },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: 'ing 1\n\nparagraph' },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: ' 1\n\n## He' },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: 'ading 2\n\nParagraph 2\n\n### ' },
      },
      {
        type: 'content_block_delta',
        delta: {
          type: 'text_delta',
          text: 'Heading 3\n\nParagraph 3\n\n## Another Heading 2\n\nParagraph 4',
        },
      },
    ]

    let result = ''
    for (const event of events) {
      const transformedContent = transformer.transformStreamEvent(
        event as MessageStreamEvent
      )
      if (transformedContent) {
        result += transformedContent
      }
    }
    result += transformer.finish()

    const expected = `# [[Heading 1|Heading 1]]

paragraph 1

## [[Heading 1/Heading 2|Heading 2]]

Paragraph 2

### [[Heading 1/Heading 2/Heading 3|Heading 3]]

Paragraph 3

## [[Heading 1/Another Heading 2|Another Heading 2]]

Paragraph 4
`

    expect(result).toBe(expected)
  })

  test('handles code blocks in Anthropic stream events', () => {
    const transformer = new StreamingMarkdownTransformer()
    const events: Partial<MessageStreamEvent>[] = [
      {
        type: 'content_block_start',
        content_block: { type: 'text', text: '# Header\n\n```python\ndef ' },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: "hello():\n    print('Hello" },
      },
      {
        type: 'content_block_delta',
        delta: {
          type: 'text_delta',
          text: ", World!')\n```\n\n## Another Header",
        },
      },
    ]

    let result = ''
    for (const event of events) {
      const transformedContent = transformer.transformStreamEvent(
        event as MessageStreamEvent
      )
      if (transformedContent) {
        result += transformedContent
      }
    }
    result += transformer.finish()

    const expected = `# [[Header|Header]]

\`\`\`python
def hello():
    print('Hello, World!')
\`\`\`

## [[Header/Another Header|Another Header]]
`

    expect(result).toBe(expected)
  })
})
