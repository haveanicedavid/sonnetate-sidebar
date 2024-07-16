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

import { LoadingScreen } from './loading-screen'

export function TopicBreadcrumbs({ path }: { path: string }) {
  const segments = path.split('/').filter(Boolean)
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
        {segments.map((segment, index) => {
          const url = `/trees/${segments.slice(0, index + 1).join('__')}`
          const isLast = index === segments.length - 1
          return (
            <BreadcrumbItem key={url}>
              {isLast ? (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              ) : (
                <>
                  <TopicTreeHoverCard segment={segment} url={url} />
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
  segment,
  url,
}: {
  segment: string
  url: string
}) {
  const { isLoading, data } = db.useQuery({
    trees: {
      $: {
        where: {
          'topic.name': segment,
        },
      },
    },
  })

  // const trees = data?.trees

  return (
    <HoverCard openDelay={400}>
      <HoverCardTrigger asChild>
        <BreadcrumbLink asChild>
          <Link to={url}>{segment}</Link>
        </BreadcrumbLink>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{segment}</h4>
            <p className="text-sm">TODO: display other parents here</p>
            {/* Add more dynamic content here based on the segment */}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
