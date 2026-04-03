import { TrendingUp, Sun, Moon, LayoutDashboard, Home } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  view: 'landing' | 'dashboard'
  onNavigate: (view: 'landing' | 'dashboard') => void
}

export function Navbar({ view, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">
            Crypto<span className="text-violet-600">Watcher</span>
          </span>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {view === 'landing' ? (
            <Button onClick={() => onNavigate('dashboard')} size="sm">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onNavigate('landing')}>
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
