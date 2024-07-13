import { Link, useParams } from 'react-router-dom'

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

export function TopicBreadcrumbs({ path }: { path: string }) {
  const segments = path.split('/').filter(Boolean)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <HoverCard openDelay={400}>
            <HoverCardTrigger asChild>
              <BreadcrumbLink asChild>
                <Link to="/topics">Topics</Link>
              </BreadcrumbLink>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Topics</h4>
                <p className="text-sm">Browse all available topics</p>
                {/* Add more content here if needed */}
              </div>
            </HoverCardContent>
          </HoverCard>
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
                  <HoverCard openDelay={400}>
                    <HoverCardTrigger asChild>
                      <BreadcrumbLink asChild>
                        <Link to={url}>{segment}</Link>
                      </BreadcrumbLink>
                    </HoverCardTrigger>
                    <HoverCardContent align='start'>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{segment}</h4>
                        <p className="text-sm">Explore subtopics and related content</p>
                        {/* Add more dynamic content here based on the segment */}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
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
