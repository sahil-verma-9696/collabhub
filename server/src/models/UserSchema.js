/**
 * User Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";
import validator from "validator";
import Account from "./AccountSchema.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
    },
  },
  {
    timestamps: true,
    methods: {
      cascadeDelete: async function () {
        const session = await mongoose.startSession();

        try {
          session.startTransaction();

          // Get all accounts of this user
          const accounts = await Account.find({ user: this._id }).session(
            session,
          );

          // Cascade delete each account
          for (const account of accounts) {
            await account.cascadeDelete(session);
          }

          // Delete user
          await this.deleteOne({ session });

          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          throw err;
        } finally {
          session.endSession();
        }
      },
    },
  },
);

/**
 * Create User model
 */
const User = mongoose.model("User", userSchema);

User.syncIndexes();

export default User;
