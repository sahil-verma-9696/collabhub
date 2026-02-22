# Morgan Logger & Monitoring Integration Summary

## ✅ Implementation Complete

The CollabHub application now has a comprehensive logging and monitoring system integrated.

## 📦 What Was Added

### 1. **Morgan HTTP Logger** (`src/config/morgan.js`)

- Automatic HTTP request logging
- Different formats for development and production
- Logs written to `logs/http.log`
- Configurable skip rules (e.g., skip health checks in production)

### 2. **Custom Logger Utility** (`src/utils/logger.js`)

- Multi-level logging (error, info, warn, debug)
- File-based log storage in `logs/` directory
- Color-coded console output
- Specialized methods for different use cases:
  - `logRequest()` - HTTP requests
  - `logActivity()` - User activities
  - `logAuth()` - Authentication events
  - `logDatabase()` - Database operations
- Log rotation and cleanup utilities

### 3. **Monitor Utility** (`src/utils/monitor.js`)

- Real-time system metrics (memory, CPU, uptime)
- Application metrics (request count, error rate)
- Health status checking
- Performance middleware for automatic tracking

### 4. **New Monitoring Endpoints**

```
GET  /health              - Health status check
GET  /api/metrics         - Complete metrics report
GET  /api/system          - System metrics only
GET  /api/logs/stats      - Log file statistics
```

## 📁 Log Files Generated

The application creates logs in the `logs/` directory (excluded from git):

- **error.log** - Application errors with stack traces
- **info.log** - General information and activity logs
- **access.log** - HTTP access logs
- **http.log** - Detailed HTTP request logs

## 🔧 Integration Points

### In `server.js`

- Morgan middleware initialized with format based on environment
- Monitor performance middleware added
- Logger used for startup messages and errors
- New monitoring endpoints registered
- Exports include logger and monitor utilities

### In `package.json`

- Added `morgan@^1.10.0` dependency

## 📊 Monitoring Features

### Health Checks

- Memory usage alerts (warn at 80%, error at 95%)
- Error count tracking
- Error rate calculation
- Overall health status reporting

### Metrics Tracked

- Server uptime
- Request count
- Error count
- Active connections
- Memory heap usage
- CPU usage
- OS information

### Performance Monitoring

- Response time tracking
- Status code logging
- Request method and path
- Content length logging

## 🎯 Usage Examples

### Basic Logging

```javascript
import logger from "./utils/logger.js";

logger.error("Failed to save user", error);
logger.info("User created", { userId: "123" });
logger.warn("High load detected");
logger.debug("Processing request");
```

### Activity Logging

```javascript
logger.logActivity(userId, accountId, "login", {
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
});
```

### Authentication Events

```javascript
logger.logAuth("register", email, true, "Successfully registered");
logger.logAuth("login", email, false, "Invalid credentials");
```

### Checking Metrics

```javascript
const metrics = monitor.getMetricsReport();
const health = monitor.getHealthStatus();
const sysMetrics = monitor.getSystemMetrics();
```

## 🚀 Accessing Monitoring Data

### Via HTTP Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Complete metrics
curl http://localhost:3000/api/metrics

# System metrics only
curl http://localhost:3000/api/system

# Log statistics
curl http://localhost:3000/api/logs/stats
```

### Via Log Files

```bash
# View errors
tail -f logs/error.log

# View all activities
tail -f logs/info.log

# View HTTP requests
tail -f logs/http.log

# View access logs
tail -f logs/access.log
```

## 📋 Configuration

### Development vs Production

**Development Mode:**

- Verbose logging with debug messages
- Morgan format: `GET /api/users 200 1.234 ms`
- All requests logged to http.log

**Production Mode:**

- Sanitized logging (no sensitive data)
- Morgan format: Full Apache Combined Log format
- Health check requests skipped
- Error rate monitoring more critical

### Customize Morgan Format

Edit `src/config/morgan.js`:

```javascript
const customFormat = ":method :url :status :response-time[0]ms";
app.use(morgan(customFormat, morganOptions));
```

### Control Log Output

```javascript
// Clear old logs (logs older than 7 days)
logger.clearOldLogs(7);

// Get log file stats
const stats = logger.getLogStats();

// Reset application metrics
monitor.resetMetrics();
```

## 📚 Documentation

Comprehensive documentation available in `LOGGING_AND_MONITORING.md` including:

- Detailed API reference
- Best practices
- Troubleshooting guide
- Dashboard integration examples

## ✨ Key Features

✅ Automatic HTTP request logging with morgan
✅ Multi-level application logging (error/info/warn/debug)
✅ Real-time system and application metrics
✅ Health status monitoring with alerts
✅ File-based log storage with organization
✅ Color-coded console output
✅ Specialized logging for different operations
✅ Performance monitoring middleware
✅ RESTful monitoring endpoints
✅ Production-ready configuration

## 🔒 Security

- Logs directory excluded from version control
- Sensitive data (passwords, tokens) not logged
- Error messages sanitized in production
- Log files can be archived separately
- Health checks help detect security issues early

## 🎓 Next Steps

1. **Monitor your application**: Use `/health` endpoint
2. **Review logs regularly**: Check error patterns
3. **Set up alerts**: Monitor memory and error rates
4. **Integrate dashboard**: Use `/api/metrics` for monitoring tools
5. **Archive logs**: Implement log rotation policy

## 📞 Support

For issues or questions about logging:

- Check `LOGGING_AND_MONITORING.md` for detailed documentation
- Review log files in `logs/` directory
- Use monitoring endpoints to diagnose issues
- Check application logs for error patterns
