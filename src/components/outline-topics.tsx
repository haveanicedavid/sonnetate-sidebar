import type { Topic } from '@/db/types'

import { Outline, type OutlineProps } from './outline'
import { toShortId } from '@/lib/id'

export function TopicsOutline({
  topics,
  basePath,
}: {
  topics: Array<Topic>
  basePath: string
}) {
  return topics.map((topic) => (
    <Outline
      key={basePath + topic.id}
      {...topicToOutlineProps({ topic, basePath: basePath, isFirstLevel: true })}
    />
  ))
}

function topicToOutlineProps({
  topic,
  basePath,
  isFirstLevel = false,
}: {
  topic: Topic
  basePath: string
  isFirstLevel?: boolean
}): OutlineProps {
  const shortId = toShortId(topic.id)
  return {
    shortId,
    label: topic.label,
    children:
      topic.children?.map((child) =>
        topicToOutlineProps({
          topic: child,
          basePath: `${basePath}/${shortId}`,
          isFirstLevel: false,
        })
      ) || [],
    basePath,
    isFirstLevel,
  }
}
