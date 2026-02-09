import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./db/connectDB.js";
import loanFormRoutes from "./routes/loanForm.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

/*DATABASE*/
connectDb();

/*MIDDLEWARE*/

// CORS – safe default (Render + frontend)
app.use(
  cors({
    origin: "*", // tighten later if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers (JSON only — files handled by multer)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Request logger (DEV ONLY)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("\n📨", req.method, req.originalUrl);
    console.log("⏰", new Date().toISOString());

    if (req.body && Object.keys(req.body).length) {
      console.log("📦 Body:", req.body);
    }

    if (req.files) {
      console.log("📁 Files:", Object.keys(req.files));
    }

    next();
  });
}

/*ROUTES*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏦 Springfield Financial Services - Backend API",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/loan-forms", loanFormRoutes);

/*ERROR HANDLING*/

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

/*SERVER*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("\n=================================");
  console.log("🚀 SERVER STARTED");
  console.log("=================================");
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`📡 /api/loan-forms`);
  console.log("=================================\n");
});

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
  process.exit(1);
});
