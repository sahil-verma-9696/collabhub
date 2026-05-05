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
import listEndpoints from "express-list-endpoints";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import config from "./config/env.js";
import database from "./config/database.js";
import logger from "./utils/logger.js";
import monitor from "./utils/monitor.js";
import swaggerSpec from "./config/swagger.js";
import { devFormat, prodFormat, morganOptions } from "./config/morgan.js";
import createSocketManager from "./socket/socketManager.js";
import { setSocketManager } from "./socket/emitters.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";
import filterValueRoutes from "./routes/filterValueRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import memberRotues from "./routes/memberRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import taskAssignmentRoutes from "./routes/taskAssignmentRoutes.js";

import { AuthGuard, memberGaurd } from "./middleware/authMiddleware.js";
import { YSocket } from "./socket/YSocket.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const socketManager = createSocketManager(server);
setSocketManager(socketManager);

YSocket(socketManager.getIO());

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
app.use("/api/projects", AuthGuard, projectRoutes);
app.use("/api/projects/:projectId/pages", AuthGuard, memberGaurd, pageRoutes);
app.use("/api/projects/:projectId/invites", AuthGuard, inviteRoutes);
app.use("/api/projects/:projectId/members", AuthGuard, memberRotues);
app.use("/api/projects/:projectId/filters", AuthGuard, filterRoutes);
app.use("/api/projects/:projectId/filterValues", AuthGuard, filterValueRoutes);
app.use("/api/projects/:projectId/tasks", AuthGuard, memberGaurd, taskRoutes);
app.use(
  "/api/projects/:projectId/tasks/:taskId/assignment",
  AuthGuard,
  memberGaurd,
  taskAssignmentRoutes,
);
app.use(
  "/api/projects/:projectId/activities",
  AuthGuard,
  memberGaurd,
  activityRoutes,
);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

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

  let InternalError = null;

  try {
    InternalError = JSON.parse(err.message);
  } catch (error) {}

  res.status(InternalError?.status || err.status || 500).json({
    message: InternalError?.message || err.message || "Internal server error",
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
      console.log(`  MongoDB: ${config.DATABASE_NAME}`);
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

      console.log(
        `\n---------------------- Server listening on port ${PORT} ------------------ \n`,
      );

      console.log(
        `🚀 API Documentation available at: http://localhost:${PORT}/api-docs`,
      );
      console.log(
        `📄 Raw Swagger JSON at: http://localhost:${PORT}/api-docs.json`,
      );
      console.log();
      logger.info("Server started successfully");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Export for testing
export { app, server, socketManager, logger, monitor };
