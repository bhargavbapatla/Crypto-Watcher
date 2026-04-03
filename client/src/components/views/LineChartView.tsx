import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CryptoData } from '@/types/crypto'

const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
]

interface LineChartViewProps {
  coins: CryptoData[]
  loading: boolean
}

// Normalize sparkline to % change from start
function normalizeSparkline(prices: number[]): number[] {
  if (!prices || prices.length === 0) return []
  const base = prices[0]
  // Sample to ~14 daily points
  const step = Math.max(1, Math.floor(prices.length / 14))
  return prices.filter((_, i) => i % step === 0).map((p) => +((p / base - 1) * 100).toFixed(3))
}

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 text-xs">
      <p className="font-semibold text-slate-500 mb-2 dark:text-slate-400">Day {label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600 dark:text-slate-300">{p.name}:</span>
          <span className={`font-bold ${p.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {p.value >= 0 ? '+' : ''}{p.value.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export function LineChartView({ coins, loading }: LineChartViewProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(coins.slice(0, 5).map((c) => c.id))
  )

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />

  const toggleCoin = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredCoins = coins.filter((c) => selected.has(c.id))

  // Build chart data: each point is one day, columns are coins
  const maxLen = Math.max(...filteredCoins.map((c) => normalizeSparkline(c.sparkline_in_7d.price).length))
  const chartData = Array.from({ length: maxLen }, (_, i) => {
    const point: Record<string, number | string> = { day: i + 1 }
    filteredCoins.forEach((c) => {
      const normalized = normalizeSparkline(c.sparkline_in_7d.price)
      point[c.symbol.toUpperCase()] = normalized[i] ?? 0
    })
    return point
  })

  return (
    <div className="space-y-4">
      {/* Coin selector */}
      <div className="flex flex-wrap gap-2">
        {coins.map((c, i) => {
          const color = COLORS[i % COLORS.length]
          const isActive = selected.has(c.id)
          return (
            <button
              key={c.id}
              onClick={() => toggleCoin(c.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900'
              }`}
              style={isActive ? { backgroundColor: color, borderColor: color } : {}}
            >
              <img src={c.image} alt={c.name} className="h-4 w-4 rounded-full" />
              {c.symbol.toUpperCase()}
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">7-Day Price Trend (% Change)</CardTitle>
          <CardDescription>Normalized performance relative to 7 days ago</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Days', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                iconType="circle"
                iconSize={8}
              />
              {filteredCoins.map((c) => (
                <Line
                  key={c.id}
                  type="monotone"
                  dataKey={c.symbol.toUpperCase()}
                  stroke={COLORS[coins.indexOf(c) % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mini price changes legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {filteredCoins.map((c) => {
          const change = c.price_change_percentage_7d_in_currency
          return (
            <div
              key={c.id}
              className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-center gap-2"
            >
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[coins.indexOf(c) % COLORS.length] }}
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                  {c.symbol.toUpperCase()}
                </div>
                <div
                  className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
