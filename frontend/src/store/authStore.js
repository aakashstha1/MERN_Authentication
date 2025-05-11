import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true; // Enable sending cookies with each request

// Define the authentication store with Zustand
export const useAuthStore = create((set) => ({
  // Initial state values
  user: null, // Stores the authenticated user data
  isAuthenticated: false, // Flag to check if the user is logged in
  error: null, // Stores any error messages during auth operations
  isLoading: false, // Indicates whether an auth request is in progress
  isCheckingAuth: true, // Used when checking if the user is authenticated during app load
  message: null, // Stores success messages (e.g., password reset confirmation)

  // Sign up action
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null }); // Set loading state and clear any previous error
    try {
      // Send a POST request to the API for user registration
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
    }
  },

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null }); // Set loading state and clear previous errors
    try {
      // Send a POST request to the API for user login
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true, error: null }); // Set loading state and clear any errors
    try {
      // Send a POST request to log out the user
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Verify email action (for email verification)
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null }); // Set loading state and clear previous errors
    try {
      // Send a POST request to the API for email verification
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data; // Return response for further use
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
    }
  },

  // Check user authentication status on app load
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null }); // Set loading state and clear previous errors
    try {
      // Send a GET request to check if the user is authenticated
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  // Forgot password action (to send password reset email)
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null }); // Set loading state and clear previous errors
    try {
      // Send a POST request to the API to initiate password reset
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  // Reset password action (to update the user's password)
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null }); // Set loading state and clear previous errors
    try {
      // Send a POST request to reset the user's password
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
