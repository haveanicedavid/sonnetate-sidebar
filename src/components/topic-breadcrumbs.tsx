import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { db } from '@/db'
import type { Topic } from '@/db/types'
import { toShortId } from '@/lib/id'
import { topicIdMap } from '@/lib/maps'

import { HoverArrow } from './ui/hover-arrow'

/**
 * @param topicIds - An array of topic IDs ordered by hierarchy
 */
export function TopicBreadcrumbs({ topicIds }: { topicIds?: string[] }) {
  if (!topicIds?.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Topics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const topicMap = topicIdMap(topicIds)

  const { isLoading, data } = db.useQuery({
    topics: {
      $: {
        where: {
          id: {
            in: topicIds,
          },
        },
      },
      children: {},
    },
  })

  const unorderedTopics = data?.topics

  if (!unorderedTopics?.length || isLoading) return null

  const topics = unorderedTopics.sort((a, b) => {
    return topicMap[b.id] - topicMap[a.id]
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <HoverCard openDelay={400}>
            <BreadcrumbLink asChild>
              <Link to="/topics">Topics</Link>
            </BreadcrumbLink>
          </HoverCard>
        </BreadcrumbItem>
        {' / '}
        {topics.map((topic, index) => {
          const path = topics
            .slice(0, index + 1)
            .map((t) => toShortId(t.id))
            .join('/')
          const url = `/topics/${path}`

          const isLast = index === topics.length - 1
          return (
            <BreadcrumbItem key={url}>
              {isLast ? (
                <BreadcrumbPage>{topic.label}</BreadcrumbPage>
              ) : (
                <>
                  <TopicTreeHoverCard
                    topic={topic}
                    url={url}
                    previousTopic={topics[index - 1] ?? null}
                  />
                  {' / '}
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function TopicTreeHoverCard({
  previousTopic,
  topic,
  url,
}: {
  previousTopic: Topic | null
  topic: Topic
  url: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const splitUrl = url.split('/')

  const siblings = (previousTopic?.children || [])
    .filter((sibling) => sibling.id !== topic.id)
    .map(({ id, label }) => {
      const siblingIndex = splitUrl.indexOf(id)
      const newUrlParts = splitUrl.slice(0, siblingIndex)
      return {
        label,
        url: [...newUrlParts, toShortId(id)].join('/'),
      }
    })

  if (!siblings.length || siblings.length === 0) {
    return (
      <BreadcrumbLink asChild>
        <Link to={url}>{topic.label}</Link>
      </BreadcrumbLink>
    )
  }

  return (
    <HoverCard openDelay={200} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <BreadcrumbLink asChild>
          <Link to={url} className="group flex items-center">
            {topic.label}
            <ChevronDown
              className={`ml-1 h-3 w-3 transition-transform duration-200 ease-in-out ${
                isOpen ? 'rotate-180 transform' : ''
              }`}
            />
          </Link>
        </BreadcrumbLink>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-auto">
        <div className="space-y-1">
          {siblings.map(({ url, label }) => (
            <div key={'hover-card-' + url}>
              <Link
                to={url}
                className="group text-sm text-primary/70 hover:text-primary"
              >
                <div className="flex items-center">
                  {label}
                  <HoverArrow className="ml-1 h-3 w-3" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
