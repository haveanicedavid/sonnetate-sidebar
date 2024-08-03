import { Save } from 'lucide-react'
import type { FormEvent } from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

type SummaryInputProps = {
  userInput: string
  isLoading: boolean
  summarySaved: boolean
  hasSummary: boolean
  onInputChange: (value: string) => void
  onSummarize: () => void
  onSave: () => void
}

export function SummaryInput({
  userInput,
  isLoading,
  summarySaved,
  hasSummary,
  onInputChange,
  onSummarize,
  onSave,
}: SummaryInputProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userInput && !isLoading) {
      onSummarize()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Input
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask this page a question"
          className={hasSummary ? 'pr-36' : userInput ? 'pr-24' : 'pr-2'}
          disabled={isLoading}
        />
        <div className="absolute bottom-0 right-0 top-0 flex items-center space-x-1 pr-0">
          {hasSummary && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8 p-0"
                    variant="ghost"
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
            </TooltipProvider>
          )}
          {userInput && (
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 px-3 text-sm transition-all duration-300 ease-in-out"
            >
              <span className="block overflow-hidden whitespace-nowrap">
                {isLoading ? 'Processing...' : 'Send'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
