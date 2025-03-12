import React from 'react'

const Card = ( { title , desc , image}) => {
    return (
        <div className='relative  w-[300px] border bg-white hover:bg-purple-50 shadow p-2  h-[420px] rounded-md flex flex-col gap-4 items-center justify-between' >
            <div className='flex w-full justify-center items-center'>
                <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
            </div>

            <div className='text-xl font-bold mt-6 text-center '>
               {title}
            </div>
            <div className='text-sm font-light text-center '>
                {desc}
            </div>

            <div className='h-[250px] min-w-[95%] bg-gray-300 rounded-md '>
                <img className='w-full h-full object-fit' src={image} alt="" />
            </div>

        </div>
    )
}

export default Card