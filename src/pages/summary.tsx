import { Share } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { LoadingScreen } from '@/components/loading-screen'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/db'
import { shareSummary } from '@/db/actions/summary'
import { blocksToMd } from '@/lib/markdown/blocks-to-md'

export function SummaryPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <LoadingScreen />

  const { data } = db.useQuery({
    summaries: {
      $: {
        where: {
          id,
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
  const summary = data?.summaries[0]
  const rootBlock = summary?.rootBlock[0]

  let mdString = ''

  if (rootBlock) {
    mdString = blocksToMd(rootBlock)
  }

  if (!data || !rootBlock) {
    return <LoadingScreen />
  }

  const isPublic = summary?.isPublic

  const handleShare = () => {
    if (summary?.id) {
      shareSummary(summary.id)
    }
  }

  return (
    <TooltipProvider>
      <div className="container relative mx-auto min-h-screen px-4 py-8">
        <Card className="markdown overflow-hidden">
          <CardContent className="max-h-[calc(100vh-12rem)] overflow-auto p-6">
            <MarkdownContent content={mdString} />
          </CardContent>
        </Card>
        <div className="fixed bottom-8 right-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleShare}
                disabled={isPublic}
              >
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPublic ? 'Already shared' : 'Share summary'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
