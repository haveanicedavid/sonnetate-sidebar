import { LoadingScreen } from '@/components/loading-screen'
import { SiteTable } from '@/components/sites-table'
import { db } from '@/db'
import { useUser } from '@/db/ui-store'

export function SitesPage() {
  const [user] = useUser()
  const { isLoading, error, data } = db.useQuery({
    sites: {
      $: {
        where: {
          'users.id': user.id,
        },
        order: {
          serverCreatedAt: 'desc',
        },
      },
      summaries: {
        trees: {
          topic: {},
        },
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Sites</h1>
        <SiteTable sites={data.sites} />
      </div>
    </div>
  )
}
