import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { apiFetch, setAuthToken } from "../utils/api";

const Login = ({ fun }) => {
  const [mode, setMode] = useState("login"); // "login" | "forgot" | "reset"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [resetData, setResetData] = useState({ email: "", code: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok && (data.ok || data.success)) {
        toast.success(data.message || "Login successful!");
        if (data.token) {
          setAuthToken(data.token);
          document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        await refetchAuth();
        navigate("/");
      } else {
        toast.error(data.message || "Error logging in!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!resetData.email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);

    try {
      const response = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: resetData.email }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Reset code sent to your email!");
        setMode("reset");
      } else {
        toast.error(data.message || "Failed to send reset code");
      }
    } catch (error) {
      toast.error("Network error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!resetData.code || !resetData.newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (resetData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    try {
      const response = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(resetData),
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        toast.success(data.message || "Password reset successfully! Please login.");
        setMode("login");
        setFormData({ ...formData, email: resetData.email, password: "" });
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Network error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[350px] max-w-[80vw]">
      <div className="flex justify-center mb-4">
        <img src="logoQ.jpg" alt="Logo" className="w-36" />
      </div>

      {mode === "login" && (
        <>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Login to your Account
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              onChange={handleChange}
              value={formData.email}
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <label className="block font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              onChange={handleChange}
              value={formData.password}
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  setResetData({ ...resetData, email: formData.email });
                  setMode("forgot");
                }}
                className="text-purple-600 text-sm hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-gray-700 mt-4 text-sm">
            Not Registered Yet?{" "}
            <a onClick={fun} className="text-purple-600 font-medium hover:underline cursor-pointer">
              Create an account
            </a>
          </p>
        </>
      )}

      {mode === "forgot" && (
        <>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your registered email to receive a 6-digit verification code.
          </p>

          <form onSubmit={handleSendResetCode}>
            <label className="block font-medium text-gray-700 mb-1" htmlFor="reset-email">
              Registered Email
            </label>
            <input
              id="reset-email"
              onChange={handleResetChange}
              value={resetData.email}
              type="email"
              name="email"
              placeholder="name@example.com"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending Code...</span>
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full mt-3 text-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Login
            </button>
          </form>
        </>
      )}

      {mode === "reset" && (
        <>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Enter Reset Code
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{resetData.email}</span>
          </p>

          <form onSubmit={handleConfirmReset}>
            <label className="block font-medium text-gray-700 mb-1" htmlFor="reset-code">
              6-Digit Code (Master: 123456)
            </label>
            <input
              id="reset-code"
              onChange={handleResetChange}
              value={resetData.code}
              type="text"
              name="code"
              placeholder="Enter 6-digit code"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 tracking-widest text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <label className="block font-medium text-gray-700 mb-1" htmlFor="reset-newPassword">
              New Password
            </label>
            <input
              id="reset-newPassword"
              onChange={handleResetChange}
              value={resetData.newPassword}
              type="password"
              name="newPassword"
              placeholder="Enter at least 6 characters"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Updating Password...</span>
                </>
              ) : (
                "Set New Password"
              )}
            </button>

            <div className="flex justify-between items-center mt-3">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-purple-600 hover:underline"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
