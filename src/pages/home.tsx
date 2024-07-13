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
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/db'
import { createSummary } from '@/db/actions/summary'
import { useUser } from '@/db/ui-store'
import { streamTransformedMarkdown } from '@/lib/ai/messages'
import { useCurrentTab } from '@/lib/hooks/use-current-tab'
import { MARKDOWN_STUB_WITH_HIERARCHY } from '@/lib/markdown/stub'

export function HomePage() {
  const { url, title: pageTitle } = useCurrentTab()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [userInput, setUserInput] = useState('')
  const [newSummaryId, setNewSummaryId] = useState(id())
  const [summary, setSummary] = useState(MARKDOWN_STUB_WITH_HIERARCHY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user] = useUser()

  useEffect(() => {
    if (!url) return
    setNewSummaryId(id())
  }, [url])

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

  async function handleSummarize() {
    const newId = id()
    setNewSummaryId(newId)
    setIsLoading(true)
    setSummary('')
    setError(null)

    try {
      if (url) {
        for await (const chunk of streamTransformedMarkdown({
          prompt: userInput,
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
      toast({ description: `Summary ${isPublic ? 'shared' : 'saved'}` })
    }
  }

  function handleViewSummary(id: string) {
    navigate(`/summaries/${id}`)
  }

  const summaries = data?.summaries || []
  const uiSummaries = summaries.map((summary) => ({
    id: summary.id,
    title: summary.title,
    description: summary.description,
  }))

  const fetchedSummary = summaries.find((s) => s.id === newSummaryId)
  const summarySaved = Boolean(fetchedSummary)
  const summaryShared = Boolean(fetchedSummary?.isPublic)

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {uiSummaries.length > 0 && (
          <HorizontalSummaryList
            summaries={uiSummaries}
            onSummaryClick={handleViewSummary}
          />
        )}

        <div className="flex-grow overflow-auto p-4">
          {error && (
            <Card className="mb-4 border-red-300 bg-red-100 p-4">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          <SummaryContent
            summary={summary}
            isLoading={isLoading}
            summarySaved={summarySaved}
            summaryShared={summaryShared}
            onSave={handleSave}
          />
        </div>

        <div className="p-2">
          <SummaryInput
            userInput={userInput}
            isLoading={isLoading}
            onInputChange={setUserInput}
            onSummarize={handleSummarize}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

type SummaryActionsProps = {
  isLoading: boolean
  summarySaved: boolean
  summaryShared: boolean
  onSave: (isPublic?: boolean) => void
}

function SummaryActions({
  isLoading,
  summarySaved,
  summaryShared,
  onSave,
}: SummaryActionsProps) {
  return (
    <div className="absolute right-2 top-2 z-10 flex space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onSave()}
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
            variant="outline"
            onClick={() => onSave(true)}
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
  )
}

type SummaryContentProps = {
  summary: string
  isLoading: boolean
  summarySaved: boolean
  summaryShared: boolean
  onSave: (isPublic?: boolean) => void
}

function SummaryContent({
  summary,
  isLoading,
  summarySaved,
  summaryShared,
  onSave,
}: SummaryContentProps) {
  return (
    <Card className="markdown relative h-full overflow-visible">
      <SummaryActions
        isLoading={isLoading}
        summarySaved={summarySaved}
        summaryShared={summaryShared}
        onSave={onSave}
      />
      <CardContent className="h-full overflow-auto p-4">
        {summary ? (
          <MarkdownContent content={summary} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h6 className="mb-2 text-lg font-medium text-gray-500">
                {isLoading ? 'Generating summary...' : 'Ready to summarize'}
              </h6>
              <p className="text-sm text-gray-400">
                {isLoading
                  ? 'Please wait'
                  : "Enter a prompt or click 'Summarize' to begin"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type SummaryInputProps = {
  userInput: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSummarize: () => void
}

function SummaryInput({
  userInput,
  isLoading,
  onInputChange,
  onSummarize,
}: SummaryInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Input
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your prompt, or just... →"
          className="pr-24"
          disabled={isLoading}
        />
        <Button
          onClick={onSummarize}
          className="absolute bottom-0 right-0 top-0 rounded-l-none"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Summarize'}
        </Button>
      </div>
    </div>
  )
}
