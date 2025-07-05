import React, { useState } from 'react';
import { findNearbyServices } from '../../services/service.service';
import type { ServiceResponseDto } from '../../types/service.type';
import ServiceDetailsCard from '../../components/service/ServiceDetailsCard';
import { useNavigate } from 'react-router-dom';

const DUMMY_LOCATION = { latitude: 34.0522, longitude: -118.2437, radius: 100 };

const NearbyServicesPage: React.FC = () => {
    const [nearbyServices, setNearbyServices] = useState<ServiceResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);
    const navigate = useNavigate();

    const fetchNearbyServices = () => {
        setLoading(true);
        setError(null);
        findNearbyServices(DUMMY_LOCATION)
            .then(data => {
                setNearbyServices(data);
                setFetched(true);
            })
            .catch(() => setError('Failed to load nearby services'))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        fetchNearbyServices();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <h2 className="text-5xl font-bold text-emerald-900 mb-2 text-center">Nearby Services</h2>
                    <p className="text-xl text-gray-600 text-center mb-6">Discover travel services close to your location</p>
                    
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={fetchNearbyServices}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Searching...' : 'Refresh Location Services'}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
                        <div className="text-blue-600 text-lg font-semibold">
                            Searching for nearby services...
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-700 font-semibold text-center">{error}</div>
                    </div>
                )}

                {/* No Results */}
                {fetched && nearbyServices.length === 0 && !loading && !error && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
                        <div className="text-gray-600 text-lg">No nearby services found.</div>
                        <p className="text-gray-500 mt-2">Try refreshing or check back later for new services in your area.</p>
                    </div>
                )}

                {/* Services List */}
                {nearbyServices.length > 0 && (
                    <div className="bg-white border-2 border-gray-100 shadow-lg rounded-xl p-8">
                        <div className="grid grid-cols-1 gap-6">
                            {nearbyServices.map(service => (
                                <div key={service.service_id} className="bg-white border-2 border-emerald-100 rounded-lg p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all">
                                    <ServiceDetailsCard service={service} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition-all"
                    >
                        ← Back to Services
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NearbyServicesPage;
