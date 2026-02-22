import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: "7d",

  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET,

  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/collabhub",

  // Socket.io Configuration
  SOCKET_IO_ORIGIN: process.env.SOCKET_IO_ORIGIN || "http://localhost:3000",

  // Client Origin
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

export default config;
