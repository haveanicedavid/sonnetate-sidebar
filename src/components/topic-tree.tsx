import { atom, useAtom } from 'jotai'
import { Minus, Plus, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import type { Topic } from '@/db/types'
import { toShortId } from '@/lib/id'
import { cn } from '@/lib/utils'

import { CollapseTree } from './animations/collapse-tree'
import { HoverArrow } from './ui/hover-arrow'

const openTopicsAtom = atom(new Set())

function ToggleButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2 h-4 w-4 p-0"
      onClick={onClick}
    >
      {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
    </Button>
  )
}

function TopicLabel({
  label,
  hasChildren,
  idPath,
}: {
  label?: string
  hasChildren: boolean
  idPath: string
}) {
  return (
    <Link
      to={idPath}
      className={cn(
        'group flex items-center text-base text-primary/70 transition-colors hover:text-primary',
        !hasChildren && 'ml-1.5'
      )}
    >
      {!hasChildren && <Circle className="mr-3 h-1 w-1 fill-primary/20 text-primary/20" />}
      <span>{label}</span>
      <HoverArrow className="ml-1 h-4 w-4" />
    </Link>
  )
}

/**
 * A recursive component that renders a tree of topics
 */
export function TopicTree({
  topic,
  path,
  isFirstLevel = true,
}: {
  topic: Topic
  path: string
  isFirstLevel?: boolean
}) {
  const [openTopics, setOpenTopics] = useAtom(openTopicsAtom)
  const [isLocalOpen, setIsLocalOpen] = useState(isFirstLevel)
  const currentPath = `${path}/${toShortId(topic.id)}`
  const isOpen = openTopics.has(currentPath) || (isFirstLevel && isLocalOpen)

  useEffect(() => {
    if (isFirstLevel) {
      setOpenTopics((prev) => new Set(prev).add(currentPath))
    }
  }, [isFirstLevel, currentPath, setOpenTopics])

  const children = topic.children || []
  const hasChildren = children.length > 0

  if (!topic || !path) return null

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
      <div className="flex items-center mb-1">
        {hasChildren && <ToggleButton isOpen={isOpen} onClick={toggleOpen} />}
        <TopicLabel
          label={topic.label}
          hasChildren={hasChildren}
          idPath={currentPath}
        />
      </div>
      {hasChildren && (
        <CollapseTree isOpen={isOpen}>
          <div className="ml-1.5 border-l-2 pl-2">
            {children.map((childTopic) => (
              <TopicTree
                key={childTopic.id}
                topic={childTopic}
                path={currentPath}
                isFirstLevel={false}
              />
            ))}
          </div>
        </CollapseTree>
      )}
    </div>
  )
}
