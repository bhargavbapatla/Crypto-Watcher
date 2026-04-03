import { useState } from 'react'
import {
  Activity, BarChart2, LineChart, Table2,
  TrendingUp, TrendingDown, Globe, RefreshCw, AlertCircle,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardsView } from '@/components/views/CardsView'
import { LineChartView } from '@/components/views/LineChartView'
import { BarChartView } from '@/components/views/BarChartView'
import { TableView } from '@/components/views/TableView'
import { useCryptoData } from '@/hooks/useCryptoData'
import { formatCurrency, formatLargeNumber, formatPercent } from '@/lib/utils'
import type { ViewMode } from '@/types/crypto'

interface StatCardProps {
  label: string
  value: string
  change?: number
  sub?: string
  icon: React.ReactNode
  loading: boolean
}

function StatCard({ label, value, change, sub, icon, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-500 dark:text-slate-400">
            {icon}
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-7 w-32 mb-1" />
        ) : (
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {value}
          </div>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          {change !== undefined && !loading && (
            <span
              className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
            >
              {change >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
              {' '}{formatPercent(change)}
            </span>
          )}
          {sub && (
            <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { coins, globalStats, loading, error, lastUpdated, refresh } = useCryptoData()
  const [view, setView] = useState<ViewMode>('cards')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Market Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {loading
                ? 'Loading market data...'
                : `Tracking ${coins.length} cryptocurrencies · ${
                    lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''
                  }`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="hidden sm:flex"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {error.includes('429')
                ? 'Rate limited by CoinGecko API. Showing last cached data. Retrying in 60s...'
                : `Error: ${error}. Showing last cached data.`}
            </span>
          </div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Market Cap"
            value={globalStats ? `$${formatLargeNumber(globalStats.total_market_cap.usd)}` : '—'}
            change={globalStats?.market_cap_change_percentage_24h_usd}
            icon={<Globe className="h-4 w-4" />}
            loading={loading}
          />
          <StatCard
            label="24h Volume"
            value={globalStats ? `$${formatLargeNumber(globalStats.total_volume.usd)}` : '—'}
            sub="across all markets"
            icon={<BarChart2 className="h-4 w-4" />}
            loading={loading}
          />
          <StatCard
            label="BTC Dominance"
            value={globalStats ? `${globalStats.market_cap_percentage.btc.toFixed(1)}%` : '—'}
            sub="of total market cap"
            icon={<Activity className="h-4 w-4" />}
            loading={loading}
          />
          <StatCard
            label="Top Asset"
            value={
              coins.length > 0 ? formatCurrency(coins[0]?.current_price ?? 0) : '—'
            }
            change={coins[0]?.price_change_percentage_24h_in_currency}
            sub={coins[0] ? `${coins[0].name} (BTC)` : ''}
            icon={<TrendingUp className="h-4 w-4" />}
            loading={loading}
          />
        </div>

        {/* View Tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="cards">
              <Activity className="h-4 w-4" />
              <span className="hidden xs:inline">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChart className="h-4 w-4" />
              <span className="hidden xs:inline">Line</span>
            </TabsTrigger>
            <TabsTrigger value="bar">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden xs:inline">Bar</span>
            </TabsTrigger>
            <TabsTrigger value="table">
              <Table2 className="h-4 w-4" />
              <span className="hidden xs:inline">Table</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <CardsView coins={coins} loading={loading} />
          </TabsContent>

          <TabsContent value="line">
            <LineChartView coins={coins} loading={loading} />
          </TabsContent>

          <TabsContent value="bar">
            <BarChartView coins={coins} loading={loading} />
          </TabsContent>

          <TabsContent value="table">
            <TableView coins={coins} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
