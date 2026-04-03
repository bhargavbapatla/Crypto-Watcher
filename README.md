# 📈 Crypto Watcher

![Live Status](https://img.shields.io/badge/Status-Live-success)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Enabled-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-61dafb)

A real-time cryptocurrency dashboard that connects to the public Binance WebSocket API, processes live market data, and broadcasts it to connected clients via a custom Node.js WebSocket server.

**Live Demo:** [https://crypto-watcher-weld-alpha.vercel.app/](https://crypto-watcher-weld-alpha.vercel.app/)

---

## 🏗️ Architecture Flow

```text
[ Binance WebSocket API ]  -->  [ Node.js Listener ]  -->  [ Local WebSocket Server ]  -->  [ React Clients ]
