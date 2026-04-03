import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SparklineChart } from '@/components/SparklineChart'
import { formatCurrency, formatPercent, formatLargeNumber } from '@/lib/utils'
import type { CryptoData, SortField, SortDir } from '@/types/crypto'

interface TableViewProps {
  coins: CryptoData[]
  loading: boolean
}

function SortIcon({ field, sort }: { field: SortField; sort: { field: SortField; dir: SortDir } }) {
  if (sort.field !== field)
    return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
  return sort.dir === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-violet-500" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-violet-500" />
  )
}

function ChangeCell({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        positive ? 'text-emerald-500' : 'text-red-500'
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {formatPercent(value)}
    </span>
  )
}

export function TableView({ coins, loading }: TableViewProps) {
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: 'rank',
    dir: 'asc',
  })

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="space-y-2 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  const handleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'desc' }
    )
  }

  const sorted = [...coins].sort((a, b) => {
    let av: number, bv: number
    switch (sort.field) {
      case 'rank': av = a.market_cap_rank; bv = b.market_cap_rank; break
      case 'price': av = a.current_price; bv = b.current_price; break
      case 'change24h':
        av = a.price_change_percentage_24h_in_currency
        bv = b.price_change_percentage_24h_in_currency
        break
      case 'marketCap': av = a.market_cap; bv = b.market_cap; break
      case 'volume': av = a.total_volume; bv = b.total_volume; break
      default: return 0
    }
    return sort.dir === 'asc' ? av - bv : bv - av
  })

  const SortableHead = ({
    field,
    children,
    className,
  }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <TableHead className={className}>
      <button
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        {children}
        <SortIcon field={field} sort={sort} />
      </button>
    </TableHead>
  )

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead field="rank" className="w-14">#</SortableHead>
            <TableHead className="min-w-40">Asset</TableHead>
            <SortableHead field="price" className="text-right">Price</SortableHead>
            <SortableHead field="change24h" className="text-right">1h</SortableHead>
            <SortableHead field="change24h" className="text-right">24h</SortableHead>
            <TableHead className="text-right">7d</TableHead>
            <SortableHead field="marketCap" className="text-right hidden md:table-cell">
              Market Cap
            </SortableHead>
            <SortableHead field="volume" className="text-right hidden lg:table-cell">
              Volume 24h
            </SortableHead>
            <TableHead className="text-right hidden xl:table-cell w-28">7d Chart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((coin) => {
            const change24h = coin.price_change_percentage_24h_in_currency
            const change7d = coin.price_change_percentage_7d_in_currency
            const change1h = coin.price_change_percentage_1h_in_currency

            return (
              <TableRow key={coin.id}>
                {/* Rank */}
                <TableCell>
                  <span className="text-sm font-semibold text-slate-400">
                    {coin.market_cap_rank}
                  </span>
                </TableCell>

                {/* Asset */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-8 w-8 rounded-full shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                        {coin.name}
                      </div>
                      <div className="text-xs text-slate-400 uppercase font-medium">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(coin.current_price)}
                  </span>
                </TableCell>

                {/* 1h change */}
                <TableCell className="text-right">
                  <ChangeCell value={change1h} />
                </TableCell>

                {/* 24h change */}
                <TableCell className="text-right">
                  <Badge variant={change24h >= 0 ? 'positive' : 'negative'}>
                    {formatPercent(change24h)}
                  </Badge>
                </TableCell>

                {/* 7d change */}
                <TableCell className="text-right">
                  <ChangeCell value={change7d} />
                </TableCell>

                {/* Market cap */}
                <TableCell className="text-right hidden md:table-cell">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    ${formatLargeNumber(coin.market_cap)}
                  </span>
                </TableCell>

                {/* Volume */}
                <TableCell className="text-right hidden lg:table-cell">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    ${formatLargeNumber(coin.total_volume)}
                  </span>
                </TableCell>

                {/* Sparkline */}
                <TableCell className="hidden xl:table-cell w-28">
                  <SparklineChart
                    data={coin.sparkline_in_7d.price}
                    positive={change7d >= 0}
                    height={40}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
