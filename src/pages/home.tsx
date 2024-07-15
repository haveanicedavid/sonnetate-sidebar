import { id } from '@instantdb/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HorizontalSummaryList } from '@/components/horizontal-summary-list'
import { LoadingScreen } from '@/components/loading-screen'
import { MarkdownContent } from '@/components/markdown-content'
import { SummaryInput } from '@/components/summary-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/db'
import { createSummary } from '@/db/actions/summary'
import { useUser } from '@/db/ui-store'
import { streamTransformedMarkdown } from '@/lib/ai/messages'
import { useCurrentTab } from '@/lib/hooks/use-current-tab'

// import { MARKDOWN_STUB_WITH_HIERARCHY } from '@/lib/markdown/stub'

export function HomePage() {
  const { url, title: pageTitle } = useCurrentTab()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [userInput, setUserInput] = useState('')
  const [newSummaryId, setNewSummaryId] = useState(id())
  // const [summary, setSummary] = useState(MARKDOWN_STUB_WITH_HIERARCHY)
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user] = useUser()

  const { data, isLoading: isLoadingData } = db.useQuery({
    summaries: {
      $: {
        where: {
          url: url || 'https://www.sonnetate.com',
          'user.id': user.id,
        },
      },
    },
    topics: {},
  })

  const summaries = data?.summaries || []
  const topics = data?.topics || []

  useEffect(() => {
    if (!url) return
    setNewSummaryId(id())
    setSummary('')
  }, [url])

  async function handleSummarize() {
    const newId = id()
    setNewSummaryId(newId)
    setIsLoading(true)
    setSummary('')
    setError(null)

    try {
      if (url) {
        const tags = topics.map((t) => t.label).join(',')
        for await (const chunk of streamTransformedMarkdown({
          url,
          tags: tags.length > 0 ? tags : undefined,
          prompt: userInput,
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
      setUserInput('')
    }
  }

  async function handleSave(isPublic?: boolean) {
    setError(null)
    if (!newSummaryId) {
      setError('No summary to save')
      return
    }
    try {
      createSummary({
        md: summary,
        isPublic,
        id: newSummaryId,
        pageTitle: pageTitle || 'Untitled',
        url: url || 'https://www.sonnetate.com',
        userId: user.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      toast({
        description: `Summary ${isPublic ? 'shared' : 'saved'}`,
        duration: 3000,
      })
    }
  }

  function handleViewSummary(id: string) {
    navigate(`/summaries/${id}`)
  }

  const uiSummaries = summaries.map((summary) => ({
    id: summary.id,
    title: summary.title,
    description: summary.description,
  }))

  const fetchedSummary = summaries.find((s) => s.id === newSummaryId)
  const summarySaved = Boolean(fetchedSummary)
  const summaryShared = Boolean(fetchedSummary?.isPublic)

  if (isLoadingData) return <LoadingScreen />

  return (
    <div className="flex h-full flex-col">
      {uiSummaries.length > 0 && (
        <HorizontalSummaryList
          summaries={uiSummaries}
          onSummaryClick={handleViewSummary}
        />
      )}

      <div className="flex-grow overflow-auto p-4 pt-2">
        {error && (
          <Card className="mb-4 border-red-300 bg-red-100 p-4">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        <SummaryContent
          summary={summary}
          isLoading={isLoading}
          onSummarize={handleSummarize}
          hasUserInput={userInput.length > 0}
        />
      </div>

      <div className="p-4 pt-2">
        <SummaryInput
          userInput={userInput}
          isLoading={isLoading}
          summarySaved={summarySaved}
          summaryShared={summaryShared}
          onInputChange={setUserInput}
          onSummarize={handleSummarize}
          onSave={handleSave}
          hasSummary={summary.length > 0}
        />
      </div>
    </div>
  )
}

type SummaryContentProps = {
  summary: string
  isLoading: boolean
  onSummarize: () => void
  hasUserInput: boolean
}

function SummaryContent({
  summary,
  isLoading,
  onSummarize,
  hasUserInput,
}: SummaryContentProps) {
  return (
    <Card className="markdown relative h-full overflow-hidden">
      <CardContent className="flex h-full flex-col items-center justify-center p-4">
        <div className="max-h-full w-full overflow-auto py-4">
          {summary ? (
            <MarkdownContent content={summary} />
          ) : isLoading ? (
            <div className="text-center">
              <h6 className="mb-2 text-lg font-medium text-gray-500">
                Generating summary...
              </h6>
              <p className="text-sm text-gray-400">Please wait</p>
            </div>
          ) : hasUserInput ? (
            <div className="text-center">
              <h6 className="mb-2 text-lg font-medium text-gray-500">
                Ready to summarize
              </h6>
              <p className="text-sm text-gray-400">
                Type your prompt in the input below and click 'Send' or press
                Enter to generate a summary
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Button size="lg" onClick={onSummarize} className="text-lg">
                Summarize
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
