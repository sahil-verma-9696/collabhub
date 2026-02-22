/**
 * Monitoring Utility
 * Provides system and application metrics monitoring
 */

import os from "os";
import logger from "./logger.js";

// Internal shared state (replaces class fields)
let startTime = Date.now();
let requestCount = 0;
let errorCount = 0;
let activeConnections = 0;

/**
 * Get system metrics
 */
function getSystemMetrics() {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    uptime: `${Math.floor(uptime / 60)} minutes`,
    memory: {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    },
    cpu: {
      user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
      system: `${(cpuUsage.system / 1000).toFixed(2)} ms`,
    },
    os: {
      platform: process.platform,
      nodeVersion: process.version,
      freemem: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
      totalmem: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
    },
  };
}

/**
 * Get application metrics
 */
function getApplicationMetrics() {
  const uptime = Date.now() - startTime;

  return {
    uptime: `${Math.floor(uptime / 1000)} seconds`,
    requestCount,
    errorCount,
    activeConnections,
    errorRate:
      requestCount > 0
        ? `${((errorCount / requestCount) * 100).toFixed(2)}%`
        : "0%",
  };
}

/**
 * Full metrics report
 */
function getMetricsReport() {
  return {
    timestamp: new Date().toISOString(),
    system: getSystemMetrics(),
    application: getApplicationMetrics(),
  };
}

/**
 * Log metrics
 */
function logMetrics() {
  const metrics = getMetricsReport();
  logger.info("System Metrics Report:", metrics);
  return metrics;
}

/**
 * Counters
 */
function incrementRequest() {
  requestCount++;
}

function incrementError() {
  errorCount++;
}

function setActiveConnections(count) {
  activeConnections = count;
}

/**
 * Health status
 */
function getHealthStatus() {
  const metrics = getApplicationMetrics();
  const memUsage = process.memoryUsage();
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  const status = {
    healthy: true,
    warnings: [],
    errors: [],
  };

  if (memPercentage > 80) {
    status.warnings.push(`High memory usage: ${memPercentage.toFixed(2)}%`);
  }

  if (memPercentage > 95) {
    status.errors.push(`Critical memory usage: ${memPercentage.toFixed(2)}%`);
    status.healthy = false;
  }

  if (metrics.errorCount > 100) {
    status.warnings.push(`High error count: ${metrics.errorCount}`);
  }

  return status;
}

/**
 * Performance middleware
 */
function performanceMiddleware() {
  return (req, res, next) => {
    const start = Date.now();

    const originalSend = res.send;

    res.send = function (data) {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      incrementRequest();

      if (statusCode >= 400) incrementError();

      logger.debug(`${req.method} ${req.path} - ${statusCode} - ${duration}ms`);

      originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Reset metrics
 */
function resetMetrics() {
  startTime = Date.now();
  requestCount = 0;
  errorCount = 0;
  activeConnections = 0;

  logger.info("Application metrics reset");
}

/**
 * Export singleton monitor
 */
export default {
  getSystemMetrics,
  getApplicationMetrics,
  getMetricsReport,
  logMetrics,
  incrementRequest,
  incrementError,
  setActiveConnections,
  getHealthStatus,
  performanceMiddleware,
  resetMetrics,
};
