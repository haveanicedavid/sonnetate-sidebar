// TODO: not working
import { mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import { Heading } from '@tiptap/extension-heading'
import type { HeadingOptions, Level } from '@tiptap/extension-heading'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface HeadingComponentProps extends Omit<NodeViewProps, 'node'> {
  node: {
    attrs: {
      level: Level
      content: string | null
    }
  }
}

const HeadingComponent: React.FC<HeadingComponentProps> = ({
  node,
  updateAttributes,
}) => {
  const [value, setValue] = useState(node.attrs.content || '')

  useEffect(() => {
    setValue(node.attrs.content || '')
  }, [node.attrs.content])

  const updateHeading = (newValue: string) => {
    setValue(newValue)
    updateAttributes({ content: newValue })
  }

  const HeadingTag = `h${node.attrs.level}` as keyof JSX.IntrinsicElements

  return (
    <NodeViewWrapper as={HeadingTag}>
      {value || `Heading ${node.attrs.level}`}
      <Select onValueChange={updateHeading} value={value}>
        <SelectTrigger className="ml-2 h-6 w-auto">
          <SelectValue placeholder="Select heading" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Introduction">Introduction</SelectItem>
          <SelectItem value="Main Points">Main Points</SelectItem>
          <SelectItem value="Conclusion">Conclusion</SelectItem>
          <SelectItem value="Summary">Summary</SelectItem>
          <SelectItem value="Discussion">Discussion</SelectItem>
        </SelectContent>
      </Select>
    </NodeViewWrapper>
  )
}

export interface TopicHeadingOptions extends HeadingOptions {
  HTMLAttributes: Record<string, unknown>
}

export const TopicHeading = Heading.extend<TopicHeadingOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      level: {
        default: 1,
        rendered: false,
      },
      content: {
        default: null,
        parseHTML: (element) => element.textContent,
        renderHTML: (attributes) => ({
          'data-content': attributes.content,
        }),
      },
    }
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
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

  addNodeView() {
    return ReactNodeViewRenderer(HeadingComponent)
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }

          return commands.setNode(this.name, attributes)
        },
      toggleHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }

          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () =>
            this.editor.commands.toggleHeading({ level }),
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
})
