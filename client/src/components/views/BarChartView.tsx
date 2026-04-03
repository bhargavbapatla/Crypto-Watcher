import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatLargeNumber, formatCurrency, formatPercent } from '@/lib/utils'
import type { CryptoData } from '@/types/crypto'

type Metric = 'marketCap' | 'volume' | 'change24h'

const METRICS: { key: Metric; label: string; description: string }[] = [
  { key: 'marketCap', label: 'Market Cap', description: 'Total market capitalization in USD' },
  { key: 'volume', label: '24h Volume', description: '24-hour trading volume in USD' },
  { key: 'change24h', label: '24h Change %', description: 'Price change percentage over 24 hours' },
]

const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
]

interface BarChartViewProps {
  coins: CryptoData[]
  loading: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: CryptoData; value: number }>
  metric: Metric
}

function CustomTooltip({ active, payload, metric }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const coin = payload[0].payload
  const value = payload[0].value

  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
        <span className="font-bold text-slate-900 dark:text-white">{coin.name}</span>
      </div>
      <div className="text-slate-500 dark:text-slate-400">
        {metric === 'change24h' ? (
          <span className={`font-bold ${value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatPercent(value)}
          </span>
        ) : (
          <span className="font-bold text-violet-500">${formatLargeNumber(value)}</span>
        )}
      </div>
    </div>
  )
}

export function BarChartView({ coins, loading }: BarChartViewProps) {
  const [metric, setMetric] = useState<Metric>('marketCap')

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />

  const activeMetric = METRICS.find((m) => m.key === metric)!

  const chartData = [...coins]
    .sort((a, b) => {
      if (metric === 'marketCap') return b.market_cap - a.market_cap
      if (metric === 'volume') return b.total_volume - a.total_volume
      return b.price_change_percentage_24h_in_currency - a.price_change_percentage_24h_in_currency
    })
    .map((c) => ({
      ...c,
      displayName: c.symbol.toUpperCase(),
      value:
        metric === 'marketCap'
          ? c.market_cap
          : metric === 'volume'
          ? c.total_volume
          : c.price_change_percentage_24h_in_currency,
    }))

  const formatY = (v: number) =>
    metric === 'change24h' ? `${v.toFixed(1)}%` : `$${formatLargeNumber(v)}`

  return (
    <div className="space-y-4">
      {/* Metric selector */}
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <Button
            key={m.key}
            variant={metric === m.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetric(m.key)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{activeMetric.label} Comparison</CardTitle>
          <CardDescription>{activeMetric.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
                className="dark:stroke-slate-700"
              />
              <XAxis
                dataKey="displayName"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatY}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip metric={metric} />} cursor={{ opacity: 0.1 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.id}
                    fill={
                      metric === 'change24h'
                        ? entry.price_change_percentage_24h_in_currency >= 0
                          ? '#10b981'
                          : '#ef4444'
                        : COLORS[i % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {chartData.slice(0, 5).map((c, i) => (
          <Card key={c.id} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-3 w-3 rounded-sm shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <img src={c.image} alt={c.name} className="h-4 w-4 rounded-full" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {c.symbol.toUpperCase()}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {metric === 'change24h'
                ? formatPercent(c.price_change_percentage_24h_in_currency)
                : `$${formatLargeNumber(metric === 'marketCap' ? c.market_cap : c.total_volume)}`}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {formatCurrency(c.current_price)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
