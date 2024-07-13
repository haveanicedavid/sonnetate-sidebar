import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { MarkdownContent } from '@/components/markdown-content'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { blocksToMd } from '@/lib/markdown/blocks-to-md'

function TopicCard({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="-mt-8 overflow-auto transition-all duration-300 ease-out"
      style={{ maxHeight: isExpanded ? '470px' : '100px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <MarkdownContent content={content} />
    </div>
  )
}

function TopicBreadcrumbs({ path }: { path: string }) {
  const segments = path.split('/').filter(Boolean)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/topics">Topics</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {' / '}
        {segments.map((segment, index) => {
          const url = `/topics/${segments.slice(0, index + 1).join('__')}`
          const isLast = index === segments.length - 1
          return (
            <BreadcrumbItem key={url}>
              {isLast ? (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={url}>{segment}</Link>
                  </BreadcrumbLink>
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
export function TopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const path = topicSlug?.replace(/__/g, '/').replace(/_/g, ' ')

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

  const groupedCards = data?.trees.reduce(
    (acc, tree) => {
      const pageName = tree.summary[0].site?.[0].domain || 'Untitled'
      if (!acc[pageName]) acc[pageName] = []
      acc[pageName].push({
        id: tree.id,
        content: blocksToMd(tree.block[0]),
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
                      <TopicCard key={card.id} content={card.content} />
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
