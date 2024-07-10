import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { db } from '@/db'

export function TopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const path = topicSlug?.replace(/__/g, '/').replace(/_/g, ' ')
  if (!path) return <LoadingScreen />

  const { isLoading, error, data } = db.useQuery({
    paths: {
      $: {
        where: {
          name: path,
        },
      },
      trees: {
        blocks: {},
      },
    },
  })
  console.log('🪚 data:', data)
  return <div>Topic Page </div>
}
