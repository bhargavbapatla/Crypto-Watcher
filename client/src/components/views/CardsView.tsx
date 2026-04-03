import { CryptoCard } from '@/components/CryptoCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { CryptoData } from '@/types/crypto'

interface CardsViewProps {
  coins: CryptoData[]
  loading: boolean
}

export function CardsView({ coins, loading }: CardsViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {coins.map((coin) => (
        <CryptoCard key={coin.id} coin={coin} />
      ))}
    </div>
  )
}
