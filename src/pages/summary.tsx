import { Share } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

import { LoadingScreen } from '@/components/loading-screen'
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
import { Block } from '@/db/types'
import { createMarkdownFromBlocks } from '@/lib/markdown/md-blocks'

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
                children: {},
              },
            },
          },
        },
      },
    },
  })
  const summary = data?.summaries[0]
  const rootBlock = summary?.rootBlock[0] as Block
  let mdString = ''

  if (rootBlock) {
    mdString = createMarkdownFromBlocks(rootBlock)
  }

  if (!data || !rootBlock) {
    return <LoadingScreen />
  }

  // This is a placeholder. Replace with actual logic to determine if the summary is shared.
  const isShared = summary?.isShared

  const handleShare = () => {
    if (summary?.id) {
      shareSummary(summary.id)
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <Card className="markdown overflow-hidden">
          <CardContent className="p-6 overflow-auto max-h-[calc(100vh-12rem)]">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [
                  remarkWikiLink,
                  {
                    aliasDivider: '|',
                    hrefTemplate: (permalink: string) =>
                      `#/topics/${permalink.replace(/\//g, '__')}`,
                  },
                ],
              ]}
              className="prose prose-sm sm:prose lg:prose-lg max-w-none"
            >
              {mdString}
            </ReactMarkdown>
          </CardContent>
        </Card>
        <div className="fixed bottom-8 right-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleShare}
                disabled={isShared}
              >
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isShared ? 'Already shared' : 'Share summary'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
