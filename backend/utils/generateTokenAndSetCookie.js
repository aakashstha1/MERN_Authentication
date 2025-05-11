import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevent XSS (no JS access)
    secure: process.env.NODE_ENV === "production", //Use only on HTTPS
    sameSite: "strict", // 	Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
