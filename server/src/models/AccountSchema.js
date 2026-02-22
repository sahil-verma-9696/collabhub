/**
 * Account Schema for MongoDB using Mongoose
 * Based on ER Diagram - Accounts Entity
 */

import mongoose from "mongoose";
import LoginDetails from "./LoginDetailsSchema.js";
import GoogleToken from "./GoogleTokenSchema.js";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    trialEndAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    methods: {
      async cascadeDelete(session = null) {
        const ownSession = !session;
        if (!session) {
          session = await mongoose.startSession();
          session.startTransaction();
        }

        try {
          // Delete all login details
          await LoginDetails.deleteMany({
            accountId: this._id,
          }).session(session);

          // Delete all google tokens
          await GoogleToken.deleteMany({
            accountId: this._id,
          }).session(session);

          // Delete account
          await this.deleteOne({ session });

          if (ownSession) await session.commitTransaction();
        } catch (err) {
          if (ownSession) await session.abortTransaction();
          throw err;
        } finally {
          if (ownSession) session.endSession();
        }
      },
    },
  },
);

accountSchema.pre("save", function (next) {
  if (this.isModified("isEmailVerified") && this.isEmailVerified) {
    this.trialEndAt = null;
    this.emailVerifiedAt = new Date();
  }

  if (this.isNew && !this.isEmailVerified) {
    this.trialEndAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  next();
});

/**
 * Create Account model
 */
const Account = mongoose.model("Account", accountSchema);

export default Account;
