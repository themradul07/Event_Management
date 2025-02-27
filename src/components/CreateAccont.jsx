import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CreateAccont = ({ fun }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminKey, setAdminKey] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "", isAdmin: false });
  const navigate = useNavigate(); // Hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.isAdmin && AdminKey != "Hackathon") {
        return toast.error("wrong admin key")
      }

       let verification = await fetch(`https://verifyemail.vercel.app/api/${formData.email}`);
      if(verification.error){
        toast.error("Incorrect Email ");
        return;
      }

      const response = await fetch("http://localhost:3000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json(); // Always parse JSON
      console.log(data);

      if (response.ok) {
        toast("User Created Successfully");
        fun();
        navigate("/login"); // Redirect to home/dashboard
      } else {
        alert(data.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };


  return (
    <div>
      <div className="w-[350px] max-h-[90vh] max-w-md">
        <div className="flex justify-center mb-4">
          <img src="logoQ.jpg" alt="Logo" className="w-36" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center
    ">Create your Account</h2>

        {/* Google Login Button */}
        {/* <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 mb-6">
      Continue with Google
    </button> */}

        {/* Account Create Form */}
        <form onSubmit={handleSubmit}>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Name
          </label>
          <input onChange={handleChange}
            type="text"
            name='name'
            placeholder="Enter your name"
            required
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <label className="block font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className='flex w-fit gap-2 items-center justify-center h-[40px]'>

            <input onChange={handleChange}
              onClick={() => {

                setIsAdmin(!isAdmin);
              }}
              type="checkbox"
              name="isAdmin"
              value={true}



            />
            <label className="block font-medium text-gray-700 mb-1" htmlFor="isAdmin">
              Admin
            </label>
          </div>
          {isAdmin &&
            <input onChange={(e) => {
              setAdminKey(e.target.value);
            }}

              type="text"
              name="adminKey"
              placeholder='Admin Key'



              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />}


          {/* <div className="flex justify-end mb-4">
        <a href="#" className="text-purple-600 text-sm hover:underline">
          Forgot Password?
        </a>
      </div> */}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4 text-sm">
          Already Registered? <a onClick={fun} className="text-purple-600 cursor-pointer font-medium hover:underline">Login?</a>
        </p>
      </div></div>
  )
}

export default CreateAccont