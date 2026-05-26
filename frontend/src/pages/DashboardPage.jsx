import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
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
          Dashboard
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "1.25rem",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(200, 150, 255, 0.2)",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                background: "linear-gradient(135deg, #e8b4f8, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Profile Information
            </h3>
            <p
              style={{
                color: "rgba(220, 190, 255, 0.85)",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{ color: "rgba(200, 150, 255, 0.6)", fontWeight: 600 }}
              >
                Name:{" "}
              </span>
              {user.name}
            </p>
            <p style={{ color: "rgba(220, 190, 255, 0.85)", fontSize: "14px" }}>
              <span
                style={{ color: "rgba(200, 150, 255, 0.6)", fontWeight: 600 }}
              >
                Email:{" "}
              </span>
              {user.email}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: "1.25rem",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(200, 150, 255, 0.2)",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                background: "linear-gradient(135deg, #e8b4f8, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Account Activity
            </h3>
            <p
              style={{
                color: "rgba(220, 190, 255, 0.85)",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{ color: "rgba(200, 150, 255, 0.6)", fontWeight: 600 }}
              >
                Joined:{" "}
              </span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p style={{ color: "rgba(220, 190, 255, 0.85)", fontSize: "14px" }}>
              <span
                style={{ color: "rgba(200, 150, 255, 0.6)", fontWeight: 600 }}
              >
                Last Login:{" "}
              </span>
              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: "1.25rem" }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
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
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(160, 60, 220, 0.3)",
            }}
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
