# Logging & Monitoring System

This document describes the logging and monitoring capabilities of CollabHub.

## Overview

The application uses a comprehensive logging and monitoring system with:

- **Morgan**: HTTP request logging middleware
- **Custom Logger**: Application-level logging with file output
- **Monitor**: System and application metrics tracking

## Logger Utilities

### Logger (`src/utils/logger.js`)

Centralized logging utility with multiple log levels:

#### Methods

- **`logger.error(message, error)`** - Error logging (red)

  ```javascript
  logger.error("Failed to create user", error);
  ```

- **`logger.info(message, data)`** - Info logging (cyan)

  ```javascript
  logger.info("User created successfully", { userId: "123" });
  ```

- **`logger.warn(message, data)`** - Warning logging (yellow)

  ```javascript
  logger.warn("High memory usage detected", { usage: "85%" });
  ```

- **`logger.debug(message, data)`** - Debug logging (only in development, magenta)
  ```javascript
  logger.debug("Database query executed", { duration: "45ms" });
  ```

#### Specialized Logging Methods

- **`logger.logRequest(method, url, status, responseTime)`** - HTTP request logging
- **`logger.logActivity(userId, accountId, action, details)`** - User activity logging
- **`logger.logDatabase(operation, collection, duration)`** - Database operation logging
- **`logger.logAuth(action, email, success, message)`** - Authentication event logging

#### Log Files

Logs are stored in the `logs/` directory (excluded from git):

- `error.log` - Application errors
- `info.log` - General information and activity logs
- `access.log` - HTTP access logs
- `http.log` - Detailed HTTP request logs

## Morgan HTTP Logger

Configured in `src/config/morgan.js`:

### Formats

- **Development**: `devFormat`

  ```
  GET /api/users 200 1.234 ms
  ```

- **Production**: `prodFormat`
  ```
  192.168.1.1 - - [22/Feb/2026:10:30:45 +0000] "GET /api/users HTTP/1.1" 200 1024 "-" "Mozilla/5.0..." - 1.234 ms
  ```

### Features

- HTTP request/response logging to `logs/http.log`
- Automatic skip of health check logs in production
- Response time tracking
- Status code and content-length logging

## Monitor Utility (`src/utils/monitor.js`)

Application performance and system metrics monitoring:

### Metrics Endpoints

#### `/health` - Health Check

```json
{
  "message": "Server health check",
  "status": "healthy",
  "warnings": [],
  "errors": [],
  "timestamp": "2026-02-22T10:30:45.123Z"
}
```

#### `/api/metrics` - Complete Metrics Report

```json
{
  "timestamp": "2026-02-22T10:30:45.123Z",
  "system": {
    "uptime": "15 minutes",
    "memory": {...},
    "cpu": {...},
    "os": {...}
  },
  "application": {
    "uptime": "845 seconds",
    "requestCount": 234,
    "errorCount": 2,
    "activeConnections": 12,
    "errorRate": "0.85%"
  }
}
```

#### `/api/system` - System Metrics Only

```json
{
  "uptime": "15 minutes",
  "memory": {
    "heapUsed": "45 MB",
    "heapTotal": "120 MB",
    "external": "2 MB",
    "rss": "150 MB"
  },
  "cpu": {...},
  "os": {...}
}
```

#### `/api/logs/stats` - Log File Statistics

```json
{
  "errorLogSize": 2048,
  "infoLogSize": 5120,
  "accessLogSize": 8192
}
```

### Health Checks

The monitor automatically checks for:

- **Memory Usage**: Warns at 80%, errors at 95%
- **Error Count**: Warns when exceeding 100 errors
- **Error Rate**: Calculates percentage of failed requests

## Usage in Application

### Logging Errors

```javascript
import logger from "./utils/logger.js";

try {
  // ... code
} catch (error) {
  logger.error("Failed to process request", error);
}
```

### Logging Activities

```javascript
logger.logActivity(userId, accountId, "login", {
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});
```

### Authentication Events

```javascript
logger.logAuth("register", email, true, "User registered successfully");
logger.logAuth("login", email, false, "Invalid password");
```

### Database Operations

```javascript
const startTime = Date.now();
// ... database operation
const duration = Date.now() - startTime;
logger.logDatabase("find", "users", duration);
```

## Configuration

### Morgan Options

Configure in `src/config/morgan.js`:

```javascript
const morganOptions = {
  stream: httpLogStream, // Write stream for logs
  skip: (req, res) => {
    // Skip certain requests
    if (req.path === "/health") return true;
    return false;
  },
};
```

### Logger Methods

Call anytime in the application:

```javascript
// Reset metrics
monitor.resetMetrics();

// Get current metrics
const metrics = monitor.getMetricsReport();

// Check health
const health = monitor.getHealthStatus();

// Clear old logs
logger.clearOldLogs(7); // Clear logs older than 7 days
```

## Environment Variables

Logging behavior based on `NODE_ENV`:

- **development**: Verbose logging, includes debug messages
- **production**: Sanitized logging, excludes debug messages, skips health checks

## Best Practices

1. **Always log errors** with context:

   ```javascript
   logger.error("User creation failed", error);
   ```

2. **Log significant events**:

   ```javascript
   logger.info("User registered", { email, accountId });
   ```

3. **Use debug for development only**:

   ```javascript
   logger.debug("Query params:", params);
   ```

4. **Monitor production health**:
   - Check `/health` endpoint regularly
   - Review `/api/metrics` for performance issues
   - Analyze log files for patterns

5. **Keep logs organized**:
   - Logs are auto-rotated by size
   - Use `logger.clearOldLogs()` periodically
   - Archive old logs separately if needed

## Monitoring Dashboard

To build a real-time monitoring dashboard:

```javascript
// Fetch metrics periodically
setInterval(async () => {
  const response = await fetch("http://localhost:3000/api/metrics");
  const metrics = await response.json();
  // Update dashboard with metrics
}, 5000);
```

## Troubleshooting

### High Memory Usage

Check memory metrics:

```bash
curl http://localhost:3000/api/system
```

Monitor growth over time in logs/info.log

### High Error Rate

Review error logs:

```bash
tail -f logs/error.log
```

Check error patterns:

```javascript
const stats = logger.getLogStats();
console.log(stats);
```

### Missing Logs

Ensure `logs/` directory exists:

```bash
mkdir -p logs/
```

Check directory permissions and disk space.

## Log Retention

- Error logs: Keep indefinitely for security
- Info logs: Rotate monthly
- Access logs: Keep for 30 days

To clear old logs:

```javascript
logger.clearOldLogs(7); // Clear logs older than 7 days
```
