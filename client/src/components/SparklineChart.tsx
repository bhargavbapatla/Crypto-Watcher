import { ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SparklineChartProps {
  data: number[]
  positive: boolean
  height?: number
}

export function SparklineChart({ data, positive, height = 48 }: SparklineChartProps) {
  if (!data || data.length === 0) return null

  // Sample to ~30 points for performance
  const step = Math.max(1, Math.floor(data.length / 30))
  const chartData = data
    .filter((_, i) => i % step === 0)
    .map((value) => ({ value }))

  const color = positive ? '#10b981' : '#ef4444'
  const fillId = `fill-${positive ? 'pos' : 'neg'}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${fillId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
