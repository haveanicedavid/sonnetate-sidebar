import { expect, test } from 'vitest'
import { getBlockType, getHeadingLevel } from './utils'

test('getBlockType correctly identifies block types', () => {
  expect(getBlockType('# Heading')).toBe('heading')
  expect(getBlockType('## Subheading')).toBe('heading')
  expect(getBlockType('Regular paragraph')).toBe('paragraph')
  expect(getBlockType('- List item')).toBe('unordered-list')
  expect(getBlockType('* List item')).toBe('unordered-list')
  expect(getBlockType('1. Ordered item')).toBe('ordered-list')
  expect(getBlockType('- [ ] Todo item')).toBe('task-list')
  expect(getBlockType('- [x] Completed item')).toBe('task-list')
  expect(getBlockType('> Blockquote')).toBe('blockquote')
  expect(getBlockType('```javascript\ncode\n```')).toBe('codeblock')
  expect(getBlockType('![Alt text](image.jpg)')).toBe('image')
})

test('getHeadingLevel correctly identifies heading levels', () => {
  expect(getHeadingLevel('# Heading 1')).toBe(1);
  expect(getHeadingLevel('## Heading 2')).toBe(2);
  expect(getHeadingLevel('### Heading 3')).toBe(3);
  expect(getHeadingLevel('#### Heading 4')).toBe(4);
  expect(getHeadingLevel('##### Heading 5')).toBe(5);
  expect(getHeadingLevel('###### Heading 6')).toBe(6);
  // fails
  expect(getHeadingLevel('######7 not Heading 7')).toBe(0);
  expect(getHeadingLevel('not a header')).toBe(0);
  expect(getHeadingLevel('#not-a-header')).toBe(0);
});
