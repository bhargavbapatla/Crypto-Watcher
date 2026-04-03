import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SparklineChart } from '@/components/SparklineChart'
import { formatCurrency, formatPercent, formatLargeNumber } from '@/lib/utils'
import type { CryptoData } from '@/types/crypto'

interface CryptoCardProps {
  coin: CryptoData
}

export function CryptoCard({ coin }: CryptoCardProps) {
  const change24h = coin.price_change_percentage_24h_in_currency
  const change7d = coin.price_change_percentage_7d_in_currency
  const isPositive = change24h >= 0

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="h-9 w-9 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                {coin.name}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase">
                {coin.symbol}
              </div>
            </div>
          </div>
          <Badge variant={isPositive ? 'positive' : 'negative'}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            )}
            {formatPercent(change24h)}
          </Badge>
        </div>

        {/* Price */}
        <div className="px-4 pb-2">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(coin.current_price)}
          </div>
        </div>

        {/* Sparkline */}
        <div className="px-2">
          <SparklineChart
            data={coin.sparkline_in_7d.price}
            positive={isPositive}
            height={56}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 mt-1">
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">1h</div>
            <div
              className={`text-xs font-semibold ${
                coin.price_change_percentage_1h_in_currency >= 0
                  ? 'text-emerald-500'
                  : 'text-red-500'
              }`}
            >
              {formatPercent(coin.price_change_percentage_1h_in_currency)}
            </div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">7d</div>
            <div
              className={`text-xs font-semibold ${
                change7d >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {formatPercent(change7d)}
            </div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-xs text-slate-400 mb-0.5">MCap</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              ${formatLargeNumber(coin.market_cap)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
