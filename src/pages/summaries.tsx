import { LoadingScreen } from '@/components/loading-screen'
import { SummaryCard } from '@/components/summary-card'
import { db } from '@/db'
import { useUser } from '@/db/ui-store'

export function SummariesPage() {
  const [user] = useUser()
  const { isLoading, data } = db.useQuery({
    summaries: {
      $: {
        where: {
          'user.id': user.id,
        },
        order: {
          serverCreatedAt: 'desc',
        },
      },
      site: {},
    },
  })

  if (isLoading) return <LoadingScreen />
  const summaries = data?.summaries || []

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map((summary) => (
          <SummaryCard key={summary.id} showDomain summary={summary} />
        ))}
      </div>
    </div>
  )
}
