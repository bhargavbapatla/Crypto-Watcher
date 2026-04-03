import {
  TrendingUp, TrendingDown, BarChart2, LineChart, Table2,
  Zap, Shield, Moon, ArrowRight, Activity, Wifi, WifiOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import { formatPercent } from '@/lib/utils'
import type { PriceMap } from '@/types/crypto'

interface LandingPageProps {
  onEnterDashboard: () => void
  prices: PriceMap
  connected: boolean
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Prices',
    description: 'WebSocket stream direct from Binance — tick-by-tick updates with zero polling.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: BarChart2,
    title: 'Multiple Chart Views',
    description: 'Analyze with live area charts, bar charts, price-history lines, and a data table.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: Moon,
    title: 'Dark / Light Mode',
    description: 'Easy on the eyes — switch between themes anytime with one click.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Shield,
    title: 'No API Keys',
    description: 'Connects via your local server which bridges directly to Binance WebSocket.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
]

function formatLivePrice(price: string): string {
  const n = parseFloat(price)
  if (isNaN(n)) return '—'
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toFixed(2)
}

function LiveTickerBar({ prices, connected }: { prices: PriceMap; connected: boolean }) {
  const symbols = Object.keys(COIN_META)
  const hasData = symbols.some(s => prices[s])

  return (
    <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 py-3 overflow-hidden">
      {!connected || !hasData ? (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          {connected
            ? <><span className="animate-pulse">⏳</span> Waiting for first tick…</>
            : <><WifiOff className="h-4 w-4" /> Server offline — start the backend to see live prices</>}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-8 flex-wrap px-4">
          {symbols.map(symbol => {
            const data = prices[symbol]
            const meta = COIN_META[symbol]
            if (!data) return null
            const changeNum = parseFloat(data.change24h)
            const isPos = changeNum >= 0
            return (
              <div key={symbol} className="flex items-center gap-3 shrink-0">
                <img src={meta.icon} alt={meta.name} className="h-6 w-6 rounded-full" />
                <div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {getShortSymbol(symbol)}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                    ${formatLivePrice(data.lastPrice)}
                  </span>
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPos ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(changeNum)}
                </span>
              </div>
            )
          })}
          <div className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>
      )}
    </div>
  )
}

function StatBubble({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs font-medium text-white/70 mt-1">{label}</div>
    </div>
  )
}

export function LandingPage({ onEnterDashboard, prices, connected }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-slate-900 to-blue-900">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-8">
            {connected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-white/80">
                  <Wifi className="inline h-3.5 w-3.5 mr-1" />Live Binance Feed Active
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-red-400" />
                <span className="text-sm font-medium text-white/60">Server Offline</span>
              </>
            )}
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Track Crypto
            <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Prices Live
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
            Real-time prices streamed directly from Binance via WebSocket.
            Charts, tables, and cards — all updating live, tick by tick.
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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <StatBubble label="Tracked Pairs" value="3" />
            <StatBubble label="Update Speed" value="Live" />
            <StatBubble label="Chart Types" value="4" />
            <StatBubble label="Themes" value="2" />
          </div>
        </div>
      </div>

      {/* Live ticker */}
      <LiveTickerBar prices={prices} connected={connected} />

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything powered by{' '}
            <span className="text-violet-600">live data</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            No polling, no stale snapshots — every number you see is fresh from the WebSocket stream.
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
            Four ways to view live data
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Switch between views instantly — all driven by the same live stream.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Activity, label: 'Cards View', desc: 'Price cards with live sparklines' },
              { icon: LineChart, label: 'Line Chart', desc: 'Real-time price history' },
              { icon: BarChart2, label: 'Bar Chart', desc: '24h change & volume bars' },
              { icon: Table2, label: 'Table View', desc: 'All fields, sortable live' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 min-w-36"
                >
                  <Icon className="h-6 w-6 text-violet-500" />
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.label}</span>
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
          Ready to watch live prices?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Jump into the dashboard — every number updates in real time.
        </p>
        <Button size="lg" onClick={onEnterDashboard} className="px-10 font-bold shadow-lg">
          <TrendingUp className="h-5 w-5" />
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-400">
        <p>Streaming from Binance via WebSocket · BTC · ETH · BNB</p>
      </footer>
    </div>
  )
}
