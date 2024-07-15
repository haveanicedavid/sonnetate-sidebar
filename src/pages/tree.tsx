import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { MarkdownContent } from '@/components/markdown-content'
import { TopicBreadcrumbs } from '@/components/topic-breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { blockToMd } from '@/lib/markdown/blocks-to-md'
import { treeSlugToPath } from '@/lib/url'

function TreeCard({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="-mt-4 overflow-auto transition-all duration-300 ease-out"
      style={{ maxHeight: isExpanded ? '470px' : '100px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <MarkdownContent content={content} />
    </div>
  )
}

export function TreePage() {
  const { treeSlug } = useParams<{ treeSlug: string }>()
  const path = treeSlugToPath(treeSlug)

  if (!path) return <LoadingScreen />

  const { isLoading, error, data } = db.useQuery({
    trees: {
      $: {
        where: {
          path: path,
        },
      },
      block: {
        children: {
          children: {
            children: {
              children: {
                children: {
                  children: {},
                },
              },
            },
          },
        },
      },
      summary: {
        site: {},
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>
  const trees = data?.trees || []
  console.log('🪚 trees: in topic page', trees)

  const groupedCards = data?.trees.reduce(
    (acc, tree) => {
      const pageName = tree.summary[0].site?.[0].domain || 'Untitled'
      if (!acc[pageName]) acc[pageName] = []
      acc[pageName].push({
        id: tree.id,
        content: blockToMd(tree.block[0], true),
      })
      return acc
    },
    {} as { [pageName: string]: { id: string; content: string }[] }
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <TopicBreadcrumbs path={path} />
        <div className="mt-4 space-y-4">
          {groupedCards &&
            Object.entries(groupedCards).map(([pageName, cards]) => (
              <Card key={pageName} className="overflow-hidden">
                <CardHeader className="pb-0 pt-2">
                  <CardTitle className="text-right text-sm">
                    {pageName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {cards.map((card) => (
                      <TreeCard key={card.id} content={card.content} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
