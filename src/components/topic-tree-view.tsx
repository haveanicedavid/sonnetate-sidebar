import { animated, useSpring } from '@react-spring/web'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useMeasure from 'react-use-measure'

import { Button } from '@/components/ui/button'
import type { Tree } from '@/db/types'
import { usePrevious } from '@/lib/hooks/use-previous'
import { treePathToSlug } from '@/lib/url'

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
  path,
}: {
  label?: string
  hasChildren: boolean
  path: string
}) {
  return (
    <Link
      to={`/trees/${treePathToSlug(path)}`}
      className={`group flex items-center text-base font-semibold text-primary/70 transition-colors hover:text-primary ${!hasChildren ? 'ml-6' : ''}`}
    >
      <span>{label}</span>
      <ArrowRight className="ml-1 h-4 w-4 transform opacity-0 transition-all duration-200 ease-in-out group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  )
}

export function TopicTreeView({
  tree,
  defaultOpen = false,
}: {
  tree: Tree
  defaultOpen?: boolean
}) {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [ref, { height: viewHeight }] = useMeasure()

  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  })

  const topic = tree.topic?.[0]
  const children = tree.children || []
  const hasChildren = children.length > 0

  return (
    <div className="relative mt-1">
      <div className="flex items-center">
        {hasChildren && (
          <ToggleButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
        )}
        <TopicLabel
          label={topic?.label}
          hasChildren={hasChildren}
          path={tree.path}
        />
      </div>
      {hasChildren && (
        <animated.div
          style={{
            opacity,
            height: isOpen && previous === isOpen ? 'auto' : height,
            overflow: 'hidden',
          }}
          className="ml-2 border-l-2 pl-2"
        >
          <animated.div ref={ref} style={{ y }}>
            {children.map((childTree) => (
              <TopicTreeView key={childTree.id} tree={childTree} />
            ))}
          </animated.div>
        </animated.div>
      )}
    </div>
  )
}
