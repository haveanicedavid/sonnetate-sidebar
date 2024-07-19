import { db } from '@/db'
import { useUser } from '@/db/ui-store'

import { toShortId } from '../id'

export function useTopicPathMap() {
  const [user] = useUser()
  const topicShortIdByName = new Map<string, string>()
  const topicNameByShortId = new Map<string, string>()

  const { data, error } = db.useQuery({
    topics: {
      $: {
        where: {
          'users.id': user.id,
        },
      },
    },
  })

  const topics = data?.topics || []

  topics.forEach((topic) => {
    const shortId = toShortId(topic.id)
    topicShortIdByName.set(topic.name, shortId)
    topicNameByShortId.set(shortId, topic.name)
  })

  if (error) {
    console.error('Error fetching topic map: ', error)
  }
  return { topicShortIdByName, topicNameByShortId }
}
