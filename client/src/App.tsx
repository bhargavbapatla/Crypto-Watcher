import { useState } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/components/LandingPage'
import { Dashboard } from '@/components/Dashboard'
import './App.css'

type AppView = 'landing' | 'dashboard'

function AppContent() {
  const [view, setView] = useState<AppView>('landing')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar view={view} onNavigate={setView} />
      {view === 'landing' ? (
        <LandingPage onEnterDashboard={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
