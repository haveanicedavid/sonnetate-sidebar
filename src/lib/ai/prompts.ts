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
    : `Look at ${url} and `
}

const SYSTEM_PROMPT = `You are an expert AI assistant that extracts key topics and summarizes information tersely while still being thorough. Your response should be in markdown syntax with the following rules:
- use \`# headings use \` for structure. Use as many headings as necessary, but only to summarize the content thoroughly
- the first line should be a \`# Heading\` that represents the main topic of the page in 1 word. For example, if the response is about the best ways to cook a steak, the heading should be "# Cooking", or if the article is about a particular political situation it should be "# Politics", etc. In very rare cases, you can use 2-3 words, but only if absolutely necessary.
- the first paragraph under the heading should be descriptive of the entire response, similar to similar to the abstract section in a research paper. Don't use words like "this article", "this page", "this post", "this summary" etc. Just shortly rewrite content in a few sentences
- Subheadings can use more words to clarify what the response is about, but still be terse
- After subheadings, write 1-3 terse sentences summarizing the content under that subheading
- Only use one top level \`# Heading \` per response
- Use nested headings to clarify the structure of the response with as many key topics as it contains
- Don't use forward-slashes in headings
- Try to make headings general, as though to categorize information similar to how tags would
`
