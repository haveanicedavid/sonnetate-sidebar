// topic-heading-suggestion.ts
import { ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions } from '@tiptap/suggestion'

import { TopicHeadingList } from './topic-heading-list'

export const topicHeadingSuggestions: Partial<SuggestionOptions> = {
  items: ({ query }) => {
    console.log("🪚 query in topic suggestion:", query);
    return [] // We'll filter in the TopicHeadingList component
  },
  char: '',
  startOfLine: true,
  render: () => {
    let reactRenderer: ReactRenderer

    return {
      onStart: (props) => {
        reactRenderer = new ReactRenderer(TopicHeadingList, {
          props,
          editor: props.editor,
        })
      },

      onUpdate(props) {
        reactRenderer?.updateProps(props)
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          reactRenderer?.destroy()
          return true
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (reactRenderer?.ref as any)?.onKeyDown(props)
      },

      onExit() {
        reactRenderer.destroy()
      },
    }
  },
}
