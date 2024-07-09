import Anthropic from '@anthropic-ai/sdk'

import { createSystemPrompt } from './prompts'

const API_KEY =
  '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'

const anthropic = new Anthropic({
  apiKey: API_KEY,
})

export async function* streamSummarization({
  url,
  tags,
  prompt,
}: {
  url: string
  tags?: string
  prompt?: string
}) {
  const content = prompt
    ? `look at the following webpage and use it to answer my question\n\nwebpage: ${url}\n\nquestion: ${prompt}`
    : `summarize the following webpage: ${url}`

  const stream = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    temperature: 0.5,
    system: createSystemPrompt(tags),
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    stream: true,
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}
