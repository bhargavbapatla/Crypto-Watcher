import express from "express";
import http from "http";
import cors from "cors";
import { startBinanceListener } from "./binanceListner.js";
import { startWSServer } from "./wsServer.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET"],
}));

app.use(express.json());

const server = http.createServer(app);
const { broadcast, getClientCount } = startWSServer(server);

const { getLatestPrices } = startBinanceListener((priceData) => {
    broadcast(priceData);
});

// Get latest prices for all pairs
app.get("/price", (req, res) => {
    const prices = getLatestPrices();
    res.json({
        success: true,
        data: prices,
        meta: {
            connectedClients: getClientCount(),
            pairs: Object.keys(prices),
            serverTime: new Date().toISOString(),
        },
    });
});

// Get price for a specific pair
app.get("/price/:symbol", (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const prices = getLatestPrices();

    if (!prices[symbol]) {
        return res.status(404).json({
            success: false,
            error: `Symbol ${symbol} not found. Available: ${Object.keys(prices).join(", ")}`,
        });
    }

    res.json({ success: true, data: prices[symbol] });
});

// Health check
app.get("/health", (req, res) => {
    const prices = getLatestPrices();
    res.json({
        status: "ok",
        uptime: process.uptime(),
        connectedClients: getClientCount(),
        activePairs: Object.keys(prices).length,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`   WebSocket:  ws://localhost:${PORT}/ws`);
    console.log(`   REST API:   http://localhost:${PORT}/price`);
    console.log(`   Health:     http://localhost:${PORT}/health\n`);
});