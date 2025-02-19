import React from 'react'

const Card = () => {
    return (
        <div className='relative  w-[300px] border bg-white shadow p-2  h-fit rounded-md flex flex-col gap-4 items-center' >
            <div className='flex w-full justify-center items-center'>
                <img src="./event.png" alt="" className='absolute -top-10 text-center ' />
            </div>

            <div className='text-xl font-bold mt-6 '>
                EVENTS
            </div>
            <div className='text-sm font-light text-center '>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam quidem inventore dolorem.
            </div>

            <div className='min-h-[300px] min-w-[95%] bg-gray-300 rounded-md '>

            </div>

        </div>
    )
}

export default Card