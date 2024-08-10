import { id } from '@instantdb/react'
import { mergeAttributes } from '@tiptap/core'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Mention from '@tiptap/extension-mention'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import UniqueId from 'tiptap-unique-id'

import { suggestions } from './mention/suggestion'
// import { TopicHeading, topicHeadingSuggestions } from './topic-heading'
import { CustomHeading } from './custom-heading/custom-heading'

export const TiptapExtensions = [
  StarterKit.configure({
    heading: false,
  }),
  // TopicHeading.configure({
  //   suggestion: topicHeadingSuggestions,
  // }),
  CustomHeading,
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
        `${node.attrs.label ?? node.attrs.id}`,
      ]
    },
  }),
]
