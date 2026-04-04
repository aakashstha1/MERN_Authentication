import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

// Helper for error handling
const handleError = (error, defaultMsg) => {
  return error?.response?.data?.message || defaultMsg;
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isOAuthLoading: false,
  isCheckingAuth: true,
  message: null,

  // Common state setters
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // ---------------------------------------------------- Login -----------------------------------------------
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/login", { email, password });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Logged in successfully");
    } catch (error) {
      const msg = handleError(error, "Error logging in");
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw error;
    }
  },

  // ---------------------------------------------------- Signup -----------------------------------------------
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/signup", { email, password, name });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Account created. Verify your email.");
    } catch (error) {
      const msg = handleError(error, "Error signing up");
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw error;
    }
  },

  // ---------------------------------------------------- OAuth -----------------------------------------------
  googleAuth: async (token) => {
    set({ isOAuthLoading: true, error: null });
    try {
      // Send token to backend for verification
      const { data } = await api.post("/OAuth", { token });

      // Update store with user info and auth status
      set({
        user: data.user,
        isAuthenticated: true,
        isOAuthLoading: false,
      });
      toast.success("Logged in successfully");
    } catch (error) {
      const msg = handleError(error, "Error verification");
      set({ error: msg, isOAuthLoading: false });
      toast.error(msg);
      throw error;
    }
  },

  // ---------------------------------------------------- Logout -----------------------------------------------
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/logout");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      const msg = "Error logging out";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw error;
    }
  },

  // ---------------------------------------------------- Verify Email -----------------------------------------------
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/verify-email", { code });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      const msg = handleError(error, "Error verifying email");
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // ---------------------------------------------------- Check -----------------------------------------------
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const { data } = await api.get("/check-auth");

      set({
        user: data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  // ----------------------------------------------------Forgot password -----------------------------------------------
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/forgot-password", { email });

      set({ message: data.message, isLoading: false });
      toast.success("Reset email sent");
    } catch (error) {
      const msg = handleError(error, "Error sending reset email");
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw error;
    }
  },

  // ----------------------------------------------------Reset password -----------------------------------------------
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/reset-password/${token}`, { password });

      set({ message: data.message, isLoading: false });
    } catch (error) {
      const msg = handleError(error, "Error resetting password");
      set({ error: msg, isLoading: false });
      throw error;
    }
  },
}));
