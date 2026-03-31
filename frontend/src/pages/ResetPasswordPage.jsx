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
    if (!form.password || !form.confirmPassword) {
      return "All fields are required";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
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

      // slight delay for UX
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
      className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-sky-500 text-transparent bg-clip-text">
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
          <p className="text-sm text-gray-400 pb-4">
            <span className="font-bold"> *Note:</span> Password must be at least
            8 characters long, include uppercase and lowercase letters, a
            number, and a special character.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
