import { useState } from 'react'
import { Activity, BarChart2, LineChart, Table2, TrendingUp, TrendingDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CardsView } from '@/components/views/CardsView'
import { LineChartView } from '@/components/views/LineChartView'
import { BarChartView } from '@/components/views/BarChartView'
import { TableView } from '@/components/views/TableView'
import { LivePriceFeed } from '@/components/LivePriceFeed'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import { formatPercent } from '@/lib/utils'
import type { LiveData } from '@/hooks/useLiveData'
import type { ViewMode } from '@/types/crypto'

interface DashboardProps {
  liveData: LiveData
}

function formatPrice(s: string) {
  const n = parseFloat(s)
  if (isNaN(n)) return '—'
  if (n >= 1000) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${n.toFixed(2)}`
}

function StatCard({
  symbol,
  prices,
  loading,
}: {
  symbol: string
  prices: LiveData['prices']
  loading: boolean
}) {
  const data = prices[symbol]
  const meta = COIN_META[symbol]
  const change = data ? parseFloat(data.change24h) : 0
  const isPos = change >= 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {getShortSymbol(symbol)} / USDT
          </span>
          <img src={meta.icon} alt={meta.name} className="h-6 w-6 rounded-full" />
        </div>
        {loading || !data ? (
          <Skeleton className="h-7 w-32 mb-1" />
        ) : (
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {formatPrice(data.lastPrice)}
          </div>
        )}
        {data && (
          <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${isPos ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercent(change)} 24h
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Dashboard({ liveData }: DashboardProps) {
  const { prices, history, connected, clientCount } = liveData
  const [view, setView] = useState<ViewMode>('cards')
  const symbols = Object.keys(COIN_META)
  const hasData = symbols.some(s => prices[s])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Market Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {connected
              ? `Streaming live from Binance · ${symbols.length} pairs`
              : 'Connecting to server…'}
          </p>
        </div>

        {/* Live feed bar */}
        <LivePriceFeed prices={prices} connected={connected} clientCount={clientCount} />

        {/* Per-coin stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {symbols.map(s => (
            <StatCard key={s} symbol={s} prices={prices} loading={!hasData} />
          ))}
        </div>

        {/* View Tabs */}
        <Tabs value={view} onValueChange={v => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="cards">
              <Activity className="h-4 w-4" />Cards
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChart className="h-4 w-4" />Line
            </TabsTrigger>
            <TabsTrigger value="bar">
              <BarChart2 className="h-4 w-4" />Bar
            </TabsTrigger>
            <TabsTrigger value="table">
              <Table2 className="h-4 w-4" />Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <CardsView prices={prices} history={history} />
          </TabsContent>
          <TabsContent value="line">
            <LineChartView history={history} />
          </TabsContent>
          <TabsContent value="bar">
            <BarChartView prices={prices} />
          </TabsContent>
          <TabsContent value="table">
            <TableView prices={prices} history={history} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
