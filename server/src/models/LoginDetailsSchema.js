/**
 * Login Details Schema for MongoDB using Mongoose
 * Based on ER Diagram - Login_details Entity
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const AUTH_METHOD = {
  EMAIL: "email",
  GOOGLE: "google",
};

const loginDetailsSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return this.authMethod === AUTH_METHOD.EMAIL;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.authMethod === AUTH_METHOD.GOOGLE;
      },
    },
    authMethod: {
      type: String,
      enum: [AUTH_METHOD.EMAIL, AUTH_METHOD.GOOGLE],
      default: AUTH_METHOD.EMAIL,
    },
  },
  {
    timestamps: true,
    methods: {
      comparePassword: async function (enteredPassword) {
        try {
          if (!enteredPassword) throw new Error("Password is required");
          
          return await bcrypt.compare(enteredPassword, this.password);
        } catch (error) {
          throw error;
        }
      },
    },
  },
);

/**
 * Hash password before saving if modified
 */
loginDetailsSchema.pre("save", async function (next) {
  if (this.authMethod !== AUTH_METHOD.EMAIL || !this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Create LoginDetails model
 */
const LoginDetails = mongoose.model("LoginDetails", loginDetailsSchema);

LoginDetails.syncIndexes();

export default LoginDetails;
