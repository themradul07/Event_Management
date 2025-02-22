import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [IsLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();


    const getNavbar = async () => {
        try {
            let response = await fetch("http://localhost:3000/getNavbar", {
                credentials: "include",
            });

            let res = await response.json();
            console.log(res);
            if(!res)  navigate('/login');

            // Assuming backend sends { isLoggedIn: true/false }
            setIsLogin(res.value); 
        } catch (error) {
            console.error("Error fetching navbar data:", error);
            navigate('/login');
        }
    };

    const navbarchanger = async () => {

        try {
            let response = await fetch("http://localhost:3000/logout", {
                credentials: "include",
            });

            let res = await response.json();
            console.log(res);

            // Assuming backend sends { isLoggedIn: true/false }
            setIsLogin(res.value); 
            toast.success("Logout Successful")
        } catch (error) {
            
        }

      
    }
    

    useEffect(() => {
        getNavbar();
    }, []); // Runs only once when the component mounts
    useEffect(() => {
        console.log(IsLogin);
    }, [IsLogin]); // Runs only once when the component mounts

    return (
        <div className='w-full bg-white sticky z-40'>
            <div className='w-full max-w-[1240px] mx-auto h-[60px] flex justify-between px-4 items-center'>
                <div className='font-bold flex justify-center items-center '>
                    <img src="/Biet_Hub.jpeg" className='h-[40px] object-contain w-[40px] ' alt="BietHub" />
                    <div className='text-purple-900'>BIETHUB</div>
                </div>

                <div>
                    <ul className='flex gap-8'>
                        <Link to={'/'}><li>Home</li></Link>
                        <Link to={'/events'}>
                        <li>Explore Events</li>
                        </Link>
                        <li>Committees</li>
                        <Link to={'/aboutus'}><li>About Us</li></Link>
                    </ul>
                </div>

                <div className='cursor-pointer'>
                    {!IsLogin ? (
                        <Link to={"/login"}>
                            <button className='cursor-pointer px-4 py-1 rounded-full bg-purple-900 text-white'>
                                Login
                            </button>
                        </Link>
                    ) : (
                        <button 
                            onClick={navbarchanger} 
                            className='cursor-pointer px-4 py-1 rounded-full bg-purple-900 text-white'
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
