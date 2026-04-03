export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  sparkline_in_7d: {
    price: number[]
  }
}

export interface GlobalStats {
  total_market_cap: { usd: number }
  total_volume: { usd: number }
  market_cap_percentage: { btc: number; eth: number }
  market_cap_change_percentage_24h_usd: number
  active_cryptocurrencies: number
}

export type ViewMode = 'cards' | 'line' | 'bar' | 'table'
export type SortField = 'rank' | 'price' | 'change24h' | 'marketCap' | 'volume'
export type SortDir = 'asc' | 'desc'
