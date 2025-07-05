import { Link, useLocation } from "react-router-dom";
import UserInfo from '../components/user/UserInfo';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const NavBar = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/blogs", label: "Travel Stories" },
        { to: "/travel-plans", label: "Travel Plans"},
        { to: "/services", label: "Services" },
        { to: "/places", label: "Places" },
        { to: "/wishlists", label: "Wishlists" },
    ];

    const authLinks = [
        { to: "/blogs/create", label: "Write Story" },
        { to: "/dashboard", label: "Dashboard" },
    ];

    return (
        <>
            {/* Top bar for login/logout when not authenticated */}
            {!isAuthenticated && (
                <div className="fixed top-0 right-0 z-50 p-4">
                    <div className="flex space-x-3">
                        <Link to="/signin">
                            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-sky-700 transition">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-emerald-700 transition">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Sidebar Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Collapsible Left Sidebar */}
            <nav className={`fixed left-0 top-0 h-full w-64 bg-white border-r-2 border-emerald-200 shadow-xl z-40 transform transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-emerald-200 mt-16">
                        <Link to="/" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
                            <h2 className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                                Travel Connect
                            </h2>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <div className="flex-1 p-4">
                        <div className="space-y-2">
                            {navLinks.map((link) => {
                                let isActive = location.pathname === link.to;
                                
                                if (!isActive && link.to !== '/' && location.pathname.startsWith(link.to + '/') && !navLinks.some(l => l.to !== link.to && location.pathname === l.to)) {
                                    isActive = true;
                                }

                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-emerald-600 text-white shadow-lg' 
                                                : 'text-emerald-900 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Authenticated User Section */}
                        {isAuthenticated && (
                            <>
                                <div className="mt-8 pt-6 border-t border-emerald-200">
                                    <div className="text-sm font-bold text-emerald-900 mb-3 px-4">
                                        Personal
                                    </div>
                                    <div className="space-y-2">
                                        {authLinks.map((link) => {
                                            let isActive = location.pathname === link.to;
                                            
                                            if (!isActive && link.to !== '/' && location.pathname.startsWith(link.to + '/')) {
                                                isActive = true;
                                            }

                                            return (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                                        isActive 
                                                            ? 'bg-sky-600 text-white shadow-lg' 
                                                            : 'text-sky-900 hover:bg-sky-50 hover:text-sky-700'
                                                    }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* User Info Section */}
                                <div className="mt-8 pt-6 border-t border-emerald-200">
                                    <UserInfo />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
