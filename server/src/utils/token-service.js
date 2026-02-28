/**
 * Authentication Module
 * Handles JWT token generation and verification
 */

import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Generate JWT token
 */
export function generateToken(payload) {
  const { userId, accountId, email, name } = payload;

  if (!userId || !accountId || !email || !name) {
    throw new Error("Invalid payload");
  }

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Decode token without verification (use with caution)
 */
export function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Refresh token
 */
export function refreshToken(token) {
  const decoded = verifyToken(token);

  const payload = {
    userId: decoded.userId,
    accountId: decoded.accountId,
    email: decoded.email,
    name: decoded.name,
    trialEndAt: decoded.trialEndAt,
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
}
