import React from 'react'




  
  const LOGOS = [
    <img src='./logo1.png' width={42} height={42} className="text-slate-800" />,
    <img src='./Lsc_logo.png' width={42} height={42} className="text-slate-800" />,
    <img src='./pfa_Logo.png' width={42} height={42} className=" text-slate-800" />,
    <img src='./CSC_LOGO.png' width={42} height={42} className="text-slate-800" />,
    
  ];
  
  export const InfiniteSlider = () => {
    return (
      <div className="relative m-auto w-[500px] overflow-hidden  bg-white before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-[''] flex gap-4 flex-col">
        <div className='h-[2px] bg-black w-full '> </div>
        <div className="animate-infinite-slider flex w-[calc(250px*10)]">
          {LOGOS.map((logo, index) => (
            <div
              className="slide flex w-[125px] items-center justify-center"
              key={index}
            >
              {logo}
            </div>
          ))}
          {LOGOS.map((logo, index) => (
            <div
              className="slide flex w-[125px] items-center justify-center"
              key={index}
            >
              {logo}
            </div>
          ))}
        </div>
        <div className='h-[2px] bg-black w-full'> </div>
        
      </div>
    );
  };
  