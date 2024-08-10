// custom-heading.ts
import type { Editor } from '@tiptap/core'
import { Heading } from '@tiptap/extension-heading'
import { ReactRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from 'prosemirror-state'

import { HeadingSuggestions } from './heading-suggestions'

export const CustomHeading = Heading.extend({
  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: new PluginKey('custom-heading-suggestions'),
      view: () => {
        let view: ReactRenderer | null = null

        return {
          update: (editor: Editor, prevState) => {
            const { selection } = editor.state
            const { $head } = selection
            const parent = $head.parent

            if (parent.type.name === 'heading' && parent.textContent === '#') {
              if (!view) {
                const component = new ReactRenderer(HeadingSuggestions, {
                  props: {
                    items: [
                      'Important Topic',
                      'Subtopic',
                      'Key Point',
                      'Summary',
                    ],
                    command: (item: string) => {
                      editor
                        .chain()
                        .focus()
                        .deleteRange({ from: $head.pos - 1, to: $head.pos })
                        .insertContent(item)
                        .run()
                    },
                  },
                  editor,
                })

                const element = component.element
                element.style.position = 'absolute'

                const { top, left } = editor.view.coordsAtPos($head.pos)
                element.style.top = `${top}px`
                element.style.left = `${left}px`

                document.body.appendChild(element)
                view = component
              }
            } else if (view) {
              view.destroy()
              view = null
            }
          },
          destroy: () => {
            if (view) {
              view.destroy()
              view = null
            }
          },
        }
      },
    })

    return [...(this.parent?.() || []), plugin]
  },
})
