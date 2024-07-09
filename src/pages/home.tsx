import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useUserAtom } from '@/db/ui-store'
import { streamSummarization } from '@/lib/ai/messages'
import { MARKDOWN_STUB } from '@/lib/markdown/stub'

export function HomePage() {
  const [userInput, setUserInput] = useState('')
  const [summary, setSummary] = useState(MARKDOWN_STUB)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user] = useUserAtom()
  console.log('🪚 user:', user)

  const handleSummarize = async (prompt?: string) => {
    setIsLoading(true)
    setSummary('')
    setError(null)

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (tab.url) {
        for await (const chunk of streamSummarization({
          url: tab.url,
          prompt,
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4">
        <Button
          onClick={() => handleSummarize()}
          className="w-full mb-4"
          disabled={isLoading}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </Button>

        {error && (
          <Card className="p-4 mt-4 bg-red-100 border-red-300">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {summary && (
          <Card className="p-4 mt-4 markdown">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </Card>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <Separator className="flex-grow" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <Separator className="flex-grow" />
        </div>

        <form onSubmit={() => handleSummarize(userInput)}>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your prompt here..."
            className="min-h-[100px] mb-2"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}
