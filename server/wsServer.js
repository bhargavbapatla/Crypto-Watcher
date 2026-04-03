import { WebSocketServer, WebSocket } from "ws";

const MAX_CLIENTS = 100;

function startWSServer(server) {
    const wss = new WebSocketServer({ server, path: "/ws" });

    const clients = new Set();

    wss.on("connection", (ws, req) => {
        if (clients.size >= MAX_CLIENTS) {
            ws.close(1013, "Max connections reached");
            console.log("⛔ Rejected connection — limit reached");
            return;
        }

        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        console.log(`🔗 Client connected: ${clientIp} | Total: ${clients.size + 1}`);
        clients.add(ws);

        ws.send(JSON.stringify({
            type: "welcome",
            message: "Connected to Crypto Price Server",
            connectedClients: clients.size,
        }));
        broadcastClientCount();

        ws.on("close", (code, reason) => {
            clients.delete(ws);
            console.log(`❌ Client disconnected (code: ${code}) | Remaining: ${clients.size}`);
            broadcastClientCount();
        });

        ws.on("error", (err) => {
            console.error("Client WS error:", err.message);
            clients.delete(ws);
        });

        ws.on("pong", () => {
            ws.isAlive = true;
        });

        ws.isAlive = true;
    });

    const heartbeat = setInterval(() => {
        for (const client of clients) {
            if (!client.isAlive) {
                client.terminate();
                clients.delete(client);
                continue;
            }
            client.isAlive = false;
            client.ping();
        }
    }, 30000);

    wss.on("close", () => clearInterval(heartbeat));

    function broadcast(data) {
        const message = JSON.stringify({ type: "price_update", ...data });
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    function broadcastClientCount() {
        const message = JSON.stringify({ type: "client_count", connectedClients: clients.size });
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    return {
        broadcast,
        getClientCount: () => clients.size,
    };
}

export { startWSServer };