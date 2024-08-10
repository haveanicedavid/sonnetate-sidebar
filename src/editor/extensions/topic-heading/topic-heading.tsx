// topic-heading.ts
import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import type { SuggestionOptions } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'

export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface TopicHeadingOptions {
  levels: Level[]
  HTMLAttributes: Record<string, any>
  suggestion: Omit<SuggestionOptions, 'editor'>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    topicHeading: {
      setTopicHeading: (attributes: {
        level: Level
        topicId: string
        topicName: string
      }) => ReturnType
    }
  }
}

export const TopicHeadingPluginKey = new PluginKey('topicHeading')

export const TopicHeading = Node.create<TopicHeadingOptions>({
  name: 'topicHeading',

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
      suggestion: {
        char: '',
        pluginKey: TopicHeadingPluginKey,
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).setTopicHeading(props).run()
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          return !!$from.parent.type.contentMatch.matchType(type)
        },
      },
    }
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
      topicId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-topic-id'),
        renderHTML: (attributes) => {
          if (!attributes.topicId) {
            return {}
          }
          return {
            'data-topic-id': attributes.topicId,
          }
        },
      },
      topicName: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-topic-name'),
        renderHTML: (attributes) => {
          if (!attributes.topicName) {
            return {}
          }
          return {
            'data-topic-name': attributes.topicName,
          }
        },
      },
    }
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}[data-topic-id]`,
      attrs: { level },
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel ? node.attrs.level : this.options.levels[0]

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setTopicHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }

          return commands.setNode(this.name, attributes)
        },
    }
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () =>
            this.editor.commands.setTopicHeading({
              level,
              topicId: '',
              topicName: '',
            }),
        },
      }),
      {}
    )
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      })
    })
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
