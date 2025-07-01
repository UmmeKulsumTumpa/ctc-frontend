import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="bg-gray-700 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold">CTC</h2>
                    </div>
                    
                    <div className="hidden md:flex space-x-8">
                        <Link to="/">Home</Link>
                        <Link to="/blogs">Travel Blogs</Link>
                    </div>
                    
                    <div className="hidden md:flex space-x-4">
                        <button className="bg-blue-500 px-4 py-2 rounded">
                            Login
                        </button>
                        <button className="bg-green-500 px-4 py-2 rounded">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
