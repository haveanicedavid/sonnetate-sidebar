import { id } from '@instantdb/react'
import { Save, Share } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HorizontalSummaryList } from '@/components/horizontal-summary-list'
import { LoadingScreen } from '@/components/loading-screen'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/db'
import { createSummary } from '@/db/actions/summary'
import { useUser } from '@/db/ui-store'
import { streamTransformedMarkdown } from '@/lib/ai/messages'
import { useCurrentTab } from '@/lib/hooks/use-current-tab'
import { MARKDOWN_STUB_WITH_HIERARCHY } from '@/lib/markdown/stub'

export function HomePage() {
  const { url, title: pageTitle } = useCurrentTab()
  const navigate = useNavigate()
  useEffect(() => {
    if (!url) return
    setNewSummaryId(id())
  }, [url])

  const [userInput, setUserInput] = useState('')
  // TODO: in prod this shouldn't have an ID
  const [newSummaryId, setNewSummaryId] = useState(id())
  const [summary, setSummary] = useState(MARKDOWN_STUB_WITH_HIERARCHY)
  // const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user] = useUser()

  if (!user?.id) return <LoadingScreen />

  const { data } = db.useQuery({
    summaries: {
      $: {
        where: {
          url: url || 'https://www.sonnetate.com',
          'user.id': user.id,
        },
      },
    },
  })

  const handleSummarize = async (prompt?: string) => {
    const newId = id()
    setNewSummaryId(newId)
    setIsLoading(true)
    setSummary('')
    setError(null)

    try {
      if (url) {
        for await (const chunk of streamTransformedMarkdown({
          prompt,
          url,
          apiKey: user?.apiKey,
        })) {
          setSummary((prev) => prev + chunk)
        }
      } else {
        throw new Error('No active tab')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (md: string, isPublic?: boolean) => {
    setError(null)
    if (!newSummaryId) {
      setError('No summary to save')
      return
    }
    try {
      createSummary({
        md,
        isPublic,
        id: newSummaryId,
        pageTitle: pageTitle || 'Untitled',
        url: url || 'https://www.sonnetate.com',
        userId: user.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleViewSummary = (id: string) => {
    navigate(`/summaries/${id}`)
  }

  const summaries = data?.summaries || []
  const uiSummaries = summaries.map((summary) => {
    return {
      id: summary.id,
      title: summary.title,
      description: summary.description,
    }
  })

  const fetchedSummary = summaries.find((s) => s.id === newSummaryId)
  const summarySaved = Boolean(fetchedSummary)
  const summaryShared = Boolean(fetchedSummary?.isPublic)

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col p-4">
        {uiSummaries?.length > 0 ? (
          <div className="mb-8 h-40">
            <HorizontalSummaryList
              summaries={uiSummaries}
              onViewSummary={handleViewSummary}
            />
          </div>
        ) : null}

        <div className="flex-grow overflow-auto">
          {error && (
            <Card className="mb-4 border-red-300 bg-red-100 p-4">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          <Card className="markdown relative h-full overflow-hidden">
            <CardContent className="h-full overflow-auto p-4">
              {summary ? (
                <MarkdownContent content={summary} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <h6 className="mb-2 text-lg font-medium text-gray-500">
                      Ready to summarize
                    </h6>
                    <p className="text-sm text-gray-400">
                      Enter a prompt or click 'Summarize' to begin
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {summary && (
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSave(summary)}
                      disabled={isLoading || summarySaved}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save summary</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSave(summary, true)}
                      disabled={isLoading || summaryShared}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share summary</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your prompt, or just... →"
                className="pr-24"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSummarize(userInput)}
                className="absolute bottom-0 right-0 top-0 rounded-l-none"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Summarize'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
