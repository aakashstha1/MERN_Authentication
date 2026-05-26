import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { PuffLoader } from "react-spinners";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "28rem",
        width: "100%",
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
      <div style={{ padding: "2.5rem 2rem" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "1.75rem",
            background: "linear-gradient(135deg, #e8b4f8, #f472b6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.01em",
          }}
        >
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "rgba(210, 170, 255, 0.7)",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                marginTop: "1.25rem",
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
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(160, 60, 220, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoading ? (
                <PuffLoader size={20} color="#fff" />
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(150, 80, 220, 0.25)",
                border: "1px solid rgba(200, 130, 255, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Mail size={28} style={{ color: "#e8b4f8" }} />
            </motion.div>

            <p
              style={{
                fontSize: "14px",
                color: "rgba(210, 170, 255, 0.7)",
                lineHeight: 1.6,
                marginBottom: "0.5rem",
              }}
            >
              If an account exists for{" "}
              <span style={{ color: "#e8b4f8", fontWeight: 600 }}>{email}</span>
              , you will receive a password reset link shortly.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "1.1rem 2rem",
          background: "rgba(80, 30, 140, 0.25)",
          borderTop: "1px solid rgba(255, 180, 230, 0.15)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            color: "rgba(230, 160, 255, 0.95)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
