import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { IsLogin, isAdmin, isMember, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navbarchanger = async () => {
        await logout();
        toast.success("Logout Successful");
        navigate('/');
    };

    if (IsLogin && isAdmin) {
        return (
            <div className='w-full bg-purple-950 text-white sticky top-0 z-40 shadow-lg border-b border-purple-900'>
                <div className='w-full max-w-[1240px] mx-auto h-[60px] flex justify-between px-4 items-center'>
                    <div className='font-bold flex items-center gap-2'>
                        <img src='/Biet_Hub.jpeg' className='h-[40px] object-contain w-[40px] rounded-full border border-purple-800' alt='BietHub' />
                        <div className='flex flex-col text-left'>
                            <span className='text-sm font-black tracking-wider text-purple-200 uppercase leading-none'>BIETHUB</span>
                            <span className='text-[9px] font-bold text-yellow-400 uppercase tracking-widest mt-0.5'>Admin Console</span>
                        </div>
                    </div>

                    <div className='hidden md:flex md:gap-4 lg:gap-6 text-sm font-semibold items-center'>
                        <Link to={'/'} className="hover:text-purple-300 transition-colors">Student View</Link>
                        <Link to={'/create'} className="hover:text-purple-300 transition-colors">Create Event</Link>
                        <Link to={'/admin/simulator'} className="hover:text-purple-300 transition-colors">Simulator</Link>
                        <Link to={'/admin/dashboard'} className="hover:text-purple-300 transition-colors">Analytics</Link>
                        <Link to={'/admin/playbooks'} className="hover:text-purple-300 transition-colors">Recovery Rules</Link>
                    </div>

                    <div className='md:hidden cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <AiOutlineClose size={24} className="text-white" /> : <AiOutlineMenu size={24} className="text-white" />}
                    </div>

                    <div className='hidden md:flex items-center'>
                        <button onClick={navbarchanger} className='px-4 py-1.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all'>
                            Logout
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className='md:hidden bg-purple-900 w-full flex flex-col items-center py-4 gap-4 shadow-md text-white font-medium text-sm'>
                        <Link to={'/'} onClick={() => setMenuOpen(false)}>Student View</Link>
                        <Link to={'/create'} onClick={() => setMenuOpen(false)}>Create Event</Link>
                        <Link to={'/admin/simulator'} onClick={() => setMenuOpen(false)}>Simulator</Link>
                        <Link to={'/admin/dashboard'} onClick={() => setMenuOpen(false)}>Analytics</Link>
                        <Link to={'/admin/playbooks'} onClick={() => setMenuOpen(false)}>Recovery Rules</Link>
                        <button onClick={navbarchanger} className='px-6 py-2 rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-all w-11/12 max-w-[280px]'>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='w-full bg-white sticky top-0 z-40 shadow-md '>
            <div className='w-full max-w-[1240px] mx-auto h-[60px] flex justify-between px-4 items-center'>
                <div className='font-bold flex items-center'>
                    <img src='/Biet_Hub.jpeg' className='h-[40px] object-contain w-[40px]' alt='BietHub' />
                    <div className='text-purple-900 ml-2'>BIETHUB</div>
                </div>

                <div className='hidden md:flex md:gap-4 lg:gap-6 text-md items-center'>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/events'}>Events</Link>
                    <a href={'/Members.pdf'}>Committees</a>
                    <Link to={'/dashboard'}>Profile</Link>
                    <Link to={'/membership'} className={isMember ? 'text-yellow-600 font-bold flex items-center gap-1 hover:text-yellow-700' : 'text-purple-900 font-medium hover:text-purple-700'}>
                        {isMember ? '👑 Premium' : 'Membership'}
                    </Link>
                    <Link to={'/contactus'}>Contact Us</Link>
                </div>

                <div className='md:hidden cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </div>

                <div className='hidden md:flex gap-3'>
                    {!IsLogin ? (
                        <Link to={'/login'}>
                            <button className='px-4 py-1 rounded-full bg-purple-900 text-white'>Login</button>
                        </Link>
                    ) : (
                        <button onClick={navbarchanger} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Logout</button>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div className='md:hidden bg-white w-full flex flex-col items-center py-4 gap-4 shadow-md'>
                    <Link to={'/'} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to={'/events'} onClick={() => setMenuOpen(false)}>Explore Events</Link>
                    <Link to={'/committees'} onClick={() => setMenuOpen(false)}>Committees</Link>
                    <Link to={'/dashboard'} onClick={() => setMenuOpen(false)}>Profile</Link>
                    <Link to={'/membership'} onClick={() => setMenuOpen(false)} className={isMember ? 'text-yellow-600 font-bold' : ''}>
                        {isMember ? '👑 Premium Member' : 'Membership'}
                    </Link>
                    <Link to={'/aboutus'} onClick={() => setMenuOpen(false)}>About Us</Link>
                    {!IsLogin ? (
                        <Link to={'/login'} onClick={() => setMenuOpen(false)}>
                            <button className='px-4 py-1 rounded-full bg-purple-900 text-white'>Login</button>
                        </Link>
                    ) : (
                        <button onClick={navbarchanger} className='px-4 py-1 rounded-full bg-purple-900 text-white'>Logout</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;