import { useEffect, useRef, useState } from 'react'
import { Wifi, WifiOff, Users, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import { formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { PriceMap } from '@/types/crypto'

interface LivePriceFeedProps {
  prices: PriceMap
  connected: boolean
  clientCount: number
}

function formatPrice(s: string) {
  const n = parseFloat(s)
  if (isNaN(n)) return '—'
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toFixed(2)
}

function useFlash(value: string) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    setFlash(parseFloat(value) > parseFloat(prev.current) ? 'up' : 'down')
    prev.current = value
    const t = setTimeout(() => setFlash(null), 600)
    return () => clearTimeout(t)
  }, [value])
  return flash
}

function PriceCell({ symbol, prices }: { symbol: string; prices: PriceMap }) {
  const data = prices[symbol]
  const flash = useFlash(data?.lastPrice ?? '')
  const meta = COIN_META[symbol]

  if (!data) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  const changeNum = parseFloat(data.change24h)
  const isPos = changeNum >= 0

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-500',
        flash === 'up'
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
          : flash === 'down'
          ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      )}
    >
      <img src={meta.icon} alt={meta.name} className="h-8 w-8 rounded-full shrink-0" />
      <div className="min-w-0">
        <div className="text-xs font-semibold text-slate-400">{getShortSymbol(symbol)}/USDT</div>
        <div className="text-xs text-slate-400">{meta.name}</div>
      </div>
      <div className="ml-auto text-right">
        <div
          className={cn(
            'text-base font-extrabold tracking-tight transition-colors duration-300',
            flash === 'up' ? 'text-emerald-600 dark:text-emerald-400'
              : flash === 'down' ? 'text-red-600 dark:text-red-400'
              : 'text-slate-900 dark:text-white'
          )}
        >
          ${formatPrice(data.lastPrice)}
        </div>
        <div className={cn('flex items-center justify-end gap-0.5 text-xs font-semibold', isPos ? 'text-emerald-500' : 'text-red-500')}>
          {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {formatPercent(changeNum)}
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end text-xs gap-0.5 pl-3 border-l border-slate-100 dark:border-slate-800">
        <span className="text-emerald-500 font-medium">H: ${formatPrice(data.high24h)}</span>
        <span className="text-red-500 font-medium">L: ${formatPrice(data.low24h)}</span>
      </div>
    </div>
  )
}

export function LivePriceFeed({ prices, connected, clientCount }: LivePriceFeedProps) {
  const symbols = Object.keys(COIN_META)

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Live Binance Feed</span>
          {connected && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {clientCount > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
              <Users className="h-3 w-3" />{clientCount} watching
            </span>
          )}
          <div className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
            connected
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
          )}>
            {connected ? <><Wifi className="h-3 w-3" /> Connected</> : <><WifiOff className="h-3 w-3" /> Disconnected</>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {symbols.map(s => <PriceCell key={s} symbol={s} prices={prices} />)}
      </div>
    </div>
  )
}
