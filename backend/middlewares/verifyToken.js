import jwt, { decode } from "jsonwebtoken";

// Middleware to verify JWT token from cookies
export const verifyToken = async (req, res, next) => {
  // Extract token from cookie
  const token = req.cookies.token;
  // If no token is found, user is unauthorized
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token" });

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded:", decoded);
    // If decoding fails, token is invalid
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });

    // Store userId in request object for later use in protected routes
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in verifying token:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
