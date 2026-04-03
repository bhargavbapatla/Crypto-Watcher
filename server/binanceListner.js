import WebSocket from "ws";

const latestPrices = {};
const PAIRS = ["btcusdt", "ethusdt", "bnbusdt"];

function startBinanceListener(onPriceUpdate) {
    const streams = PAIRS.map((p) => `${p}@ticker`).join("/");
    const url = `wss://stream.binance.com:9443/ws/${streams}`;

    let ws;
    let reconnectAttempts = 0;

    function connect() {
        ws = new WebSocket(url);

        ws.on("open", () => {
            console.log("✅ Connected to Binance WebSocket");
            reconnectAttempts = 0; // reset on successful connection
        });

        ws.on("message", (raw) => {
            try {
                const parsed = JSON.parse(raw);
                const priceData = {
                    symbol: parsed.s,       // "BTCUSDT"
                    lastPrice: parsed.c,    // last traded price
                    change24h: parsed.P,    // 24h % change
                    high24h: parsed.h,      // 24h high
                    low24h: parsed.l,       // 24h low
                    volume: parsed.v,       // 24h volume
                    timestamp: parsed.E,    // event timestamp (ms)
                };

                latestPrices[priceData.symbol] = priceData;

                if (onPriceUpdate) {
                    onPriceUpdate(priceData);
                }
            } catch (err) {
                console.error("❌ Parse error:", err.message);
            }
        });

        ws.on("error", (err) => {
            console.error("Binance WS error:", err.message);
        });

        ws.on("close", () => {
            reconnectAttempts++;
            // Exponential backoff: 1s, 2s, 4s, 8s... max 30s
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`⚠️ Binance disconnected. Reconnecting in ${delay / 1000}s...`);
            setTimeout(connect, delay);
        });
    }

    connect();

    return { getLatestPrices: () => ({ ...latestPrices }) };
}

export { startBinanceListener };