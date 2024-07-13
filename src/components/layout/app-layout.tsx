import { Compass, Home, LogOut } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/db'

import { ThemeToggle } from '../toggle-theme'

type LayoutProps = {
  exploreNotifications?: number
}

export function AppLayout({ exploreNotifications = 0 }: LayoutProps) {
  const handleLogout = () => {
    db.auth.signOut()
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <header className="flex items-center justify-between border-b px-2 py-1">
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/explore">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-7 w-7"
                  >
                    <Compass className="h-4 w-4" />
                    {exploreNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]"
                      >
                        {exploreNotifications > 99
                          ? '99+'
                          : exploreNotifications}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Explore</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log out</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        <main className="flex-grow overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  )
}
