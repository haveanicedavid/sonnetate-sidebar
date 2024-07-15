import { format } from 'date-fns'

import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/db'
import { useUser } from '@/db/ui-store'
import { blockToMd } from '@/lib/markdown/blocks-to-md'
import { MarkdownContent } from '@/components/markdown-content'

export function SummariesPage() {
  const [user] = useUser()
  const { isLoading, error, data } = db.useQuery({
    summaries: {
      $: {
        where: {
          'user.id': user.id,
        },
      },
      rootBlock: {
        children: {
          children: {
            children: {
              children: {
                children: {
                  children: {},
                },
              },
            },
          },
        },
      },
    },
  })

  const summaries = data?.summaries || []

  return (
    <div className="h-full overflow-y-auto p-4">
      {summaries.map(({ id, dayCreated, pageTitle, url, rootBlock }) => {
        return (
          <Card key={id} className="mb-4">
            <CardContent className="p-4">
              <h2 className="mb-2 text-xl font-semibold">
                {format(dayCreated, 'MMMM d, yyyy')}
              </h2>
              <MarkdownContent content={blockToMd(rootBlock[0])}/>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
