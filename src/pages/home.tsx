import { Save, Share } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

import { HorizontalSummaryList } from '@/components/horizontal-summary-list'
import { LoadingScreen } from '@/components/loading-screen'
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
  const { url } = useCurrentTab()
  const navigate = useNavigate()

  const [userInput, setUserInput] = useState('')
  const [summary, setSummary] = useState(MARKDOWN_STUB_WITH_HIERARCHY)
  // const [summary, setSummary] = useState('')
  const [canSave, setCanSave] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user] = useUser()

  if (!user?.id) return <LoadingScreen />

  const { data } = db.useQuery({
    summaries: {
      $: {
        where: {
          for: url || 'https://www.sonnetate.com',
          'user.id': user.id,
        },
      },
    },
  })

  const uiSummaries = (data?.summaries || []).map((summary) => {
    return {
      id: summary.id,
      title: summary.topicName,
      description: summary.description,
    }
  })

  const handleSummarize = async (prompt?: string) => {
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

  const handleSave = async (md: string) => {
    setError(null)
    try {
      createSummary({
        md,
        url: url || 'https://www.sonnetate.com',
        userId: user.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleShare = (md: string) => {
    setError(null)
    try {
      createSummary({
        md,
        isPublic: true,
        url: url || 'https://www.sonnetate.com',
        userId: user.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleViewSummary = (id: string) => {
    setCanSave(false)
    navigate(`/summaries/${id}`)
    // Implement view summary functionality
    console.log('View summary clicked for id:', id)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full p-4">
        {uiSummaries?.length > 0 ? (
          <div className="h-40 mb-8">
            <HorizontalSummaryList
              summaries={uiSummaries}
              onViewSummary={handleViewSummary}
            />
          </div>
        ) : null}

        <div className="flex-grow overflow-auto">
          {error && (
            <Card className="p-4 mb-4 bg-red-100 border-red-300">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          <Card className="markdown relative overflow-hidden h-full dark:border-slate-700">
            <CardContent className="p-4 overflow-auto h-full">
              {summary ? (
                <>
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
                  >
                    {summary}
                  </ReactMarkdown>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h6 className="text-lg font-medium text-gray-500 mb-2">
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
                      // disabled={isLoading || !canSave}
                      disabled={isLoading}
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
                      onClick={() => handleShare(summary)}
                      // disabled={isLoading || !canSave}
                      disabled={isLoading}
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
          <div className="flex space-x-2 items-center">
            <div className="flex-grow relative">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your prompt, or just... →"
                className="pr-24"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSummarize(userInput)}
                className="absolute right-0 top-0 bottom-0 rounded-l-none"
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
