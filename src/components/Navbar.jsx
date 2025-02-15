import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full  bg-white sticky '>
        <div className='w-full max-w-[1240px]  mx-auto h-[60px] flex justify-between px-4 items-center'>
        <div className='font-bold'>
           BIET HUB
        </div>
        <div>
            <ul className='flex gap-8'>
                <li>Home</li>
                <li>About Us</li>
            </ul>
        </div>
        <div className='w-[30%] '>
            <input type="text" placeholder='Search for events' className='w-[100%] px-12 py-1 border-purple-800 border rounded-full' />
            
        </div>
        <div>
            <ul className='flex gap-8'>
                <li>Contact Us</li>
                <li>Our Services</li>
            </ul>
        </div>
        <div>
            <button className='px-4 py-1 rounded-full bg-black text-white '>Sign In</button>
        </div>

        
        </div>
    </div>
  )
}

export default Navbar