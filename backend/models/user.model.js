import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isOAuth; // required only if not OAuth
      },
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // OAuth
    isOAuth: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String, // store Google sub (unique ID)
      required: function () {
        return this.isOAuth; // only required for OAuth users
      },
      unique: true,
      sparse: true, // allows multiple null values
    },

    // Email verification
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
