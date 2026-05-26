import { motion } from "framer-motion";
import Input from "../components/Input";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import { PuffLoader } from "react-spinners";
import OAuth from "../components/OAuth";
import { validateSignupInput } from "../validator/authValidation";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, isLoading, isOAuthLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const result = validateSignupInput({ name, email });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <PasswordStrengthMeter password={password} />

          <motion.button
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || isOAuthLoading}
          >
            {isLoading ? <PuffLoader size={25} color="#fff" /> : "Sign Up"}
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
        <p style={{ fontSize: "14px", color: "rgba(240, 190, 255, 1)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
