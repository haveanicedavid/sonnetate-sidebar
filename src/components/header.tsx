import { Compass, Home, LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/db'
import { useTheme } from '@/lib/hooks/use-theme'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

export function Header() {
  return (
    <TooltipProvider>
      <header className="flex items-center justify-between border-b px-3 py-1">
        <Navigation />
        <UserActions />
      </header>
    </TooltipProvider>
  )
}

function Navigation() {
  const location = useLocation()

  return (
    <div className="flex space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                location.pathname === '/' && 'bg-accent'
              )}
            >
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
          <Link to="/summaries">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                location.pathname === '/explore' && 'bg-accent'
              )}
            >
              <Compass className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Explore saved summaries</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function UserActions() {
  const handleLogout = () => {
    db.auth.signOut()
  }

  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle />
      <UserMenu onLogout={handleLogout} />
    </div>
  )
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 focus-visible:ring-offset-0"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 focus-visible:ring-offset-0"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
