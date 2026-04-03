import { useState } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/components/LandingPage'
import { Dashboard } from '@/components/Dashboard'
import { useLiveData } from '@/hooks/useLiveData'
import type { LiveData } from '@/hooks/useLiveData'
import './App.css'

const WS_URL = 'wss://crypto-watcher-new.onrender.com/ws';

type AppView = 'landing' | 'dashboard'

function AppContent() {
  const [view, setView] = useState<AppView>('landing')
  const liveData: LiveData = useLiveData(WS_URL)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar view={view} onNavigate={setView} connected={liveData.connected} />
      {view === 'landing' ? (
        <LandingPage
          onEnterDashboard={() => setView('dashboard')}
          prices={liveData.prices}
          connected={liveData.connected}
        />
      ) : (
        <Dashboard liveData={liveData} />
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
