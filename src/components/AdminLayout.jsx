import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Terminal,
    Settings,
    PlusCircle,
    Eye,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Activity,
    User,
    Phone
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        {
            name: 'Analytics Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            description: 'Live cohort & webhook recovery stats'
        },
        {
            name: 'Playground & Simulator',
            path: '/admin/simulator',
            icon: Terminal,
            description: 'Trigger transactions & PTP promises'
        },
        {
            name: 'Phone Call Simulator',
            path: '/phone',
            icon: Phone,
            description: 'In-browser Vapi Web call demo'
        },
        {
            name: 'Recovery Playbooks',
            path: '/admin/playbooks',
            icon: Settings,
            description: 'Manage automated retry & nudge rules'
        },
        {
            name: 'Create Event',
            path: '/create',
            icon: PlusCircle,
            description: 'Publish new student activity events'
        }
    ];

    const handleLogout = async () => {
        await logout();
        toast.success("Logout Successful");
        navigate('/');
    };

    const getActivePageName = () => {
        if (location.pathname === '/create') return 'Create Event';
        const activeItem = menuItems.find(item => item.path === location.pathname);
        return activeItem ? activeItem.name : 'Admin Console';
    };

    // Shared Nav Links Component
    const NavLinks = ({ onClickLink }) => (
        <div className="space-y-1 px-3">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClickLink}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative ${
                            isActive
                                ? 'bg-purple-900/60 border border-purple-800/40 text-white font-bold shadow-md'
                                : 'text-purple-300/80 hover:text-white hover:bg-purple-900/20 border border-transparent'
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeGlow"
                                className="absolute left-0 top-2 bottom-2 w-1 bg-yellow-400 rounded-r-full"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-300 ${isActive ? 'text-yellow-400' : 'text-purple-300'}`} />
                        
                        <div className="flex flex-col text-left overflow-hidden">
                            <span className="text-sm tracking-wide truncate">{item.name}</span>
                            {!isCollapsed && (
                                <span className="text-[10px] text-purple-300/60 font-normal leading-none mt-0.5 truncate group-hover:text-purple-200 transition-colors">
                                    {item.description}
                                </span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-hidden">
            {/* 1. DESKTOP SIDEBAR */}
            <motion.aside
                animate={{ width: isCollapsed ? '80px' : '260px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden md:flex flex-col bg-purple-950 text-white border-r border-purple-900 relative z-30 shrink-0 h-screen overflow-hidden"
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-purple-900/40">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                            src="/Biet_Hub.jpeg"
                            className="h-9 w-9 rounded-xl border border-purple-800/30 object-contain shadow-lg shrink-0"
                            alt="BietHub Logo"
                        />
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col text-left leading-none"
                            >
                                <span className="text-sm font-black tracking-widest text-purple-200">
                                    BIETHUB
                                </span>
                                <span className="text-[9px] font-bold text-yellow-400 tracking-wider mt-0.5 uppercase">
                                    Admin Console
                                </span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-lg bg-purple-900/50 hover:bg-purple-900 text-purple-300 hover:text-white transition-colors focus:outline-none"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Main Links Scrollable Panel */}
                <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar">
                    <NavLinks />

                    {/* Server Status monitor box */}
                    <div className="px-6 space-y-4 pt-4 border-t border-purple-900/40">
                        {!isCollapsed ? (
                            <div className="flex items-center gap-2 text-purple-300/60 text-[10px] font-bold uppercase tracking-wider">
                                <Activity size={12} className="text-yellow-400 animate-pulse" />
                                <span>Status Monitor</span>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center">
                                <Activity size={14} className="text-yellow-400" />
                            </div>
                        )}

                        <div className="space-y-2.5">
                            {[
                                { name: 'API Server', host: 'localhost:3000', status: 'connected' },
                                { name: 'Webhooks', host: 'active_gateway', status: 'connected' },
                                { name: 'Voice Agent', host: 'vapi_voice_ai', status: 'idle' }
                            ].map((srv) => (
                                <div key={srv.name} className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-xs`}>
                                    {!isCollapsed && (
                                        <div className="flex flex-col text-left">
                                            <span className="text-purple-200 font-semibold text-[11px]">{srv.name}</span>
                                            <span className="text-purple-300/40 font-mono text-[9px]">{srv.host}</span>
                                        </div>
                                    )}
                                    <div className="relative flex h-2 w-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${srv.status === 'connected' ? 'bg-emerald-455' : 'bg-yellow-455'}`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${srv.status === 'connected' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer (Profile & Logout) */}
                <div className="p-4 border-t border-purple-900/40 bg-purple-950/60">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shrink-0 font-bold text-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col text-left leading-none overflow-hidden">
                                    <span className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</span>
                                    <span className="text-[10px] text-purple-300/60 truncate mt-0.5">{user?.email || 'admin@biethub.in'}</span>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-white transition-colors"
                            >
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                    {isCollapsed && (
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className="mt-3 mx-auto flex items-center justify-center p-2 rounded-lg bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-white transition-colors w-8 h-8"
                        >
                            <LogOut size={14} />
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* 2. MOBILE DRAWER SIDEBAR */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />
                        {/* Slide-out Panel */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 bottom-0 left-0 w-[280px] bg-purple-950 border-r border-purple-900 z-50 md:hidden flex flex-col h-full text-white"
                        >
                            <div className="h-16 flex items-center justify-between px-4 border-b border-purple-900/40">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/Biet_Hub.jpeg"
                                        className="h-8 w-8 rounded-lg border border-purple-800/30 object-contain shadow"
                                        alt="BietHub Logo"
                                    />
                                    <div className="flex flex-col text-left leading-none">
                                        <span className="text-sm font-black tracking-widest text-purple-200">
                                            BIETHUB
                                        </span>
                                        <span className="text-[8px] font-bold text-yellow-400 tracking-wider mt-0.5 uppercase">
                                            Admin Drawer
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-1 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-300 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6">
                                <NavLinks onClickLink={() => setIsMobileOpen(false)} />
                            </div>

                            <div className="p-4 border-t border-purple-900/40 bg-purple-950/60">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                                        </div>
                                        <div className="flex flex-col text-left leading-none">
                                            <span className="text-xs font-bold text-white">{user?.name || 'Administrator'}</span>
                                            <span className="text-[10px] text-purple-300/60 mt-0.5">{user?.email || 'admin@biethub.in'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-white transition-colors"
                                    >
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 3. MAIN CONTENT BODY */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top header bar */}
                <header className="h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 relative z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-250 text-slate-500 hover:text-slate-700 md:hidden transition-colors focus:outline-none"
                        >
                            <Menu size={18} />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs font-semibold hidden sm:inline">Admin Console</span>
                            <span className="text-slate-300 text-xs hidden sm:inline">/</span>
                            <h2 className="text-sm font-black text-slate-800">{getActivePageName()}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all text-xs font-bold"
                        >
                            <Eye size={13} />
                            <span>Student View</span>
                        </Link>
                    </div>
                </header>

                {/* Page content window (scrollable) */}
                <main className="flex-1 overflow-y-auto bg-slate-50 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="w-full h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
