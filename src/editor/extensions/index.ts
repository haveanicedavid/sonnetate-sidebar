import { id } from '@instantdb/react'
import { mergeAttributes } from '@tiptap/core'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Mention from '@tiptap/extension-mention'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import UniqueId from 'tiptap-unique-id'

import { suggestions } from './mention/suggestion'

export const TiptapExtensions = [
  StarterKit,
  BubbleMenu.configure({
    element: document.querySelector('.bubble-menu') as HTMLElement,
  }),
  Markdown,
  UniqueId.configure({
    attributeName: 'id',
    types: ['paragraph', 'heading', 'orderedList', 'bulletList', 'blockquote'],
    createId: () => id(),
  }),
  Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: suggestions,
    deleteTriggerWithBackspace: true,
    renderHTML({ options, node }) {
      return [
        'a',
        mergeAttributes(
          { href: `#/topics/${node.attrs.id}` },
          options.HTMLAttributes
        ),
        `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
      ]
    },
  }),
]
