import { atom, useAtom } from 'jotai'
import { Circle, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import type { Topic, Tree } from '@/db/types'
import { toShortId } from '@/lib/id'
import { mergeDuplicateOutlineNodes } from '@/lib/outline'
import { cn } from '@/lib/utils'

import { CollapseTree } from './animations/collapse-tree'
import { HoverArrow } from './ui/hover-arrow'

const openTopicsAtom = atom(new Set<string>())

export type OutlineProps = {
  shortId: string
  label: string
  children: Array<OutlineProps>
  basePath: string
  isFirstLevel?: boolean
}

export function Outline({
  shortId,
  label,
  children,
  basePath,
  isFirstLevel = true,
}: OutlineProps) {
  const [openTopics, setOpenTopics] = useAtom(openTopicsAtom)
  const [isLocalOpen, setIsLocalOpen] = useState(isFirstLevel)
  const currentPath = `${basePath}/${shortId}`
  const isOpen = openTopics.has(currentPath) || (isFirstLevel && isLocalOpen)

  useEffect(() => {
    if (isFirstLevel) {
      setOpenTopics((prev) => new Set(prev).add(currentPath))
    }
  }, [isFirstLevel, currentPath, setOpenTopics])

  const hasChildren = children.length > 0

  if (!shortId || !basePath) return null

  const toggleOpen = () => {
    if (isFirstLevel) {
      setIsLocalOpen(!isLocalOpen)
    }
    setOpenTopics((prev) => {
      const newSet = new Set(prev)
      if (isOpen) {
        newSet.delete(currentPath)
      } else {
        newSet.add(currentPath)
      }
      return newSet
    })
  }

  return (
    <div className="relative">
      <div className="mb-1 flex items-center">
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-4 w-4 p-0"
            onClick={toggleOpen}
          >
            {isOpen ? (
              <Minus className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </Button>
        )}

        <Link
          to={currentPath}
          className={cn(
            'group flex items-center text-base text-primary/70 transition-colors hover:text-primary',
            !hasChildren && 'ml-1.5'
          )}
        >
          {!hasChildren && (
            <Circle className="mr-3 h-1 w-1 fill-primary/20 text-primary/20" />
          )}
          <span>{label}</span>
          <HoverArrow className="ml-1 h-4 w-4" />
        </Link>
      </div>
      {hasChildren && (
        <CollapseTree isOpen={isOpen}>
          <div className="ml-1.5 border-l-2 pl-2">
            {children.map((childTopic) => (
              <Outline
                key={childTopic.shortId}
                {...childTopic}
                basePath={currentPath}
                isFirstLevel={false}
              />
            ))}
          </div>
        </CollapseTree>
      )}
    </div>
  )
}

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
      {...topicToOutlineProps({ topic, basePath, isFirstLevel: true })}
    />
  ))
}

export function TreesOutline({
  trees,
  basePath,
}: {
  trees: Tree[]
  basePath: string
}) {
  const mergedOutlineProps = mergeDuplicateOutlineNodes(
    trees.map((tree) =>
      treeToOutlineProps({ tree, basePath, isFirstLevel: true })
    )
  )

  return mergedOutlineProps.map((props) => (
    <Outline key={basePath + props.shortId} {...props} />
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

function treeToOutlineProps({
  tree,
  basePath,
  isFirstLevel = false,
}: {
  tree: Tree
  basePath: string
  isFirstLevel?: boolean
}): OutlineProps {
  const topic = tree.topic?.[0]
  if (!topic) {
    throw new Error('Tree must have a topic')
  }
  const shortId = toShortId(topic.id)
  return {
    shortId,
    label: topic.label,
    children:
      tree.children?.map((child) => {
        return treeToOutlineProps({
          tree: child,
          basePath: `${basePath}/${shortId}`,
          isFirstLevel: false,
        })
      }) || [],
    basePath,
    isFirstLevel,
  }
}
