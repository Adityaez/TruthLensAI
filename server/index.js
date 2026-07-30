require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRouter = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", analyzeRouter);

// Root endpoint for browser visits to http://localhost:5000
app.get("/", (req, res) => {
  res.json({
    message: "TruthLens AI Backend API is running",
    frontendUrl: "http://localhost:5173",
    status: "online",
    endpoints: {
      analyze: "POST /api/analyze",
      health: "GET /health",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// DevTools quiet handler
app.use("/.well-known", (req, res) => {
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`TruthLens AI server running on http://localhost:${PORT}`);
});
