export interface CoinMeta {
  name: string
  color: string
  icon: string
}

export const COIN_META: Record<string, CoinMeta> = {
  BTCUSDT: {
    name: 'Bitcoin',
    color: '#f59e0b',
    icon: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
  },
  ETHUSDT: {
    name: 'Ethereum',
    color: '#6366f1',
    icon: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
  },
  BNBUSDT: {
    name: 'BNB',
    color: '#eab308',
    icon: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png',
  },
}

export function getShortSymbol(symbol: string) {
  return symbol.replace('USDT', '')
}
