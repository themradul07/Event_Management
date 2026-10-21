import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch, setAuthToken } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CreateAccont = ({ fun }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminKey, setAdminKey] = useState("");
  const [isCreate, setisCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const { refetchAuth } = useAuth();

  const otpRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", code: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isCreate && otpRef.current) {
      otpRef.current.value = "";
    }
  }, [isCreate]);

  useEffect(() => {
    let interval;
    if (isCreate && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCreate, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (isAdmin && AdminKey !== "Hackathon") {
        toast.error("Wrong Admin Key");
        setLoading(false);
        return;
      }

      const response = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && (data.ok || data.success)) {
        toast.success(data.message || "OTP Sent Successfully");
        setTimer(30);
        setisCreate(true);
      } else {
        toast.error(data.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await apiFetch("/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.code, email: formData.email })
      });

      const data = await response.json();

      if (response.ok && (data.ok || data.success)) {
        toast.success(data.message || "Account verified successfully!");
        if (data.token) {
          setAuthToken(data.token);
          document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          await refetchAuth();
        }
        if (typeof fun === "function") fun();
        // Instantly redirect to the home page upon successful verification
        navigate("/");
      } else {
        toast.error(data.message || "Error verifying account");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || loading || timer > 0 || !formData.email) return;
    setResending(true);
    try {
      const response = await apiFetch("/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "New OTP sent to your email!");
        setTimer(30);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Network error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      {isCreate ? (
        <div className="w-[350px] max-w-[80vw] max-h-[90vh]">
          <div className="flex justify-center mb-4">
            <img src="logoQ.jpg" alt="Logo" className="w-36" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Verify your Account
          </h2>
          <p className="text-xs text-gray-600 text-center mb-5">
            Verification code sent to <span className="font-semibold text-gray-800">{formData.email}</span>
          </p>

          <form onSubmit={handleVerify} className="max-w-[80vw]">
            <label className="block font-medium text-gray-700 mb-1 text-sm" htmlFor="otp">
              6-Digit Code (Master: 123456)
            </label>
            <input
              onChange={handleVerifyChange}
              ref={otpRef}
              type="text"
              name="code"
              placeholder="Enter 6-digit OTP"
              required
              disabled={loading || resending}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 text-center text-lg tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-500 mb-4 text-center">
              Didn't receive email? You can use backup code <span className="font-mono font-bold text-purple-700">123456</span> or resend below.
            </p>

            <button
              type="submit"
              disabled={loading || resending}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Account...</span>
                </>
              ) : (
                "Verify & Go to Home"
              )}
            </button>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending || loading || timer > 0}
                className="text-xs text-purple-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Sending OTP..." : timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                onClick={() => setisCreate(false)}
                disabled={loading || resending}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium disabled:opacity-50"
              >
                Change Email
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-[350px] max-w-[80vw] max-h-[90vh]">
          <div className="flex justify-center mb-4">
            <img src="logoQ.jpg" alt="Logo" className="w-36" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Create your Account
          </h2>

          <form onSubmit={handleSubmit} className="max-w-[80vw]">
            <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

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

            <label className="block font-medium text-gray-700 mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="phone"
              placeholder="Enter your phone number (e.g. +919999999999)"
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

            <div className="flex max-w-[80vw] w-fit gap-2 items-center justify-center h-[40px] mb-2">
              <input
                onChange={handleChange}
                onClick={() => setIsAdmin(!isAdmin)}
                type="checkbox"
                name="isAdmin"
                disabled={loading}
              />
              <label className="block font-medium text-gray-700" htmlFor="isAdmin">
                Admin
              </label>
            </div>

            {isAdmin && (
              <input
                onChange={(e) => setAdminKey(e.target.value)}
                type="text"
                name="adminKey"
                placeholder="Admin Key"
                disabled={loading}
                className="w-full max-w-[80vw] border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[80vw] bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending OTP...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center max-w-[80vw] text-gray-700 mt-4 text-sm">
            Already Registered?{" "}
            <a onClick={fun} className="text-purple-600 cursor-pointer font-medium hover:underline">
              Login?
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateAccont;