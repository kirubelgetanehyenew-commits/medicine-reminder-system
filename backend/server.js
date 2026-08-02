require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

// ── ensure data directory exists ──────────────────────────────────────────────
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// ── app setup ─────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── request logger (dev) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/auth"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/notes",     require("./routes/notes"));

// ── health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// ── start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  MediTrack API  →  http://localhost:${PORT}`);
  console.log(`    Health check  →  http://localhost:${PORT}/api/health\n`);

  // Start the notification scheduler AFTER the server is up
  const { startScheduler } = require("./scheduler");
  startScheduler();
});
