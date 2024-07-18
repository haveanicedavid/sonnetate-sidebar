import { Link, useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { RenderMarkdown } from '@/components/render-markdown'
import { TopicBreadcrumbs } from '@/components/topic-breadcrumbs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { Tree } from '@/db/types'
import { useUser } from '@/db/ui-store'
import { blockToMd } from '@/lib/markdown/blocks-to-md'
import { treeSlugToPath } from '@/lib/url'

export function TreePage() {
  const { treeSlug } = useParams<{ treeSlug: string }>()
  const [user] = useUser()
  const path = treeSlugToPath(treeSlug)

  if (!path) return <LoadingScreen />

  const { isLoading, error, data } = db.useQuery({
    trees: {
      $: {
        where: {
          or: [
            {
              'topic.name': path,
              'user.id': user.id,
            },
            {
              path,
              'user.id': user.id,
            },
          ],
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
      const domain = tree.summary[0].site?.[0].domain || 'Untitled'
      const siteId = tree.summary[0].site?.[0].id
      if (!acc[domain]) acc[domain] = { trees: [], siteId }
      acc[domain].trees.push(tree)
      return acc
    },
    {} as { [domain: string]: { trees: Tree[]; siteId: string | undefined } }
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <TopicBreadcrumbs path={path} />
        <div className="mt-4 space-y-4">
          {groupedCards &&
            Object.entries(groupedCards).map(
              ([domain, { trees, siteId }], i) => (
                <Card key={`${domain}-${i}`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-md text-right font-medium">
                      {siteId ? (
                        <Link to={`/sites/${siteId}`}>{domain}</Link>
                      ) : (
                        domain
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TreeCard trees={trees} />
                  </CardContent>
                </Card>
              )
            )}
        </div>
      </div>
    </div>
  )
}

type TreeCardProps = {
  trees: Tree[]
}

function TreeCard({ trees }: TreeCardProps) {
  if (trees.length === 0) return null

  if (trees.length === 1) {
    return (
      <div className="rounded-md border p-2">
        <RenderMarkdown content={blockToMd(trees[0].block?.[0])} />
      </div>
    )
  }

  return (
    <Accordion
      type="single"
      defaultValue="item-0"
      collapsible
      className="w-full"
    >
      {trees.map((tree, index) => (
        <AccordionItem key={tree.id} value={`item-${index}`}>
          <AccordionTrigger className="text-sm font-medium">
            Item {index + 1}
          </AccordionTrigger>
          <AccordionContent>
            <div className="rounded-md border p-2">
              <RenderMarkdown content={blockToMd(tree.block?.[0])} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
