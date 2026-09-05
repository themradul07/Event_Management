import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../utils/api";

const CreateAccont = ({ fun }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminKey, setAdminKey] = useState("");
  const [isCreate, setisCreate] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate requests
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

      if (response.ok) {
        toast.success(data.message || "OTP Sent Successfully");
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
    if (loading) return; // Prevent duplicate requests
    setLoading(true);

    try {
      const response = await apiFetch("/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.code })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "User Created Successfully");
        if (typeof fun === "function") fun();
      } else {
        toast.error(data.message || "Error verifying user");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isCreate ? (
        <div className="w-[350px] max-w-[80vw] max-h-[90vh]">
          <div className="flex justify-center mb-4">
            <img src="logoQ.jpg" alt="Logo" className="w-36" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Verify your Account
          </h2>

          <form onSubmit={handleVerify} className="max-w-[80vw]">
            <label className="block font-medium text-gray-700 mb-1" htmlFor="otp">
              Enter the OTP
            </label>
            <input
              onChange={handleVerifyChange}
              ref={otpRef}
              type="text"
              name="code"
              placeholder="Enter the OTP"
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
                  <span>Verifying Account...</span>
                </>
              ) : (
                "Verify Account"
              )}
            </button>
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