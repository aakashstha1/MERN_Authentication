import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
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
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #e8b4f8, #f472b6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.01em",
          }}
        >
          Verify Your Email
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(210, 170, 255, 0.7)",
            marginBottom: "1.75rem",
          }}
        >
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              marginBottom: "1.25rem",
            }}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: "clamp(2rem, 12vw, 3rem)",
                  height: "clamp(2rem, 12vw, 3rem)",
                  fontSize: "clamp(1rem, 4vw, 1.4rem)",
                  textAlign: "center",
                  fontWeight: 700,
                  background: "rgba(255, 255, 255, 0.08)",
                  border: digit
                    ? "1px solid rgba(200, 130, 255, 0.6)"
                    : "1px solid rgba(200, 150, 255, 0.25)",
                  borderRadius: "12px",
                  color: "#f0e6ff",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s",
                  caretColor: "#c084fc",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(200, 130, 255, 0.7)";
                  e.target.style.background = "rgba(255, 255, 255, 0.13)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit
                    ? "rgba(200, 130, 255, 0.6)"
                    : "rgba(200, 150, 255, 0.25)";
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                }}
              />
            ))}
          </div>

          {error && (
            <p
              style={{
                color: "#f472b6",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
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
              cursor:
                isLoading || code.some((d) => !d) ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(160, 60, 220, 0.3)",
              opacity: isLoading || code.some((d) => !d) ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;
