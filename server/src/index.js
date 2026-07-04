import express from "express";
import cors from "cors";
import copilotRouter from "./routes/copilot.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5163", "http://127.0.0.1:5163"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/copilot", copilotRouter);

import chatRouter from "./routes/chat.js";
app.use("/api/copilot", chatRouter);

app.use((err, _req, res, _next) => {
  console.error("[Server] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n  🚀 NovaOS API Server running on http://localhost:${PORT}`);
  console.log(`  📋 Health:    http://localhost:${PORT}/api/health`);
  console.log(`  🤖 Copilot:   POST http://localhost:${PORT}/api/copilot/parse-request`);
  console.log(`  🔑 Keys:      GET  http://localhost:${PORT}/api/copilot/keys/status\n`);
});
