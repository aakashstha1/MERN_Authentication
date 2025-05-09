import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// Register
// Register a new user
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

// Login
export const login = async (req, res) => {};

// Logout
export const logout = async (req, res) => {};
