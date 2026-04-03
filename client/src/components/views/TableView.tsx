import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SparklineChart } from '@/components/SparklineChart'
import { COIN_META, getShortSymbol } from '@/lib/coinMeta'
import { formatPercent } from '@/lib/utils'
import type { PriceMap, PriceHistory, SortField, SortDir } from '@/types/crypto'

interface TableViewProps {
  prices: PriceMap
  history: PriceHistory
}

function formatPrice(s: string) {
  const n = parseFloat(s)
  if (isNaN(n)) return '—'
  if (n >= 1000) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (n >= 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(4)}`
}

function formatVolume(s: string) {
  const n = parseFloat(s)
  if (isNaN(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function formatTs(ts: number) {
  return new Date(ts).toLocaleTimeString()
}

type SortIconProps = { field: SortField; active: SortField; dir: SortDir }
function SortIcon({ field, active, dir }: SortIconProps) {
  if (active !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
  return dir === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 text-violet-500" />
    : <ArrowDown className="h-3.5 w-3.5 text-violet-500" />
}

export function TableView({ prices, history }: TableViewProps) {
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: 'symbol', dir: 'asc' })

  const symbols = Object.keys(COIN_META)
  const hasData = symbols.some(s => prices[s])

  const handleSort = (field: SortField) =>
    setSort(prev => ({
      field,
      dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc',
    }))

  const rows = symbols
    .filter(s => prices[s])
    .sort((a, b) => {
      const da = prices[a]
      const db = prices[b]
      let av: number | string, bv: number | string
      switch (sort.field) {
        case 'symbol': av = a; bv = b; break
        case 'price': av = parseFloat(da.lastPrice); bv = parseFloat(db.lastPrice); break
        case 'change24h': av = parseFloat(da.change24h); bv = parseFloat(db.change24h); break
        case 'high': av = parseFloat(da.high24h); bv = parseFloat(db.high24h); break
        case 'low': av = parseFloat(da.low24h); bv = parseFloat(db.low24h); break
        case 'volume': av = parseFloat(da.volume); bv = parseFloat(db.volume); break
        default: return 0
      }
      if (typeof av === 'string') return sort.dir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sort.dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })

  const Head = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <button
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        {children}
        <SortIcon field={field} active={sort.field} dir={sort.dir} />
      </button>
    </TableHead>
  )

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-3 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-4xl animate-pulse">📋</div>
        <p className="text-sm font-medium">Waiting for first price update…</p>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <Head field="symbol">Asset</Head>
            <Head field="price" className="text-right">Price</Head>
            <Head field="change24h" className="text-right">24h Change</Head>
            <Head field="high" className="text-right hidden sm:table-cell">24h High</Head>
            <Head field="low" className="text-right hidden sm:table-cell">24h Low</Head>
            <Head field="volume" className="text-right hidden md:table-cell">Volume</Head>
            <TableHead className="text-right hidden lg:table-cell">Sparkline</TableHead>
            <TableHead className="text-right hidden xl:table-cell">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(symbol => {
            const d = prices[symbol]
            const meta = COIN_META[symbol]
            const change = parseFloat(d.change24h)
            const isPos = change >= 0
            const sparkData = (history[symbol] ?? []).map(p => p.price)

            return (
              <TableRow key={symbol}>
                {/* Asset */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={meta.icon} alt={meta.name} className="h-8 w-8 rounded-full shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{meta.name}</div>
                      <div className="text-xs text-slate-400 uppercase font-medium">{getShortSymbol(symbol)}/USDT</div>
                    </div>
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{formatPrice(d.lastPrice)}</span>
                </TableCell>

                {/* 24h change */}
                <TableCell className="text-right">
                  <Badge variant={isPos ? 'positive' : 'negative'}>
                    {isPos ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                    {formatPercent(change)}
                  </Badge>
                </TableCell>

                {/* High */}
                <TableCell className="text-right hidden sm:table-cell">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatPrice(d.high24h)}</span>
                </TableCell>

                {/* Low */}
                <TableCell className="text-right hidden sm:table-cell">
                  <span className="text-sm font-medium text-red-500">{formatPrice(d.low24h)}</span>
                </TableCell>

                {/* Volume */}
                <TableCell className="text-right hidden md:table-cell">
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{formatVolume(d.volume)}</span>
                </TableCell>

                {/* Sparkline */}
                <TableCell className="hidden lg:table-cell w-28">
                  {sparkData.length > 1
                    ? <SparklineChart data={sparkData} positive={isPos} height={40} />
                    : <span className="text-xs text-slate-300 dark:text-slate-700">—</span>}
                </TableCell>

                {/* Timestamp */}
                <TableCell className="text-right hidden xl:table-cell">
                  <span className="text-xs text-slate-400">{formatTs(d.timestamp)}</span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
