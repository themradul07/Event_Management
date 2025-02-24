import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Navbar = () => {
    const [IsLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();


    const getNavbar = async () => {
        try {
            let response = await fetch("http://localhost:3000/getNavbar", {
                credentials: "include",
            });

            let res = await response.json();
            console.log(res);
            if (!res) navigate('/login');

            // Assuming backend sends { isLoggedIn: true/false }
            setIsLogin(res.value);
            if (res.isAdmin) {
                setIsAdmin(true);
            }
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
            toast.success("Logout Successful");
            getNavbar();
            navigate('/');
        } catch (error) {

        }


    }


    useEffect(() => {
        getNavbar();
    }, []); // Runs only once when the component mounts
    useEffect(() => {
        getNavbar();
    }, [IsLogin]); // Runs only once when the component mounts

    return (
        <div className='w-full bg-white sticky z-40 shadow-md'>
            <div className='w-full max-w-[1240px] mx-auto h-[60px] flex justify-between px-4 items-center'>
                <div className='font-bold flex items-center'>
                    <img src='/Biet_Hub.jpeg' className='h-[40px] object-contain w-[40px]' alt='BietHub' />
                    <div className='text-purple-900 ml-2'>BIETHUB</div>
                </div>
                
                {/* Desktop Menu */}
                <div className='hidden md:flex md:gap-4 lg:gap-6 text-md'>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/events'}>Events</Link>
                    <a href={"/Members.pdf"}>Committees</a>
                    <Link to={'/dashboard'}>Profile</Link>
                    <Link to={'/aboutus'}>About Us</Link>
                </div>
                
                {/* Mobile Menu Button */}
                <div className='md:hidden cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </div>

                {/* Authentication & Admin Actions */}
                <div className='hidden md:flex gap-3'>
                    {!IsLogin ? (
                        <Link to={'/login'}>
                            <button className='px-4 py-1 rounded-full bg-purple-900 text-white'>Login</button>
                        </Link>
                    ) : (
                        <button onClick={navbarchanger} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Logout</button>
                    )}
                    {isAdmin && (
                        <Link to={'/create'} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Create Event</Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className='md:hidden bg-white w-full flex flex-col items-center py-4 gap-4 shadow-md'>
                    <Link to={'/'} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to={'/events'} onClick={() => setMenuOpen(false)}>Explore Events</Link>
                    <Link to={'/committees'} onClick={() => setMenuOpen(false)}>Committees</Link>
                    <Link to={'/dashboard'} onClick={() => setMenuOpen(false)}>Profile</Link>
                    <Link to={'/aboutus'} onClick={() => setMenuOpen(false)}>About Us</Link>
                    {!IsLogin ? (
                        <Link to={'/login'} onClick={() => setMenuOpen(false)}>
                            <button className='px-4 py-1 rounded-full bg-purple-900 text-white'>Login</button>
                        </Link>
                    ) : (
                        <button onClick={navbarchanger} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Logout</button>
                    )}
                    {isAdmin && (
                        <Link to={'/create'} onClick={() => setMenuOpen(false)} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Create Event</Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
