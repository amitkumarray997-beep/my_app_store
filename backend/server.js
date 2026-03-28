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

// ── Start ─────────────────────────────────────────────────────
const start = async () => {
  // 1. Establish Mongo Connection Native
  await connectDb();

  // 2. Load ML Scanner
  await loadML();
  console.log("🧠 ML model loaded");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`⚡ Server running on http://localhost:${PORT}`);
    console.log(`   📂 Storage: MongoDB Atlas Native Driver`);
    console.log(`   POST /auth/signup   — register`);
    console.log(`   POST /auth/login    — login → JWT`);
    console.log(`   GET  /apps          — list apps`);
    console.log(`   POST /apps/publish  — publish (JWT)`);
    console.log(`   POST /upload        — upload APK (JWT)`);
    console.log(`   GET  /apps/download/:file — stream APK`);
  });
};

start();
