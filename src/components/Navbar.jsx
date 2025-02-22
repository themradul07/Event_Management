import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const Navbar = () => {

    const getNavbar = async ()=>{
        let data = await fetch("http://localhost:3000/getNavbar" , {credentials :"include"});

        let res = await data.json();
        console.log(res);
    }

    useEffect(() => {
      getNavbar();
    
      
    }, [])
    

    return (
        <div className='w-full  bg-white sticky '>
            <div className='w-full max-w-[1240px]  mx-auto h-[60px] flex justify-between px-4 items-center'>
                <div className='font-bold flex justify-center items-center '>
                    <div>
                        <img src="/Biet_Hub.jpeg" className='h-[40px] object-contain w-[40px] ' alt="" />
                    </div>
                    <div className='text-purple-900'>

                        BIETHUB
                    </div>
                </div>
                <div>
                    <ul className='flex gap-8'>
                        <Link to={'/'}>
                            <li>Home</li>
                        </Link>
                        <li>All Events</li>
                        <li>Commiittes</li>
                        <Link to={'aboutus'}>
                            <li>About Us</li>
                        </Link>


                    </ul>
                </div>
                {/* <div className='w-[30%] '>
            <ul className='flex gap-8'>
                <li>Contact Us</li>
                <li>Our Services</li>
            </ul>
            <input type="text" placeholder='Search for events' className='w-[100%] px-12 py-1 border-purple-800 border rounded-full' />
            
        </div> */}
                {/* <div>
                </div> */}
                <div className='cursor-pointer'>
                    <Link to={"/login"}>
                        <button className='cursor-pointer px-4 py-1 rounded-full bg-purple-900 text-white '>Login</button>
                    </Link>
                </div>


            </div>
        </div>
    )
}

export default Navbar