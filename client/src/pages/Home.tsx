import { Link } from "react-router-dom";
import { PlanIcon, PlaceIcon, ServiceIcon, GlobeIcon } from '../components/icons/TravelIcons';

const Home = () => {
    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-white border-2 border-sky-200 shadow-xl rounded-3xl p-12 mb-12">
                    <div className="text-center">
                        <h1 className="text-6xl md:text-7xl font-bold text-navy-900 mb-6 tracking-tight flex items-center justify-center gap-4">
                            <GlobeIcon className="text-sky-700" size={56} />
                            Cefalo Travel Connect
                        </h1>
                        <p className="text-2xl md:text-3xl text-sky-700 mb-4 font-medium">
                            "The world is a book, and those who do not travel read only one page." – Saint Augustine
                        </p>
                        <p className="text-lg text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                            Welcome to Cefalo Travel Connect – your office's home for wanderlust! Here, you can share your own travel stories, discover hidden gems from your colleagues, and plan your next adventure together. Whether you're a seasoned explorer or just dreaming of your first trip, you'll find inspiration, tips, and a community of fellow travelers ready to connect. Dive in and let your journey begin!
                        </p>

                        <Link to="/blogs">
                            <button className="bg-sky-600 text-white px-12 py-4 text-xl font-bold rounded-2xl border-4 border-sky-700 hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Discover Travel Tales
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Link to="/travel-plans" className="group">
                        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <PlanIcon className="text-emerald-600 mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-emerald-800 mb-3">Plan Together</h3>
                                <p className="text-gray-600">Build and share your next office adventure with friends</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/places" className="group">
                        <div className="bg-white border-2 border-sky-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <PlaceIcon className="text-sky-600 mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-sky-800 mb-3">Explore Spots</h3>
                                <p className="text-gray-600">Find and recommend must-visit places for your team</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/services" className="group">
                        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <ServiceIcon className="text-emerald-600 mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-emerald-800 mb-3">Travel Tools</h3>
                                <p className="text-gray-600">Access all the essentials to make your trip smooth</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
