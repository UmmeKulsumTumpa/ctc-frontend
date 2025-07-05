import React, { useEffect, useState } from 'react';
import { getAllServices } from '../../services/service.service';
import type { ServiceResponseDto, ServiceType } from '../../types/service.type';
import ServiceDetailsCard from '../../components/service/ServiceDetailsCard';
import { useNavigate } from 'react-router-dom';

const ServiceListPage: React.FC = () => {
    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [filters, setFilters] = useState<{ type?: ServiceType; name?: string; address?: string; latitude?: string; longitude?: string }>({});
    const [filterInputs, setFilterInputs] = useState<{ type?: ServiceType; name?: string; address?: string; latitude?: string; longitude?: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // will Replace with real admin check
    const isAdmin = false;

    const fetchServices = () => {
        setLoading(true);
        getAllServices(filters)
            .then(setServices)
            .catch(() => setError('Failed to load services'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchServices();
    }, [filters]);

    if (loading) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center text-sky-600 text-xl font-semibold">
                    Loading amazing travel services...
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="text-center text-red-700 text-lg font-semibold">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Travel Services Hub</h2>
                            <p className="text-xl text-gray-600">Discover all the essential services for your perfect journey</p>
                        </div>
                        <button
                            onClick={() => navigate('/services/nearby')}
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300"
                        >
                            Find Nearby Services
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-2 border-sky-200 shadow-lg rounded-xl p-6 mb-10">
                    <h3 className="text-xl font-semibold text-sky-800 mb-6 text-center">Filter Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <select
                            className="border-2 border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            value={filterInputs.type || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, type: e.target.value as ServiceType || undefined }))}
                        >
                            <option value="">All Service Types</option>
                            <option value="Hotel">Hotels & Resorts</option>
                            <option value="Restaurant">Restaurants & Cafes</option>
                            <option value="Attraction">Attractions & Tours</option>
                            <option value="Transport">Transport & Travel</option>
                        </select>

                        <input
                            className="border-2 border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="Service name..."
                            value={filterInputs.name || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, name: e.target.value }))}
                        />

                        <input
                            className="border-2 border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="Location address..."
                            value={filterInputs.address || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, address: e.target.value }))}
                        />

                        <input
                            className="border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Latitude"
                            value={filterInputs.latitude || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, latitude: e.target.value }))}
                        />

                        <input
                            className="border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Longitude"
                            value={filterInputs.longitude || ''}
                            onChange={e => setFilterInputs(f => ({ ...f, longitude: e.target.value }))}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            className="px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition-all"
                            onClick={() => setFilters({
                                ...filterInputs,
                                type: filterInputs.type || undefined,
                                name: filterInputs.name || undefined,
                                address: filterInputs.address || undefined,
                                latitude: filterInputs.latitude || undefined,
                                longitude: filterInputs.longitude || undefined,
                            })}
                        >
                            Search Services
                        </button>
                        <button
                            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition-all"
                            onClick={() => { setFilters({}); setFilterInputs({}); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Services Content - Remove outer container border to avoid double framing */}
                <div className="w-full">
                    {isAdmin && (
                        <div className="mb-8 text-center">
                            <button 
                                onClick={() => navigate('/services/create')} 
                                className="px-8 py-4 rounded-lg bg-emerald-600 text-white text-lg font-semibold shadow-md hover:bg-emerald-700 transition-all"
                            >
                                Add New Service
                            </button>
                        </div>
                    )}
                    
                    {services.length === 0 ? (
                        <div className="text-center py-12 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                            <div className="text-emerald-700 text-lg font-bold">No services found matching your criteria.</div>
                            <p className="text-emerald-600 mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {services.map(service => (
                                <ServiceDetailsCard key={service.service_id} service={service} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceListPage;
