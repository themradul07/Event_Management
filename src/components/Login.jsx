import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({fun}) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate(); // Hook for redirection

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // document.cookie = "token=sfdsfdsfdsfdsfdsfdsfdsfsdff; path=/";

        try {
           const response = await fetch("https://event-management-7ifl.onrender.com/login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
    credentials: "include"   // Important: allows cookies to be sent/received
});
//            const response = await fetch("http://localhost:3000/login", {
//     method: "POST",
//     body: JSON.stringify(formData),
//     headers: { "Content-Type": "application/json" },
//     credentials: "include"   // Important: allows cookies to be sent/received
// });


            const data = await response.json(); // Always parse JSON


            if (response.ok) { // ✅ Corrected condition
                toast.success(data.message || "Login successful!");
                document.cookie = data.token
                navigate("/"); // Redirect to home/dashboard
            } else {
                toast.error(data.message || "Error logging in!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        }
    };
  return (
    <div><div className="w-[350px] max-w-md">
    <div className="flex justify-center mb-4">
      <img src="logoQ.jpg" alt="Logo" className="w-36" />
    </div>
    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Login to your Account</h2>

    {/* Google Login Button */}
    {/* <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 mb-6">
      Continue with Google
    </button> */}

    {/* Login Form */}
    <form onSubmit={handleSubmit}>
      <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
        Email
      </label>
      <input onChange={handleChange}
        type="email"
        name='email'
        placeholder="Enter your email"
        required
        className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-medium text-gray-700 mb-1" htmlFor="password">
        Password
      </label>
      <input onChange={handleChange}
        type="password"
        name='password'
        placeholder="Enter your password"
        required
        className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex justify-end mb-4">
        <a href="#" className="text-purple-600 text-sm hover:underline">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
      >
        Login
      </button>
    </form>

    <p className="text-center text-gray-700 mt-4 text-sm">
      Not Registered Yet? <a  onClick={fun} className="text-purple-600 font-medium hover:underline">Create an account</a>
    </p>
  </div></div>
  )
}

export default Login