import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, BarChart2, LineChart, Table2,
  Zap, Shield, Moon, ArrowRight, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface LandingPageProps {
  onEnterDashboard: () => void
}

const TICKER_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67420, change: 2.34, color: '#f59e0b' },
  { symbol: 'ETH', name: 'Ethereum', price: 3521, change: -1.12, color: '#6366f1' },
  { symbol: 'SOL', name: 'Solana', price: 182.5, change: 5.67, color: '#10b981' },
  { symbol: 'BNB', name: 'BNB', price: 598, change: 0.84, color: '#eab308' },
  { symbol: 'XRP', name: 'XRP', price: 0.621, change: -2.31, color: '#06b6d4' },
  { symbol: 'ADA', name: 'Cardano', price: 0.524, change: 3.15, color: '#8b5cf6' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.168, change: 7.42, color: '#f97316' },
  { symbol: 'DOT', name: 'Polkadot', price: 9.21, change: -0.95, color: '#ec4899' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Live Prices',
    description: 'Real-time data refreshed every minute from CoinGecko API.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: BarChart2,
    title: 'Multiple Chart Views',
    description: 'Analyze with area charts, bar charts, line comparisons, and data tables.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: Moon,
    title: 'Dark / Light Mode',
    description: 'Easy on the eyes — switch between themes anytime.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Shield,
    title: 'Top 10 Cryptos',
    description: 'Track Bitcoin, Ethereum, Solana, and 7 more leading cryptocurrencies.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
]

function PriceTicker() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const tick = setInterval(() => {
      setOffset(o => (o - 1) % (TICKER_COINS.length * 220))
    }, 30)
    return () => clearInterval(tick)
  }, [])

  const doubled = [...TICKER_COINS, ...TICKER_COINS]

  return (
    <div className="overflow-hidden border-y border-slate-200 dark:border-slate-800 py-3 bg-slate-50/50 dark:bg-slate-900/50">
      <div
        className="flex gap-6 transition-none"
        style={{ transform: `translateX(${offset}px)`, whiteSpace: 'nowrap' }}
      >
        {doubled.map((coin, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-400">•</span>
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: coin.color }}
            >
              {coin.symbol[0]}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {coin.symbol}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {formatCurrency(coin.price)}
            </span>
            <span
              className={`text-xs font-semibold ${coin.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
            >
              {coin.change >= 0 ? (
                <TrendingUp className="inline h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="inline h-3 w-3 mr-0.5" />
              )}
              {formatPercent(coin.change)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatBubble({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs font-medium text-white/70 mt-1">{label}</div>
      {sub && <div className="text-xs text-white/50 mt-0.5">{sub}</div>}
    </div>
  )
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-slate-900 to-blue-900">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glows */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-white/80">Live Market Data</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Track Crypto
            <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Prices Live
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
            Monitor the top 10 cryptocurrencies with real-time prices, interactive charts,
            and a clean dashboard — in light or dark mode.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={onEnterDashboard}
              className="bg-white text-violet-900 hover:bg-white/90 shadow-xl px-8 font-bold"
            >
              <Activity className="h-5 w-5" />
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onEnterDashboard}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              View Live Prices
            </Button>
          </div>

          {/* Stats bubbles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <StatBubble label="Tracked Assets" value="10+" />
            <StatBubble label="Data Refresh" value="60s" />
            <StatBubble label="Chart Types" value="4" />
            <StatBubble label="Themes" value="2" sub="Light & Dark" />
          </div>
        </div>
      </div>

      {/* Ticker */}
      <PriceTicker />

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to{' '}
            <span className="text-violet-600">watch crypto</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            A clean, fast dashboard with all the charts and data you need.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex rounded-xl p-3 mb-4 ${f.bg}`}>
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Views preview */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Four ways to view your data
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Switch between views instantly — no page reload required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Activity, label: 'Cards View', desc: 'Price cards with sparklines' },
              { icon: LineChart, label: 'Line Chart', desc: '7-day trend comparison' },
              { icon: BarChart2, label: 'Bar Chart', desc: 'Market cap & volume bars' },
              { icon: Table2, label: 'Table View', desc: 'Sortable data table' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 min-w-36"
                >
                  <Icon className="h-6 w-6 text-violet-500" />
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-400 text-center">{item.desc}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to start watching?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Jump into the dashboard and start tracking crypto prices now.
        </p>
        <Button size="lg" onClick={onEnterDashboard} className="px-10 font-bold shadow-lg">
          <TrendingUp className="h-5 w-5" />
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-400">
        <p>
          Data from{' '}
          <span className="font-medium text-slate-600 dark:text-slate-400">CoinGecko API</span>
          {' '}· Prices refreshed every 60 seconds
        </p>
      </footer>
    </div>
  )
}
