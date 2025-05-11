import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// --------------------------------------------Register----------------------------------------------------
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    // Generate salt for hashing
    const salt = await bcryptjs.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate a random verification token (for email verification)
    const verificationToken = generateVerificationToken();

    // Create new user document
    const user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
    });

    // Save the user to the database
    await user.save();

    // Generate JWT and set it in cookie
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    // Exclude password from user object before sending response
    const { password: _, ...rest } = user._doc;
    // The password property is being extracted from the user._doc object by renamed to _.
    //  So, it doesnot cause conflict with previous declared password

    // Send success response with user data (without password)
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: rest,
    });
  } catch (error) {
    console.log("Register Error:", error);

    // Catch any errors and send a failure response
    return res
      .status(400)
      .json({ success: false, message: "Failed to create new user!" });
  }
};

//----------------------------------------------Verify Email ---------------------------------------
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // Find the user whose verification token matches and is not expired
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // token is still valid (check greater than the current time)
    });

    // If no valid user is found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Update user fields to mark email as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token so it can't be reused
    user.verificationTokenExpiresAt = undefined; // Clear token expiry as it's no longer needed

    await user.save(); // Save the updated user to the database

    // Optionally send a welcome email after successful verification
    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined }, //Exclude password
    });
  } catch (error) {
    console.log("Email verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// -----------------------------------------------Login-----------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    //Find user with provided email
    const user = await User.findOne({ email });

    //Chck if not found user
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //Check provided password with DB password
    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();

    await user.save();

    return res.status(400).json({
      success: true,
      message: "Logged in succesfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    return res
      .status(400)
      .json({ success: false, message: "Failed to login!" });
  }
};

// -------------------------------------------------Logout-------------------------------------------------
export const logout = async (_, res) => {
  //Clear the cookie
  res.clearCookie("token");
  return res
    .status(200)
    .json({ success: true, message: "Logged out succesfully." });
};

// -------------------------------------------------Forgot Password-----------------------------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist, return error
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate reset token and expiration time (1 hour from now)
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    // Save token and expiry in the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    // Save updated user to DB
    await user.save();

    // Send password reset email with reset URL
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res
      .status(200)
      .json({ success: true, message: "Reset URL sent successfully!" });
  } catch (error) {
    console.log("Forgot password Error:", error.message);
    return res.status(400).json({ success: false, message: "Server error" });
  }
};

// -------------------------------------------------Reset Password-----------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract reset token from URL params
    const { password } = req.body; // Extract new password from request body

    // Find user with matching token and check that it hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // $gt = greater than
    });

    // If no user is found or token is expired
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update user password and remove reset token info
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    // Save changes to DB
    await user.save();

    // Send confirmation email
    await sendPasswordResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Password reset error:", error.message);
    return res.status(400).json({ success: false, message: "Server error" });
  }
};

// -------------------------------------------------Check Authentication-----------------------------------------
export const checkAuth = async (req, res) => {
  try {
    // Find the user by ID and exclude the password field from the result
    const user = await User.findById(req.userId).select("-password");

    // If user is not found, return a 400 error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // If user exists, return the user data
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in auth:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
