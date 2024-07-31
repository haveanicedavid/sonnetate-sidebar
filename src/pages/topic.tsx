import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { TreesOutline } from '@/components/outline-trees'
import { RenderMarkdown } from '@/components/render-markdown'
import { TopicBreadcrumbs } from '@/components/topic-breadcrumbs'
import { Card } from '@/components/ui/card'
import { db } from '@/db'
import { buildTopicWhereClause } from '@/db/queries/topic-queries'
import type { Block, Tree } from '@/db/types'
import { toFullId } from '@/lib/id'
import { blockToMd } from '@/lib/markdown/blocks-to-md'

export function TopicPage() {
  const { '*': topicPath } = useParams()
  const topicIds = topicPath?.split('/').map(toFullId)

  if (!topicPath || !topicIds) return null

  const { isLoading, error, data } = db.useQuery({
    trees: {
      $: {
        where: buildTopicWhereClause(topicIds),
      },
      block: {
        children: {
          $: {
            where: {
              or: [
                { type: 'paragraph' },
                { type: 'ordered-list' },
                { type: 'unordered-list' },
                { type: 'task-list' },
                { type: 'blockquote' },
                { type: 'codeblock' },
                { type: 'image' },
              ],
            },
          },
        },
      },
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
                children: {},
              },
            },
          },
        },
      },
      summary: {},
    },
  })

  if (isLoading) return <LoadingScreen />

  if (error) {
    console.error('Error fetching topic data:', error)
    return <div>Error loading topic data. Please try again later.</div>
  }

  const trees = data?.trees

  const childTrees = trees?.reduce((acc, curr) => {
    const children = curr.children ?? []
    return [...acc, ...children]
  }, [] as Tree[])

  const showTree =
    trees?.length && trees.find((tree) => tree?.children?.length > 0)

  // top level tree is the current topic, so we want to display `children` for
  // that topic, but not all have them so we filter
  const childBlocks: Array<Block[]> =
    trees
      ?.map((tree) => {
        const children = tree.block?.[0]?.children ?? []
        return children.length > 0 ? children : null
      })
      .filter((child): child is Block[] => Boolean(child)) || []

  return (
    <div className="h-full overflow-y-auto p-4">
      <TopicBreadcrumbs topicIds={topicIds} />
      {!isLoading && showTree ? (
        <Card className="mt-4 bg-background p-4">
          <TreesOutline trees={childTrees} basePath={topicPath} />
        </Card>
      ) : null}
      <div className="mt-4 space-y-4">
        {childBlocks.map((blocks) => {
          return (
            <Card
              key={'blocks-' + blocks[0].id}
              className="flex-col space-x-2 p-4"
            >
              <div className="mt-2">
                <RenderMarkdown
                  key={'md- ' + blocks[0].id}
                  content={blockToMd(blocks)}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
