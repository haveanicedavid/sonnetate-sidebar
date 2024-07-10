// TODO: unused currently
export function transformMarkdownToStructured(markdown: string): string {
  const lines = markdown.split('\n')
  const transformedLines: string[] = []
  const headerStack: string[] = []

  for (const line of lines) {
    if (line.startsWith('#')) {
      const headerLevel = line.match(/^#+/)?.[0].length || 0
      const headerText = line.replace(/^#+\s*/, '').trim()

      // Adjust the header stack based on the current header level
      headerStack.splice(headerLevel - 1)
      headerStack[headerLevel - 1] = headerText

      // Create the full path for the wikilink
      const fullPath = headerStack.slice(0, headerLevel).join('/')

      // Create the transformed header with wikilink
      const transformedHeader = `${'#'.repeat(headerLevel)} [[${fullPath}|${headerText}]]`
      transformedLines.push(transformedHeader)
    } else {
      transformedLines.push(line)
    }
  }

  return transformedLines.join('\n')
}
