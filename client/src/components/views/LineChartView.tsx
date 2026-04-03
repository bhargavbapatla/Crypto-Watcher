import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import type { PriceHistory } from '@/types/crypto'

interface LineChartViewProps {
  history: PriceHistory
}

const COLORS: Record<string, string> = {
  BTCUSDT: '#f59e0b',
  ETHUSDT: '#6366f1',
  BNBUSDT: '#eab308',
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 text-xs">
      <p className="font-semibold text-slate-400 mb-2">Tick #{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className={`font-bold ${p.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {p.value >= 0 ? '+' : ''}{p.value.toFixed(3)}%
          </span>
        </div>
      ))}
    </div>
  )
}

function buildChartData(history: PriceHistory) {
  const symbols = Object.keys(COIN_META)

  // Use the last 100 ticks; align by minimum length so lines are same length
  const sliced = Object.fromEntries(
    symbols.map(s => [s, (history[s] ?? []).slice(-100)])
  )
  const len = Math.min(...symbols.map(s => sliced[s].length))
  if (len < 2) return []

  return Array.from({ length: len }, (_, i) => {
    const point: Record<string, number | string> = { tick: i + 1 }
    symbols.forEach(s => {
      const ticks = sliced[s]
      const base = ticks[0].price
      point[getShortSymbol(s)] = +((ticks[i].price / base - 1) * 100).toFixed(3)
    })
    return point
  })
}

export function LineChartView({ history }: LineChartViewProps) {
  const chartData = buildChartData(history)
  const symbols = Object.keys(COIN_META)

  if (chartData.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-4xl animate-pulse">📈</div>
        <p className="text-sm font-medium">Collecting price history…</p>
        <p className="text-xs text-slate-300 dark:text-slate-600">Chart will appear once ticks start arriving</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Live Price History — % Change</CardTitle>
          <CardDescription>
            Normalised to the first received tick · last 100 data points · updates on every tick
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis
                dataKey="tick"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Tick', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`}
                width={58}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" iconSize={8} />
              {symbols.map(s => (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={getShortSymbol(s)}
                  stroke={COLORS[s]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mini legend with latest % */}
      <div className="grid grid-cols-3 gap-3">
        {symbols.map(s => {
          const ticks = history[s]
          if (!ticks || ticks.length < 2) return null
          const base = ticks[Math.max(0, ticks.length - 100)].price
          const latest = ticks[ticks.length - 1].price
          const pct = (latest / base - 1) * 100
          return (
            <div
              key={s}
              className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-center gap-2"
            >
              <img src={COIN_META[s].icon} alt={COIN_META[s].name} className="h-6 w-6 rounded-full shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{getShortSymbol(s)}</div>
                <div className={`text-xs font-semibold ${pct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {pct >= 0 ? '+' : ''}{pct.toFixed(3)}% since start
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
