import { describe, expect, test } from 'vitest'
import { transformMarkdownToStructured } from '../parse-response'

describe('transformMarkdownToStructured', () => {
  test('transforms regular markdown to structured markdown with wikilinks', () => {
    const input = `# Heading 1

paragraph 1

## Heading 2

Paragraph 2

### Heading 3

Paragraph 3

## Another Heading 2

Paragraph 4`;

    const expected = `# [[Heading 1|Heading 1]]

paragraph 1

## [[Heading 1/Heading 2|Heading 2]]

Paragraph 2

### [[Heading 1/Heading 2/Heading 3|Heading 3]]

Paragraph 3

## [[Heading 1/Another Heading 2|Another Heading 2]]

Paragraph 4`;

    expect(transformMarkdownToStructured(input)).toBe(expected);
  });

  test('handles markdown with no headers', () => {
    const input = `This is a paragraph.

This is another paragraph.`;

    expect(transformMarkdownToStructured(input)).toBe(input);
  });

  test('handles markdown with only top-level headers', () => {
    const input = `# Header 1

Content 1

# Header 2

Content 2`;

    const expected = `# [[Header 1|Header 1]]

Content 1

# [[Header 2|Header 2]]

Content 2`;

    expect(transformMarkdownToStructured(input)).toBe(expected);
  });
});
