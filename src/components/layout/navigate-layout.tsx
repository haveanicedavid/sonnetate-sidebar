import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function NavigateLayout() {
  const navigate = useNavigate()

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <header className="flex items-center border-b border-gray-200 bg-gray-100 px-4 py-2">
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(1)}
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go forward</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        <main className="flex-grow overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  )
}
