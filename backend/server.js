require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { load: loadML } = require("./ml/scanner");
const { connectDb } = require("./config/mongoDb");

const app = express();
const PORT = process.env.PORT || 5000;

// ── 1. Logger Setup ───────────────────────────────────────────
// 'dev' format gives colorful output, perfect for Railway runtime logs
app.use(morgan("dev"));

// ── 2. Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// ── 3. Healthcheck (Minimalist & Fast) ───────────────────────
// Railway hits this continuously. We respond immediately.
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: isReady ? "ok" : "warming_up", 
    service: "appstore-backend",
    uptime: process.uptime()
  });
});

// Warmup Middleware
let isReady = false;
app.use((req, res, next) => {
  if (req.path === "/") return next();
  if (!isReady) {
    return res.status(503).json({ error: "Service warming up, please retry in a few seconds." });
  }
  next();
});

// ── 4. Routes (Lazy Loaded to speed up first listen) ──────────
app.use("/auth", require("./routes/auth"));
app.use("/apps", require("./routes/apps"));
app.use("/upload", require("./routes/upload"));

// 404 handler
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// Global error logger
app.use((err, req, res, next) => {
  console.error("🔥 [SERVER ERROR]", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── 5. Startup Sequence ────────────────────────────────────────
const start = async () => {
  console.log("------------------------------------------");
  console.log(`🚀 WARMING UP ENGINE ON PORT ${PORT}...`);
  console.log("------------------------------------------");

  // Listen first to satisfy the healthcheck proxy
  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`✅ Server bound to interface 0.0.0.0:${PORT}`);
    
    try {
      // Background init start
      console.log("🔌 Connecting to MongoDB Atlas...");
      await connectDb();
      console.log("✅ Database Link Established");

      console.log("🧠 Loading TensorFlow Toxicity Model...");
      await loadML();
      console.log("✅ AI Scanner Ready");
      
      console.log("------------------------------------------");
      console.log("      ✨ BACKEND LIVE & STABLE ✨");
      console.log("------------------------------------------");
      isReady = true;
    } catch (error) {
      console.error("❌ CRITICAL BOOTSTRAP FAILURE:", error);
    }
  });
};

start();
