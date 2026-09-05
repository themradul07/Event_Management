import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

const Login = ({ fun }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Guard against multiple simultaneous requests
    setLoading(true);

    try {
      const response = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Login successful!");
        document.cookie = `token=${data.token}; path=/`;
        await refetchAuth();
        navigate("/");
      } else {
        toast.error(data.message || "Error logging in!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[350px] max-w-[80vw]">
      <div className="flex justify-center mb-4">
        <img src="logoQ.jpg" alt="Logo" className="w-36" />
      </div>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Login to your Account
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          onChange={handleChange}
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
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          disabled={loading}
          className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        <div className="flex justify-end mb-4">
          <a href="#" className="text-purple-600 text-sm hover:underline">
            Forgot Password?
          </a>
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
    </div>
  );
};

export default Login;
