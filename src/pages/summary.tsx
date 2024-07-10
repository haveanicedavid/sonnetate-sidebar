import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { db } from '@/db'

export function SummaryPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <LoadingScreen />

  const { data } = db.useQuery({
    summaries: {
      $: {
        where: {
          id
        },
      },
      blocks: {
        children: {
          children: {
            children: {
              children: {
                children: {}
              }
            }
          }
        }
      }
    },
  })
  console.log('🪚 data:', data)
  return <div>Summary Page </div>
}
