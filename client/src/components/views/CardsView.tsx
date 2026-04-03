import { CryptoCard } from '@/components/CryptoCard'
import { Skeleton } from '@/components/ui/skeleton'
import { COIN_META } from '@/lib/coinMeta'
import type { PriceMap, PriceHistory } from '@/types/crypto'

interface CardsViewProps {
  prices: PriceMap
  history: PriceHistory
}

export function CardsView({ prices, history }: CardsViewProps) {
  const symbols = Object.keys(COIN_META)
  const hasAny = symbols.some(s => prices[s])

  if (!hasAny) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {symbols.map(s => <Skeleton key={s} className="h-56 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {symbols.map(symbol => {
        const data = prices[symbol]
        if (!data) return <Skeleton key={symbol} className="h-56 rounded-xl" />
        return (
          <CryptoCard
            key={symbol}
            symbol={symbol}
            data={data}
            history={history[symbol] ?? []}
          />
        )
      })}
    </div>
  )
}
