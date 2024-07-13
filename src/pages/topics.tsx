import { LoadingScreen } from '@/components/loading-screen'
import { db } from '@/db'

export function TopicsPage() {
  const { isLoading, error, data } = db.useQuery({
    topics: {
      trees: {
        children: {},
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>

  const topics = data.topics

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <div className="mt-4 space-y-4">
          <pre>
            <code>{JSON.stringify(topics, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
