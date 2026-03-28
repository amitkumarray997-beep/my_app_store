require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { load: loadML } = require("./ml/scanner");
const { connectDb } = require("./config/mongoDb");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// ── Routes ────────────────────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/apps", require("./routes/apps"));
app.use("/upload", require("./routes/upload"));

// Health check
app.get("/", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString(), storage: "mongodb-atlas" }));

// 404 fallback
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = parseInt(process.env.PORT) || 5000;

// ── Start ─────────────────────────────────────────────────────
const start = async () => {
  // 1. Listen IMMEDIATELY on 0.0.0.0 to satisfy Railway's healthcheck
  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`⚡ Server listening on port ${PORT}`);
    
    try {
      // 2. Load dependencies in the background
      console.log("⏳ Connecting to MongoDB...");
      await connectDb();
      
      console.log("⏳ Loading ML Scanner...");
      await loadML();
      console.log("🧠 ML models loaded & Backend ready");
      
    } catch (error) {
      console.error("❌ Startup Error:", error);
      // We don't exit so the process stays alive for logs
    }
  });
};

start();
