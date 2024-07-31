import { db } from '@/db'
import type { Tree } from '@/db/types'
import { toShortId } from '@/lib/id'
import { mergeDuplicateOutlineNodes } from '@/lib/outline'

import { Outline, type OutlineProps } from './outline'

export function TreesOutline({
  treeIds,
  basePath,
}: {
  treeIds: Array<string>
  basePath: string
}) {
  const { data, isLoading } = db.useQuery({
    trees: {
      $: {
        where: {
          id: {
            in: treeIds,
          },
        },
      },
      topic: {},
      children: {
        topic: {},
        children: {
          topic: {},
          children: {
            topic: {},
            children: {
              topic: {},
              children: {
                topic: {},
              },
            },
          },
        },
      },
    },
  })

  const trees = data?.trees

  if (isLoading || !trees) return null

  const mergedOutlineProps = mergeDuplicateOutlineNodes(
    trees.map((tree) =>
      treeToOutlineProps({ tree, basePath, isFirstLevel: true })
    )
  )

  return mergedOutlineProps.map((props) => (
    <Outline key={basePath + props.shortId} {...props} />
  ))
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
