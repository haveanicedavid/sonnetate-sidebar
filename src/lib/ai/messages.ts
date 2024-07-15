import Anthropic from '@anthropic-ai/sdk'

import { createMessageContent, createSystemPrompt } from './prompts'
import { StreamingMarkdownTransformer } from './response-transformer'

/**
 * Takes a prompt and returns a stream of markdown parsed to assign hierarchy
 * to the content
 */
export async function* streamTransformedMarkdown({
  url,
  apiKey,
  prompt,
  tags,
}: {
  url: string
  apiKey?: string
  prompt?: string
  tags?: string
}) {
  if (!apiKey) throw new Error('API key is required')

  const anthropic = new Anthropic({
    apiKey,
  })
  const transformer = new StreamingMarkdownTransformer()

  const stream = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    temperature: 0.5,
    system: createSystemPrompt(tags),
    messages: [
      {
        role: 'user',
        content: createMessageContent({ url, prompt }),
      },
    ],
    stream: true,
  })

  for await (const event of stream) {
    const transformedContent = transformer.transformStreamEvent(event)
    yield transformedContent
  }

  // Process any remaining content
  yield transformer.finish()
}
