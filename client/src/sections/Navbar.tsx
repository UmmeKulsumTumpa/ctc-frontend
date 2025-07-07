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

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            {/* Top bar with toggle button and login/logout */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b-2 border-emerald-200 shadow-lg">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-emerald-900 hover:bg-emerald-50 rounded-lg mr-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to="/" className="text-2xl font-bold text-emerald-900">
                            Cefalo Travel Connect
                        </Link>
                    </div>

                    {/* Login/Logout buttons */}
                    {!isAuthenticated && (
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
                    )}
                </div>
            </div>

            {/* Invisible click area to close sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed top-16 left-80 right-0 bottom-0 z-[45]"
                    onClick={closeSidebar}
                />
            )}

            {/* Collapsible Left Sidebar */}
            <nav className={`fixed left-0 top-0 h-full w-80 bg-white border-r-2 border-emerald-200 shadow-xl z-[50] transform transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full pt-20">
                    {/* Main Navigation */}
                    <div className="flex-1 p-6">
                        <div className="space-y-3">
                            {navLinks.map((link) => {
                                let isActive = location.pathname === link.to;
                                
                                if (!isActive && link.to !== '/' && location.pathname.startsWith(link.to + '/') && !navLinks.some(l => l.to !== link.to && location.pathname === l.to)) {
                                    isActive = true;
                                }

                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={closeSidebar}
                                        className={`block px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
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
                                    <div className="text-sm font-bold text-emerald-900 mb-4 px-6">
                                        Personal
                                    </div>
                                    <div className="space-y-3">
                                        {authLinks.map((link) => {
                                            let isActive = location.pathname === link.to;
                                            
                                            if (!isActive && link.to !== '/' && location.pathname.startsWith(link.to + '/')) {
                                                isActive = true;
                                            }

                                            return (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={closeSidebar}
                                                    className={`block px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
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
