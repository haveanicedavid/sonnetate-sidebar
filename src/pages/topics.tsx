import { LoadingScreen } from '@/components/loading-screen'
import { TopicsTable } from '@/components/topics-table'
import { db } from '@/db'
import type { Topic } from '@/db/types'
import { useUser } from '@/db/ui-store'

export function TopicsPage() {
  const [user] = useUser()
  const { isLoading, error, data } = db.useQuery({
    topics: {
      $: {
        where: {
          'users.id': user.id,
        },
      },
      trees: {
        $: {
          where: {
            'user.id': user.id,
          },
        },
        children: {},
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>

  const allTopics = data.topics

  // Filter topics to only include those with children in their trees
  const filteredTopics = allTopics.filter(
    (topic: Topic) =>
      topic.trees &&
      topic.trees.length > 0 &&
      topic.trees[0].children &&
      topic.trees[0].children.length > 0
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Topics</h1>
        <TopicsTable topics={filteredTopics} />
      </div>
    </div>
  )
}
