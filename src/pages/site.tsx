import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { SummaryCard } from '@/components/summary-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { db } from '@/db'
import { useUser } from '@/db/ui-store'

export function SitePage() {
  const { id } = useParams<{ id: string }>()
  const [user] = useUser()

  if (!id) return <LoadingScreen />

  const { isLoading, data } = db.useQuery({
    sites: {
      $: {
        where: {
          id,
          'users.id': user.id,
        },
      },
      summaries: {},
    },
  })

  if (isLoading) return <LoadingScreen />
  const site = data?.sites?.[0]
  const summaries = site?.summaries || []

  if (!site || !summaries.length) return <LoadingScreen />

  return (
    <div className="container mx-auto p-4">
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/sites">Sites</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {' / '}
        <BreadcrumbPage>{site.domain}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map((summary) => (
          <SummaryCard key={summary.id} summary={summary} />
        ))}
      </div>
    </div>
  )
}

