import { useState, useEffect, useCallback } from 'react'
import type { CryptoData, GlobalStats } from '@/types/crypto'

const COIN_IDS =
  'bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot,avalanche-2,chainlink'

export function useCryptoData() {
  const [coins, setCoins] = useState<CryptoData[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [coinsRes, globalRes] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
        ),
        fetch('https://api.coingecko.com/api/v3/global'),
      ])

      if (!coinsRes.ok || !globalRes.ok) {
        throw new Error(`API error: ${coinsRes.status || globalRes.status}`)
      }

      const coinsData: CryptoData[] = await coinsRes.json()
      const { data: global }: { data: GlobalStats } = await globalRes.json()

      setCoins(coinsData)
      setGlobalStats(global)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(msg)
      // Keep stale data visible if we already have some
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  return { coins, globalStats, loading, error, lastUpdated, refresh: fetchData }
}
