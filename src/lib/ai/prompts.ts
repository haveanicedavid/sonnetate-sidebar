export function createSystemPrompt(tags?: string) {
  //   const tagPrompt = `
  // - If the following comma-separated words are relevant as section headings, use them, but ONLY if they are suitable for the webpage summary. Otherwise create new ones. The tags are here in triple quotes:
  // """
  // ${tags}
  // """`

  // return `${SYSTEM_PROMPT}${tags ? tagPrompt : ''}`
  return `${SYSTEM_PROMPT}`
}

export function createMessageContent({
  url,
  prompt,
}: {
  url: string
  prompt?: string
}) {
  return prompt
    ? `look at the webpage ${url} and use it for the following prompt. Make sure you use it for the first heading you respond with. {{${prompt}}}`
    : `summarize the following webpage: ${url}`
}

const SYSTEM_PROMPT = `You are a helpful AI assistant that extracts key topics and summarizes information tersely while still being thorough. Your response should be in markdown syntax with the following rules:
- response should be formatted into markdown headings for structure. Use as many headings as necessary, but only to summarize the content thoroughly
- the first line should be a \`# Heading\` that represents the main topic of the response in 1-3 words, less the better
- only use one top level \`# Heading \` per response
- Don't use forward-slashes in headings
- the first paragraph under the heading should be a summary of the entire response, but don't use words like "this article", "this page", "this post" etc. Just shortly summarize the content in a few sentences. For example:
  - don't say thing like "This article is about the best ways to cook a steak." Instead, say "The best ways to cook a steak are..."
  - don't say things like "This post discusses why eggs are good for you". Instead, say "Eggs are good for you because..."
- Try to make headings general. The text should be readable as though it's a normal document, but should categorize things similar to how tags would
- If asked about a webpage, only respond according to the content of that webpage
`
