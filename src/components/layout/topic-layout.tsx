import { Outlet, useLocation } from 'react-router-dom'

import { toFullId } from '@/lib/id'

import { TopicBreadcrumbs } from '../topic-breadcrumbs'

export function TopicLayout() {
  const location = useLocation()
  const [, ...topicPath] = location.pathname.split('/').filter(Boolean)

  const topicIds = topicPath.map(toFullId) || []

  return (
    <div className="relative h-full overflow-y-auto p-4">
      <TopicBreadcrumbs topicIds={topicIds.reverse()} />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}
