/**
 * Google Token Schema
 * Stores OAuth tokens for Google integrations (Meet, etc.)
 */

import mongoose from "mongoose";

const googleTokenSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required"],
      unique: true, // one Google connection per account
      index: true,
    },

    refreshToken: {
      type: String,
      required: [true, "Refresh token is required"],
    },

    scope: {
      type: [String], // optional but useful
      required: [true, "Scope is required"],
    },

    expiryDate: {
      type: Date,
      default: null,
      required: [true, "Expiry date is required"],
    },

    revokedAt: {
      type: Date,
      default: null, // set when Google revokes access
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const GoogleToken = mongoose.model("GoogleToken", googleTokenSchema);

GoogleToken.syncIndexes();

export default GoogleToken;
