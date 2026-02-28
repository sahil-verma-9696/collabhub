/**
 * Auth Controller
 * Handles authentication operations (OAuth and email/password)
 */

import * as userRepo from "../repos/UserRepo.js";
import * as accountRepo from "../repos/AccountRepo.js";
import * as loginDetailsRepo from "../repos/LoginDetailsRepo.js";
import * as tokenService from "../utils/token-service.js";
import * as googleTokenRepo from "../repos/GoogleTokenRepo.js";
import mongoose from "mongoose";
import { AUTH_METHOD } from "../models/LoginDetailsSchema.js";
import { google } from "googleapis";
import config from "../config/env.js";

const oauth2Client = new google.auth.OAuth2({
  clientId: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  redirectUri: config.GOOGLE_CALLBACK_URL,
});

const scopes = [
  // Google User Info
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",

  // Google Meet
  "https://www.googleapis.com/auth/meetings.space.created",
  "https://www.googleapis.com/auth/meetings.space.readonly",
  "https://www.googleapis.com/auth/meetings.conference.media.readonly",
];

export async function register(req, res, next) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Create user
    const user = await userRepo.create(req.body, { session });

    // 2️⃣ Create account linked to user
    const account = await accountRepo.create({ user: user._id }, { session });

    // 3️⃣ Create login details linked to account
    await loginDetailsRepo.create(
      { account: account._id, ...req.body },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // 4️⃣ Generate token
    const token = tokenService.generateToken({
      userId: user._id,
      accountId: account._id,
      email: user.email,
      name: user.name,
      trialEndAt: account.trialEndAt,
    });

    return res.status(201).json({ user: user.toJSON(), token });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  const user = await userRepo.getByEmail(email);

  if (!user) throw new Error("User not found");

  const account = await accountRepo.getAccountByUserId(user._id);

  if (!account) throw new Error("Account not found");

  const loginDetails = await loginDetailsRepo.getLoginDetailsByAccountId(account._id);

  if (!loginDetails) throw new Error("Login details not found");

  if (loginDetails.authMethod !== AUTH_METHOD.EMAIL)
    throw new Error("Invalid login method");

  const isPasswordValid = await loginDetails.comparePassword(password);

  if (!isPasswordValid) throw new Error("Invalid password");

  const token = tokenService.generateToken({
    userId: user._id,
    accountId: account._id,
    email: user.email,
    name: user.name,
    trialEndAt: account.trialEndAt,
  });

  return res.status(200).json({ user: user.toJSON(), token });
}

/**
 * Get Consent of User
 * -------------------
 * @description
 * This function redirect to google_consent_page and then redirect to same clients route with `auth code`.
 */
export function getConsent(_, res) {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    // state: state,
    prompt: "consent",
  });

  res.redirect(authorizationUrl);
}

export async function googleAuth(req, res, next) {
  const authCode = req.query.code;

  if (!authCode) throw new Error("Auth code is required");

  const googleUser = await validateCode(authCode);

  const existingUser = await userRepo.getByEmail(googleUser.email);
  const existingAccount = await accountRepo.getAccountByUserId(
    existingUser?._id,
  );

  // Update existing User

  if (existingUser) {
    if (!existingAccount.isEmailVerified)
      await accountRepo.updateIsEmailVerifiedByUserId(existingUser._id, true);

    const token = tokenService.generateToken({
      userId: existingUser._id,
      accountId: existingAccount._id,
      email: existingUser.email,
      name: existingUser.name,
      trialEndAt: null,
    });

    return res.status(200).json({ user: existingUser.toJSON(), token });
  }

  // Create new User

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Create user
    const user = await userRepo.create(
      {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      },
      { session },
    );

    // 2️⃣ Create account linked to user
    const account = await accountRepo.create(
      {
        user: user._id,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        trialEndAt: null,
      },
      { session },
    );

    // 3️⃣ Create login details linked to account
    await loginDetailsRepo.create(
      {
        account: account._id,
        password: null,
        googleId: googleUser.id,
        authMethod: AUTH_METHOD.GOOGLE,
      },
      { session },
    );

    // Saving Google Token for future use
    await googleTokenRepo.create(
      {
        account: account._id,
        refreshToken: googleUser.refresh_token,
        expiryDate: googleUser.expiry_date,
        scope: scopes,
      },
      { session },
    );

    await session.commitTransaction();

    session.endSession();

    // 4️⃣ Generate token
    const token = tokenService.generateToken({
      userId: user._id,
      accountId: account._id,
      email: user.email,
      name: user.name,
      trialEndAt: account.trialEndAt,
    });

    return res.status(201).json({ user: user.toJSON(), token });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }

  return res.status(200).json(googleUser);
}

async function validateCode(auth_code) {
  if (!auth_code) {
    throw new Error("Auth code is required");
  }

  // 1. Exchange auth code for tokens
  const { tokens } = await oauth2Client.getToken(auth_code);

  if (!tokens.access_token) {
    throw new Error("Failed to get access token from Google");
  }

  // 2. Attach tokens to client
  oauth2Client.setCredentials(tokens);

  // 3. Fetch user profile
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data: profile } = await oauth2.userinfo.v2.me.get();

  if (!profile || !profile.email || !profile.name || !profile.verified_email)
    throw new Error("Failed to get user profile from Google");

  return {
    name: profile.name,
    email: profile.email,
    verified_email: profile.verified_email,
    picture: profile.picture,
    id: profile.id,

    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_type: tokens.token_type,
    expiry_date: tokens.expiry_date,
  };
}
