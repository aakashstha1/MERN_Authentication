import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { PuffLoader } from "react-spinners";
import OAuth from "../components/OAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
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
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-white/70 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: "1.25rem",
              width: "100%",
              padding: "0.85rem 1rem",
              background:
                "linear-gradient(135deg, rgba(150, 80, 220, 0.75), rgba(220, 60, 140, 0.65))",
              border: "1px solid rgba(255, 160, 230, 0.3)",
              borderRadius: "0.75rem",
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
            disabled={isLoading}
          >
            {isLoading ? <PuffLoader size={25} /> : "Login"}
          </motion.button>
        </form>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "1.4rem 0",
          }}
        >
          <hr
            style={{
              flex: 1,
              border: "none",
              borderTop: "1px solid rgba(200, 150, 255, 0.2)",
            }}
          />
          <span
            style={{ fontSize: "13px", color: "rgba(200, 150, 255, 0.55)" }}
          >
            or
          </span>
          <hr
            style={{
              flex: 1,
              border: "none",
              borderTop: "1px solid rgba(200, 150, 255, 0.2)",
            }}
          />
        </div>

        <OAuth />
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
        <p style={{ fontSize: "14px", color: "rgba(210, 170, 255, 0.7)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "rgba(230, 160, 255, 0.95)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default LoginPage;
