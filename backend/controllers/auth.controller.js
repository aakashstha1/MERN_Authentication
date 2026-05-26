import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { validatePassword } from "../utils/passwordValidator.js";
import { OAuth2Client } from "google-auth-library";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mail/nodemailer/Nemail.js";

// ---------------------------------------------------------- Signup -----------------------------------------------
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const { valid, failedRule } = validatePassword(password);

    if (!valid) {
      return res.status(400).json({
        message: failedRule.message, // only send the first failed rule
      });
    }
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    // const verificationToken = Math.floor(
    //   100000 + Math.random() * 900000,
    // ).toString();

  const verificationToken = crypto.randomInt(100000, 1000000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------- Verify Email -----------------------------------------------
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------------- Login -----------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------- Logout -----------------------------------------------
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// --------------------------------------------------------- Forgot Password -----------------------------------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------- Reset Password -----------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const { valid, failedRule } = validatePassword(password);

    if (!valid) {
      return res.status(400).json({
        message: failedRule.message, // only send the first failed rule
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------- Check Auth -----------------------------------------------
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------- Google Auth -----------------------------------------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    // Get the token from the request body
    const { token } = req.body;

    // If no token is provided, return an error
    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token" });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token, // The ID token received from frontend
      audience: process.env.GOOGLE_CLIENT_ID, // Verify it matches our client ID
    });

    // Extract user info from the verified token
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // If essential info is missing, return an error
    if (!email || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token payload" });
    }

    // Check if a user with this email already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await User.create({
        email,
        name,
        googleId,
        isVerified: true,
        isOAuth: true, // marks that this account uses Google OAuth
      });
    } else {
      // If user exists but doesn't have Google linked, update it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isOAuth = true;
        user.isVerified = true;
        await user.save();
      }
    }

    // Generate a JWT token and set it in an HTTP-only cookie
    generateTokenAndSetCookie(res, user._id);

    // Update the user's last login time
    user.lastLogin = new Date();
    await user.save();

    // Respond with success and user info (hide password)
    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined, // remove password from response
      },
    });
  } catch (error) {
    // Log error and return failure response
    console.error("Error in googleAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
