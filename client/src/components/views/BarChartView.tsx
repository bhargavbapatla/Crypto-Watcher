import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import type { PriceMap } from '@/types/crypto'

type Metric = 'change24h' | 'volume' | 'spread'

const METRICS: { key: Metric; label: string; description: string }[] = [
  { key: 'change24h', label: '24h Change %', description: '24-hour price change percentage' },
  { key: 'volume', label: '24h Volume', description: '24-hour trading volume (base asset)' },
  { key: 'spread', label: 'High/Low Spread', description: '24h high minus 24h low as % of current price' },
]

interface BarChartViewProps {
  prices: PriceMap
}

interface TooltipPayload {
  payload: { symbol: string; value: number; label: string }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const { symbol, value, label } = payload[0].payload
  const meta = COIN_META[symbol]
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900/95 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <img src={meta.icon} alt={meta.name} className="h-5 w-5 rounded-full" />
        <span className="font-bold text-slate-900 dark:text-white">{meta.name}</span>
      </div>
      <div className="font-bold text-violet-500">{label}: {value >= 0 ? '' : ''}{value.toFixed(4)}</div>
    </div>
  )
}

export function BarChartView({ prices }: BarChartViewProps) {
  const [metric, setMetric] = useState<Metric>('change24h')
  const symbols = Object.keys(COIN_META)
  const hasData = symbols.some(s => prices[s])

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-4xl animate-pulse">📊</div>
        <p className="text-sm font-medium">Waiting for first price update…</p>
      </div>
    )
  }

  const activeMetric = METRICS.find(m => m.key === metric)!

  const chartData = symbols
    .filter(s => prices[s])
    .map(s => {
      const d = prices[s]
      const price = parseFloat(d.lastPrice)
      const high = parseFloat(d.high24h)
      const low = parseFloat(d.low24h)
      let value: number

      if (metric === 'change24h') value = parseFloat(d.change24h)
      else if (metric === 'volume') value = parseFloat(d.volume)
      else value = ((high - low) / price) * 100

      const formatted =
        metric === 'volume'
          ? value.toLocaleString('en-US', { maximumFractionDigits: 0 })
          : `${value.toFixed(2)}%`

      return { symbol: s, displayName: getShortSymbol(s), value, label: activeMetric.label, formatted }
    })

  const formatY = (v: number) =>
    metric === 'volume' ? v.toLocaleString('en-US', { notation: 'compact' }) : `${v.toFixed(1)}%`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {METRICS.map(m => (
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
          <CardTitle className="text-base">{activeMetric.label}</CardTitle>
          <CardDescription>{activeMetric.description} · live data</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-700" />
              <XAxis dataKey="displayName" tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 700 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={65} />
              {metric === 'change24h' && <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />}
              <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.08 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {chartData.map(entry => (
                  <Cell
                    key={entry.symbol}
                    fill={
                      metric === 'change24h'
                        ? entry.value >= 0 ? '#10b981' : '#ef4444'
                        : COIN_META[entry.symbol].color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {chartData.map(entry => (
          <div key={entry.symbol} className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <div className="flex items-center gap-2 mb-2">
              <img src={COIN_META[entry.symbol].icon} alt="" className="h-5 w-5 rounded-full" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{getShortSymbol(entry.symbol)}</span>
            </div>
            <div
              className={`text-base font-bold ${
                metric === 'change24h'
                  ? entry.value >= 0 ? 'text-emerald-500' : 'text-red-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {entry.formatted}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{activeMetric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
