/**
 * Main Server File
 * Entry point for the application
 */

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import config from "./config/env.js";
import database from "./config/database.js";
import logger from "./utils/logger.js";
import monitor from "./utils/monitor.js";
import { devFormat, prodFormat, morganOptions } from "./config/morgan.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import createSocketManager from "./socket/socketManager.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const socketManager = createSocketManager(server);

// Middleware
app.use(
  cors({
    origin: [config.SOCKET_IO_ORIGIN, config.CLIENT_ORIGIN],
    credentials: true,
  }),
);

// Morgan HTTP request logger
const format = config.NODE_ENV === "production" ? prodFormat : devFormat;
app.use(morgan(format, morganOptions));

// Performance monitoring middleware
app.use(monitor.performanceMiddleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  const healthStatus = monitor.getHealthStatus();
  const statusCode = healthStatus.healthy ? 200 : 503;

  res.status(statusCode).json({
    message: "Server health check",
    status: healthStatus.healthy ? "healthy" : "unhealthy",
    timestamp: new Date(),
    ...healthStatus,
  });
});

// Monitoring endpoints
app.get("/api/metrics", (req, res) => {
  res.json(monitor.getMetricsReport());
});

app.get("/api/system", (req, res) => {
  res.json(monitor.getSystemMetrics());
});

app.get("/api/logs/stats", (req, res) => {
  res.json(logger.getLogStats());
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CollabHub API", version: "1.0.0" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("Request error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: config.NODE_ENV === "development" ? err : {},
  });
});

// Start server with database connection
const PORT = config.PORT;

async function startServer() {
  try {
    await database.connect();
    logger.info("MongoDB connected successfully");

    server.listen(PORT, () => {
      logger.info(`CollabHub Server started on port ${PORT}`);

      console.log(`\nDatabase configured:`);
      console.log(`  MongoDB URI: ${config.MONGODB_URI}`);
      console.log(
        `  Status: ${database.getStatus() ? "✓ Connected" : "✗ Not connected"}`,
      );

      console.log(`\nGoogle OAuth configured:`);
      console.log(
        `  Client ID: ${config.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Not set"}`,
      );
      console.log(
        `  Client Secret: ${config.GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Not set"}`,
      );

      console.log(`\nAvailable routes:`);
      console.log(`  POST /auth/register`);
      console.log(`  POST /auth/login`);
      console.log(`  GET  /auth/google`);
      console.log(`  GET  /auth/verify`);
      console.log(`  POST /auth/refresh`);
      console.log(`  GET  /api/users/profile`);
      console.log(`  PUT  /api/users/profile`);
      console.log(`  GET  /api/users`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Export for testing
export { app, server, socketManager, logger, monitor };
