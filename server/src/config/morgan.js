/**
 * Morgan Logger Configuration
 * Integrates morgan HTTP logger with our custom logger
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
export const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom morgan token for response time in milliseconds
export const morganToken = (tokens, req, res) => {
  return tokens["response-time"](req, res);
};

// Create write stream for HTTP request logs
export const httpLogStream = fs.createWriteStream(
  path.join(logsDir, "http.log"),
  {
    flags: "a",
  },
);

// Morgan format for development
export const devFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Morgan format for production
export const prodFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

/**
 * Custom morgan options with stream and skip function
 */
export const morganOptions = {
  stream: httpLogStream,
  skip: (req, res) => {
    // Skip health check logs in production
    if (process.env.NODE_ENV === "production" && req.path === "/health") {
      return true;
    }
    return false;
  },
};
