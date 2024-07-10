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

- The first line should be a \`# [[Heading]]\` that captures the highest level topic with as few words as possible. if a {{prompt}} is provided, make sure to use what stands out in that prompt to make the first heading
- the first paragraph under the heading should be a terse summary of the entire response
- response should be formatted into markdown headings. All headings should be a \`[[wikilink]]\`
- Nested headings should contain the hierarchy of all parent headings in their wikilinks, separated by forward-slash \`/\`, then a pipe \`|\` to designate an alias
- Don't use forward-slashes in headings other than to show header hierarchy like I told you
- For headings with an alias (non h1 / # headings), the alias should be the same as the last heading in the hierarchy. ie an h3 would be \`### [[HeadingH1/HeadingH2/Heading3|Headingh3]]\`
- Heading [[wikilink]]s should be the shortest possible descriptor of the content. example: \`# [[Heading]]\n\nparagraph describing entire response\n\n## [[Heading/Subheading|Subheading]]\n\ndescription of subheading
- always use two newlines between markdown objects, ie respond with \`# [[heading]]\\n\\nparagraph\` and not \`# [[heading]]\\nparagraph\`
`
