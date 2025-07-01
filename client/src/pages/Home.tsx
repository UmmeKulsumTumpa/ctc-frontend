import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[80vh]">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    Welcome to Cefalo Travel Connect!
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 mb-8">
                    Share your journeys, discover new destinations, and connect with fellow travelers at Cefalo.
                    Start by exploring travel blogs or create your own adventure!
                </p>

                <Link to="/blogs">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                        Explore Travel Blogs
                    </button>
                </Link>

            </div>
        </div>
    );
}

export default Home;
