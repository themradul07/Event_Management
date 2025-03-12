import React from 'react'

export const InfiniteSlider = ({ photos }) => {
  console.log(photos);
  const LOGOS = photos
  return (
    <div className="relative m-auto w-[90vw] overflow-scroll md:overflow-auto md:w-[500px]  bg-white before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-[''] flex gap-4 flex-col">
      <div className='h-[2px] bg-black w-full '> </div>
      <div className="animate-infinite-slider flex  text-center mx-auto w-">
        {LOGOS.map((index) => (
          <div
            className="slide flex w-[125px] items-center justify-center"
            key={index}
          >
            <img src={index} width={42} height={42} className="text-slate-800" />

          </div>
        ))}
      </div>
      <div className='h-[2px] bg-black w-full'> </div>

    </div>
  );
};
