import Anthropic from '@anthropic-ai/sdk'

import { SYSTEM_PROMPT } from './prompts'
import { StreamingMarkdownTransformer } from './response-transformer'

/**
 * Takes a prompt and returns a stream of markdown parsed to assign hierarchy
 * to the content
 */
export async function* streamTransformedMarkdown({
  url,
  apiKey,
  prompt,
}: {
  url: string
  apiKey?: string
  prompt?: string
}) {
  if (!apiKey) throw new Error('API key is required')

  const anthropic = new Anthropic({
    apiKey,
  })
  const transformer = new StreamingMarkdownTransformer()

  const content = prompt
    ? `look at the webpage ${url} and use it for the following prompt. Make sure you use it for the first heading you respond with. {{prompt}}:\n\n${prompt}`
    : `summarize the following webpage:: ${url}`

  const stream = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    temperature: 0.5,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content,
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
