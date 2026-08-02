require("dotenv").config();

const express = require("express");
const cors    = require("cors");

// ── App ───────────────────────────────────────────────────────────────────────

const app = express();

// Allow requests from the deployed frontend and local dev
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── DB connection middleware ───────────────────────────────────────────────────
// Ensures MongoDB is connected before any route handler runs.
// On Vercel each cold-start gets a fresh process; this re-connects automatically.

const { connect } = require("./db");

app.use(async (_req, _res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    console.error("[DB] Connection failed:", err.message);
    next(err);
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth",      require("./routes/auth"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/notes",     require("./routes/notes"));

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({ message: "Internal server error." });
});

// ── Local dev server ──────────────────────────────────────────────────────────
// Vercel does NOT call listen() — it imports the exported `app` directly.

if (process.env.NODE_ENV !== "production" && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀  MediTrack API  →  http://localhost:${PORT}`);
    console.log(`    Health check  →  http://localhost:${PORT}/api/health\n`);

    // Notification scheduler only runs in local dev (not serverless)
    try {
      const { startScheduler } = require("./scheduler");
      startScheduler();
    } catch (e) {
      console.warn("[Scheduler] Could not start:", e.message);
    }
  });
}

// ── Export for Vercel ─────────────────────────────────────────────────────────
module.exports = app;
