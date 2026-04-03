import { useState, useEffect, useRef, useCallback } from 'react'
import type { PriceMap, PriceHistory, PriceData, WSMessage } from '@/types/crypto'

const MAX_HISTORY = 200 // ticks kept per symbol

export interface LiveData {
  prices: PriceMap
  history: PriceHistory
  connected: boolean
  clientCount: number
}

export function useLiveData(url: string): LiveData {
  const [prices, setPrices] = useState<PriceMap>({})
  const [history, setHistory] = useState<PriceHistory>({})
  const [connected, setConnected] = useState(false)
  const [clientCount, setClientCount] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close()

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WSMessage = JSON.parse(event.data as string)

        if (msg.type === 'welcome' || msg.type === 'client_count') {
          setClientCount(msg.connectedClients)
          return
        }

        if (msg.type === 'price_update') {
          const priceData: PriceData = {
            symbol: msg.symbol,
            lastPrice: msg.lastPrice,
            change24h: msg.change24h,
            high24h: msg.high24h,
            low24h: msg.low24h,
            volume: msg.volume,
            timestamp: msg.timestamp,
          }

          setPrices(prev => ({ ...prev, [msg.symbol]: priceData }))

          setHistory(prev => {
            const existing = prev[msg.symbol] ?? []
            const point = { price: parseFloat(msg.lastPrice), timestamp: msg.timestamp }
            const next = existing.length >= MAX_HISTORY
              ? [...existing.slice(1), point]
              : [...existing, point]
            return { ...prev, [msg.symbol]: next }
          })
        }
      } catch {
        // ignore malformed frames
      }
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimer.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => ws.close()
  }, [url])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  return { prices, history, connected, clientCount }
}
