// topic-heading-list.tsx
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react'
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from '@tiptap/suggestion'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'

import { useTopicPathMap } from '@/lib/hooks/use-topic-path-map'

import { MentionItem } from './mention-item'

interface TopicHeadingListProps extends SuggestionProps {}

interface TopicHeadingListActions {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

export const TopicHeadingList = forwardRef<
  TopicHeadingListActions,
  TopicHeadingListProps
>(({ clientRect, command, query }, ref) => {
  const { topicShortIdByName } = useTopicPathMap()
  const topics = Array.from(topicShortIdByName).map(([name, shortId]) => ({
    name,
    shortId,
  }))

  const filteredTopics = topics
    .filter((topic) => topic.name.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 7)

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
    placement: 'bottom-start',
  })

  useEffect(() => {
    if (clientRect) {
      const rect = clientRect()
      if (rect) {
        refs.setPositionReference({
          getBoundingClientRect: () => rect,
        })
      }
    }
  }, [clientRect, refs])

  const handleCommand = (index: number) => {
    const selectedTopic = filteredTopics[index]
    command({
      level: 1, // Default level, can be adjusted as needed
      topicId: selectedTopic.shortId,
      topicName: selectedTopic.name,
    })
  }

  const [hoverIndex, setHoverIndex] = useState(0)
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      const { key } = event

      if (key === 'ArrowUp') {
        setHoverIndex((prev) => (prev > 0 ? prev - 1 : 0))
        return true
      }

      if (key === 'ArrowDown') {
        setHoverIndex((prev) =>
          prev < filteredTopics.length - 1
            ? prev + 1
            : filteredTopics.length - 1
        )
        return true
      }

      if (key === 'Enter') {
        handleCommand(hoverIndex)
        return true
      }

      return false
    },
  }))

  return createPortal(
    <div
      ref={refs.setFloating}
      className="topicHeadingContainer"
      style={floatingStyles}
    >
      {filteredTopics.map((item, index) => (
        <MentionItem
          key={item.shortId}
          isActive={index === hoverIndex}
          onMouseEnter={() => setHoverIndex(index)}
          onClick={() => handleCommand(index)}
        >
          {item.name}
        </MentionItem>
      ))}
    </div>,
    document.body
  )
})
