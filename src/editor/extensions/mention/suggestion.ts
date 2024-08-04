import { ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions } from '@tiptap/suggestion'

import { MentionList } from './mention-list'

export const suggestions: Partial<SuggestionOptions> = {
  render: () => {
    let reactRenderer: ReactRenderer

    return {
      onStart: (props) => {
        reactRenderer = new ReactRenderer(MentionList, {
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
