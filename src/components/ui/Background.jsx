import React from "react";
import './back.css'

const Background = ({children , bgfrom , bgto}) => {
  return (
    <div className={`wrapper flex justify items-center h-[80vh] bg-gradient-to-br  relative overflow-hidden `}>
      <img src="./frontgradient.png" className="absolute w-full object-cover opacity-70" alt="" />
      <div className="container text-center mx-auto z-10 text-purple-900">
        <h1 className=" font-light transition-transform duration-1000 ease-in-out flex justify-center items-center w-full h-full flex-col gap-12">
          {children}
        </h1>
      </div>
      <ul className="bg-bubbles absolute top-0 left-0 w-full h-full z-0">
        {[
          { size: "w-10 h-10", left: "left-[10%]", delay: "0s", duration: "12s" },
          { size: "w-20 h-20", left: "left-[20%]", delay: "2s", duration: "12s" },
          { size: "w-10 h-10", left: "left-[25%]", delay: "4s", duration: "15s" },
          { size: "w-15 h-15", left: "left-[40%]", delay: "0s", duration: "18s" },
          { size: "w-10 h-10", left: "left-[70%]", delay: "0s", duration: "12s" },
          { size: "w-30 h-30", left: "left-[80%]", delay: "3s", duration: "14s" },
          { size: "w-40 h-40", left: "left-[32%]", delay: "7s", duration: "16s" },
          { size: "w-5 h-5", left: "left-[55%]", delay: "15s", duration: "30s" },
          { size: "w-2.5 h-2.5", left: "left-[25%]", delay: "2s", duration: "30s" },
          { size: "w-40 h-40", left: "left-[90%]", delay: "11s", duration: "14s" }
        ].map((bubble, index) => (
          <li
            key={index}
            className={`absolute list-none ${bubble.size} bg-pink-200 bottom-[-160px] animate-floating ${bubble.left}`}
            style={{ animationDelay: bubble.delay, animationDuration: bubble.duration }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default Background;