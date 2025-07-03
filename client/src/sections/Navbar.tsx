import { Link, useLocation } from "react-router-dom";
import UserInfo from '../components/UserInfo';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
    const { isAuthenticated } = useAuth();

    const location = useLocation();
    const navLinks = [
        { to: "/", label: "Home", exact: true },
        { to: "/blogs", label: "Travel Blogs" },
        { to: "/blogs/create", label: "Create Blog" },
        { to: "/dashboard", label: "Dashboard" },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">CTC</h2>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-white text-gray-900 shadow-md scale-105' : 'hover:bg-gray-400 hover:text-black'}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="hidden md:flex space-x-4">
                        {isAuthenticated ? (
                            <UserInfo />
                        ) : (
                            <>
                                <Link to="/signin">
                                    <button className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-300 transition">Login</button>
                                </Link>
                                <Link to="/signup">
                                    <button className="bg-green-200 text-green-900 px-4 py-2 rounded-lg font-bold shadow hover:bg-green-300 transition">Sign Up</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
