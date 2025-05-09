// Import necessary modules
import express from "express"; // Express framework for server
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import cookieParser from "cookie-parser"; // Middleware to parse cookies from incoming requests
import dotenv from "dotenv"; // Loads environment variables from a .env file
import { connectDB } from "../db/conn.js";
import authRoutes from "../routes/auth.route.js";
// Initialize Express app
export const app = express();

// Load environment variables
dotenv.config();

// Enable CORS to allow requests from frontend with credentials (cookies, etc.)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Allows only requests from this frontend URL
    credentials: true, // Enables sending of cookies and auth headers
  })
);

// Middleware to parse cookies from request headers
app.use(cookieParser());

// Middleware to parse incoming JSON data
app.use(express.json());

// Middleware to parse URL-encoded data (e.g., from forms)
// Note: `extended: true` allows parsing nested objects
app.use(express.urlencoded({ extended: true }));

connectDB();


// API's routes 
app.use("/api/auth", authRoutes);
