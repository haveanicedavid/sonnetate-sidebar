import type Anthropic from '@anthropic-ai/sdk'

type RawMessageStreamEvent = Anthropic.MessageStreamEvent

export class StreamingMarkdownTransformer {
  private headerStack: string[] = []
  private buffer: string = ''
  private isInCodeBlock: boolean = false

  transformStreamEvent(event: RawMessageStreamEvent): string | null {
    if (event.type === 'content_block_start') {
      if (event.content_block.type === 'text') {
        this.buffer += event.content_block.text
      }
    } else if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        this.buffer += event.delta.text
      }
    }

    return this.processBuffer()
  }

  private processBuffer(): string {
    let transformedText = ''
    const lines = this.buffer.split('\n')

    for (let i = 0; i < lines.length - 1; i++) {
      transformedText += this.processLine(lines[i]) + '\n'
    }

    this.buffer = lines[lines.length - 1]

    return transformedText
  }

  private processLine(line: string): string {
    if (line.startsWith('```')) {
      this.isInCodeBlock = !this.isInCodeBlock
      return line
    }

    if (this.isInCodeBlock) {
      return line
    }

    if (line.startsWith('#')) {
      return this.transformHeader(line)
    }

    return line
  }

  private transformHeader(line: string): string {
    const headerLevel = line.match(/^#+/)?.[0].length || 0
    const headerText = line.replace(/^#+\s*/, '').trim()

    const sanitizedHeaderText = headerText.replace(/[/\\]/g, '-')

    this.headerStack.splice(headerLevel - 1)
    this.headerStack[headerLevel - 1] = sanitizedHeaderText

    const fullPath = this.headerStack.slice(0, headerLevel).join('/')

    return `${'#'.repeat(headerLevel)} [[${fullPath}|${headerText}]]`
  }

  finish(): string {
    let remainingContent = this.processBuffer()
    if (this.buffer) {
      remainingContent += this.processLine(this.buffer) + '\n'
      this.buffer = ''
    }
    return remainingContent
  }
}
