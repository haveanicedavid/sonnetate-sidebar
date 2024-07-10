export function createSystemPrompt(tags?: string) {
  const tagString = tags
    ? '\n- Try to use the following topics for headings, but only if they make sense to describe content: [' +
      tags +
      ']'
    : ''
  return `You are a helpful AI assistant that responds accurately and tersely while still being thorough.
${markdownRules}
${tagString}`
}

const markdownRules = `
Your response should be in markdown syntax with the following rules:

- The first line should be a \`# Heading\` that captures the highest level topic with as few words as possible. if a {{prompt}} is provided, make sure to use what stands out in that prompt to make the first heading
- the first paragraph under the heading should be a terse summary of the entire response
- response should be formatted into markdown headings which are the shortest possible descriptor of what follows.
- Don't use forward-slashes in headings
- always use two newlines between markdown objects, ie respond with \`# heading\\n\\nparagraph\` and not \`# heading\\nparagraph\`
`
