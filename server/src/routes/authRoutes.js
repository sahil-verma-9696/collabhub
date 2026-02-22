/**
 * Authentication Routes
 */

import express from "express";
import * as authController from "../controllers/AuthController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Email/Password Authentication Routes
 */

/**
 * Register with email and password
 */
router.post("/register", asyncHandler(authController.register));

/**
 * Login with email and password
 */
router.post("/login", asyncHandler(authController.login));

/**
 * Google OAuth Routes
 */
router.get("/login", asyncHandler(authController.getConsent));

/**
 * Google OAuth Callback
 */
router.get("/google/oauth2callback", asyncHandler(authController.googleAuth));

// /**
//  * Token verification
//  */
// router.get(
//   "/verify",
//   verifyToken,
//   authController.verifyToken.bind(authController),
// );

/**
 * Refresh token
 */
// router.post("/refresh", authController.refreshToken.bind(authController));

/**
 * Auth failed page
 */
router.get("/failed", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

/**
 * Auth success page
 */
router.get("/success", (req, res) => {
  res.json({ message: "Authentication successful", token: req.query.token });
});

export default router;
