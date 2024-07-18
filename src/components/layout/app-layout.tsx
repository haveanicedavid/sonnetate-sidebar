import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

import { Header } from '../header'

export function AppLayout() {
  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-grow overflow-auto bg-muted/40 dark:bg-muted/20">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
