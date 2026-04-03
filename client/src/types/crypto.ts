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
export type SortField = 'symbol' | 'price' | 'change24h' | 'high' | 'low' | 'volume'
export type SortDir = 'asc' | 'desc'

export interface PricePoint {
  price: number
  timestamp: number
}

export type PriceHistory = Record<string, PricePoint[]>

export interface PriceData {
  symbol: string;
  lastPrice: string;
  change24h: string;
  high24h: string;
  low24h: string;
  volume: string;
  timestamp: number;
}

export interface WelcomeMessage {
  type: "welcome";
  message: string;
  connectedClients: number;
}

export interface ClientCountMessage {
  type: "client_count";
  connectedClients: number;
}

export interface PriceUpdateMessage extends PriceData {
  type: "price_update";
}

export type WSMessage = WelcomeMessage | ClientCountMessage | PriceUpdateMessage;

export interface PriceMap {
  [symbol: string]: PriceData;
}

export interface UseWebSocketReturn {
  prices: PriceMap;
  connected: boolean;
  clientCount: number;
}