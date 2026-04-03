import { useEffect, useRef, useState, useCallback } from "react";
import type { PriceMap, WSMessage, UseWebSocketReturn } from "../types/crypto";

export function useWebSocket(url: string): UseWebSocketReturn {
    const [prices, setPrices] = useState<PriceMap>({});
    const [connected, setConnected] = useState<boolean>(false);
    const [clientCount, setClientCount] = useState<number>(0);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
        }

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = (): void => {
            console.log("✅ Connected to local WS server");
            setConnected(true);
        };

        ws.onmessage = (event: MessageEvent): void => {
            try {
                const data: WSMessage = JSON.parse(event.data);

                if (data.type === "welcome") {
                    setClientCount(data.connectedClients);
                    return;
                }

                if (data.type === "price_update") {
                    setPrices((prev) => ({
                        ...prev,
                        [data.symbol]: {
                            symbol: data.symbol,
                            lastPrice: data.lastPrice,
                            change24h: data.change24h,
                            high24h: data.high24h,
                            low24h: data.low24h,
                            volume: data.volume,
                            timestamp: data.timestamp,
                        },
                    }));
                }
            } catch (err) {
                console.error("Parse error:", err);
            }
        };

        ws.onclose = (): void => {
            console.log("❌ Disconnected. Reconnecting in 3s...");
            setConnected(false);
            reconnectTimer.current = setTimeout(connect, 3000);
        };

        ws.onerror = (): void => {
            ws.close();
        };
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [connect]);

    return { prices, connected, clientCount };
}