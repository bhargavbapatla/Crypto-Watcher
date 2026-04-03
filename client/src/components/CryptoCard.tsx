import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SparklineChart } from '@/components/SparklineChart'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import { formatPercent } from '@/lib/utils'
import type { PriceData, PricePoint } from '@/types/crypto'
import { cn } from '@/lib/utils'

interface CryptoCardProps {
  symbol: string
  data: PriceData
  history: PricePoint[]
}

function formatPrice(price: string): string {
  const n = parseFloat(price)
  if (isNaN(n)) return '—'
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(2)
  return n.toFixed(4)
}

function useFlash(value: string) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current === value) return
    setFlash(parseFloat(value) > parseFloat(prev.current) ? 'up' : 'down')
    prev.current = value
    const t = setTimeout(() => setFlash(null), 700)
    return () => clearTimeout(t)
  }, [value])

  return flash
}

export function CryptoCard({ symbol, data, history }: CryptoCardProps) {
  const meta = COIN_META[symbol]
  const flash = useFlash(data.lastPrice)
  const changeNum = parseFloat(data.change24h)
  const isPositive = changeNum >= 0
  const sparklineData = history.map(p => p.price)

  return (
    <Card
      className={cn(
        'overflow-hidden transition-colors duration-500',
        flash === 'up' && 'border-emerald-300 dark:border-emerald-700',
        flash === 'down' && 'border-red-300 dark:border-red-700'
      )}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <img src={meta.icon} alt={meta.name} className="h-9 w-9 rounded-full" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                {meta.name}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase">
                {getShortSymbol(symbol)}/USDT
              </div>
            </div>
          </div>
          <Badge variant={isPositive ? 'positive' : 'negative'}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
            {formatPercent(changeNum)}
          </Badge>
        </div>

        {/* Price — flashes on update */}
        <div className="px-4 pb-2">
          <div
            className={cn(
              'text-2xl font-extrabold tracking-tight transition-colors duration-300',
              flash === 'up' ? 'text-emerald-500' : flash === 'down' ? 'text-red-500' : 'text-slate-900 dark:text-white'
            )}
          >
            ${formatPrice(data.lastPrice)}
          </div>
        </div>

        {/* Sparkline from live history */}
        <div className="px-2">
          {sparklineData.length > 1 ? (
            <SparklineChart data={sparklineData} positive={isPositive} height={56} />
          ) : (
            <div className="h-14 flex items-center justify-center text-xs text-slate-300 dark:text-slate-700">
              Collecting data…
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">24h High</div>
            <div className="text-xs font-semibold text-emerald-500">${formatPrice(data.high24h)}</div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">24h Low</div>
            <div className="text-xs font-semibold text-red-500">${formatPrice(data.low24h)}</div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">Volume</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {parseFloat(data.volume).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
