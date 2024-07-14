import { Share } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { HorizontalSummaryList } from '@/components/horizontal-summary-list'
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
import { useUser } from '@/db/ui-store'
import { blockToMd } from '@/lib/markdown/blocks-to-md'

export function SummaryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user] = useUser()

  if (!id || !user?.id) return <LoadingScreen />

  const { data } = db.useQuery({
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

  if (!data) {
    return <LoadingScreen />
  }

  const summaries = data.summaries
  const currentSummary = summaries.find((s) => s.id === id)
  const rootBlock = currentSummary?.rootBlock[0]

  if (!currentSummary || !rootBlock) {
    return <LoadingScreen />
  }

  const mdString = blockToMd(rootBlock)
  const isPublic = currentSummary.isPublic

  const handleShare = () => {
    if (currentSummary.id) {
      shareSummary(currentSummary.id)
    }
  }

  const handleViewSummary = (summaryId: string) => {
    navigate(`/summaries/${summaryId}`)
  }

  const uiSummaries = summaries.map((summary) => ({
    id: summary.id,
    title: summary.title,
    description: summary.description,
  }))

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <HorizontalSummaryList
          summaries={uiSummaries}
          onSummaryClick={handleViewSummary}
          activeSummaryId={id}
        />

        <div className="flex-grow overflow-auto p-4 pt-2">
          <Card className="markdown relative h-full overflow-visible">
            <CardContent className="h-full overflow-auto p-4">
              <MarkdownContent content={mdString} />
            </CardContent>
          </Card>
        </div>

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
