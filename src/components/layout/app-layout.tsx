import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '../header'

export function AppLayout() {
  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-grow overflow-auto dark:bg-muted/40 bg-muted/40">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
