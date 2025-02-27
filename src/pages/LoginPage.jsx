import CreateAccont from "../components/CreateAccont";
import Login from "../components/Login";
import { useState, useEffect } from "react";

export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(true);

  const switcher = () => {
    setIsLogin(!isLogin);
  }

  useEffect(() => {
  }, [isLogin])



  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="flex flex-1 flex-col items-center justify-center text-center bg-gray-100 p-8 ">
        <img src="./loginCartoon.jpg" alt="Character Image" className="max-w-[70%] mb-8" />
        <h1 className="text-3xl font-bold text-gray-900">BIET HUB</h1>
        <p className="text-gray-700 mt-2">BRINGING CLUBS, COUNCILS, AND EVENTS TOGETHER</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        {isLogin ? <Login fun={switcher} /> : <CreateAccont fun={switcher} />}
      </div>
    </div>
  );
}
