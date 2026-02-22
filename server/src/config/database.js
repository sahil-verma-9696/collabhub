/**
 * MongoDB Database Connection
 */

import mongoose from "mongoose";
import config from "./env.js";

class Database {
  constructor() {
    this.connected = false;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      if (this.connected) {
        console.log("Database already connected");
        return;
      }

      if (!config.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.connected = true;
      console.log("✓ MongoDB connected successfully");
      return mongoose.connection;
    } catch (error) {
      console.error("✗ MongoDB connection failed:", error.message);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      if (this.connected) {
        await mongoose.disconnect();
        this.connected = false;
        console.log("✓ MongoDB disconnected");
      }
    } catch (error) {
      console.error("✗ MongoDB disconnection failed:", error.message);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return this.connected;
  }

  /**
   * Get mongoose connection instance
   */
  getConnection() {
    return mongoose.connection;
  }
}

const database = new Database();
export default database;
