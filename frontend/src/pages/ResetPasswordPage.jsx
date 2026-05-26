import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const { resetPassword, isLoading } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.password || !form.confirmPassword)
      return "All fields are required";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    try {
      await resetPassword(token, form.password);
      toast.success("Password reset successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error resetting password";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "28rem",
        width: "100%",
        minWidth: 0,
        background: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(200, 150, 255, 0.2)",
        borderRadius: "1.5rem",
        boxShadow:
          "0 8px 48px rgba(120, 60, 180, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "clamp(1.25rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.4rem, 5vw, 1.8rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1.75rem",
            background: "linear-gradient(135deg, #e8b4f8, #f472b6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.01em",
          }}
        >
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            name="password"
            type="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Input
            icon={Lock}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <p
            style={{
              fontSize: "13px",
              color: "rgba(200, 160, 240, 0.6)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            <span style={{ color: "#e8b4f8", fontWeight: 600 }}>* Note: </span>
            Password must be at least 8 characters long, include uppercase and
            lowercase letters, a number, and a special character.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              background:
                "linear-gradient(135deg, rgba(150, 80, 220, 0.75), rgba(220, 60, 140, 0.65))",
              border: "1px solid rgba(255, 160, 230, 0.3)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(160, 60, 220, 0.3)",
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
