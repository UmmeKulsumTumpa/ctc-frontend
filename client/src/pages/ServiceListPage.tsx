import React, { useEffect, useState } from 'react';
import { getAllServices } from '../services/service.service';
import type { ServiceResponseDto, ServiceType } from '../types/service.type';
import ServiceDetailsCard from '../components/cards/ServiceDetailsCard';
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="mx-auto max-w-3xl px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-center font-bold text-3xl text-blue-600 my-8 tracking-wide drop-shadow">All Services</h2>
                <button
                    onClick={() => navigate('/services/nearby')}
                    className="bg-blue-600 text-white px-5 py-2 rounded font-semibold ml-4"
                >
                    Nearby Services
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    className="border rounded px-3 py-2"
                    value={filterInputs.type || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, type: e.target.value as ServiceType || undefined }))}
                >
                    <option value="">All Types</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Attraction">Attraction</option>
                    <option value="Transport">Transport</option>
                </select>

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Name"
                    value={filterInputs.name || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, name: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Address"
                    value={filterInputs.address || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, address: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Latitude"
                    value={filterInputs.latitude || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, latitude: e.target.value }))}
                />

                <input
                    className="border rounded px-3 py-2"
                    placeholder="Longitude"
                    value={filterInputs.longitude || ''}
                    onChange={e => setFilterInputs(f => ({ ...f, longitude: e.target.value }))}
                />

                <button
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                    onClick={() => setFilters({
                        ...filterInputs,
                        type: filterInputs.type || undefined,
                        name: filterInputs.name || undefined,
                        address: filterInputs.address || undefined,
                        latitude: filterInputs.latitude || undefined,
                        longitude: filterInputs.longitude || undefined,
                    })}
                >
                    Apply
                </button>
                <button
                    className="px-4 py-2 rounded bg-gray-200 text-blue-900 font-semibold"
                    onClick={() => { setFilters({}); setFilterInputs({}); }}
                >
                    Clear
                </button>
            </div>

            {isAdmin && <button onClick={() => navigate('/services/create')} className="mb-4">Create New Service</button>}
            <div className="flex flex-col gap-6">
                {services.map(service => (
                    <div key={service.service_id} className="mx-4">
                        <ServiceDetailsCard service={service} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceListPage;
