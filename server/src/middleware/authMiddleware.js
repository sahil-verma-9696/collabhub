/**
 * Authentication Middleware
 * Verifies JWT tokens and Google OAuth
 */
import * as tokenService from "../utils/token-service.js";

/**
 * Middleware to verify JWT token from Authorization header or cookies
 */
export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = tokenService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

/**
 * Middleware to verify token for Socket.io
 */
export const verifySocketToken = (token) => {
  try {
    return tokenService.verifyToken(token);
  } catch (error) {
    return null;
  }
};

/**
 * Error handling middleware for auth errors
 */
export const handleAuthError = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }
  next(err);
};
