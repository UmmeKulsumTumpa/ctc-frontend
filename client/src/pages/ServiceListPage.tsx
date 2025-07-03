import React, { useEffect, useState } from 'react';
import { getAllServices, deleteService, findNearbyServices } from '../services/service.service';
import type { ServiceResponseDto } from '../types/service.type';
import ServiceDetailsCard from '../components/cards/ServiceDetailsCard';
import { useNavigate } from 'react-router-dom';

const DUMMY_LOCATION = { latitude: 23.8103, longitude: 90.4125, radius: 5 }; // Example: Dhaka, 5km

const ServiceListPage: React.FC = () => {
    const [services, setServices] = useState<ServiceResponseDto[]>([]);
    const [nearbyServices, setNearbyServices] = useState<ServiceResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nearbyError, setNearbyError] = useState<string | null>(null);
    const navigate = useNavigate();

    // will Replace with real admin check
    const isAdmin = false;

    const fetchServices = () => {
        setLoading(true);
        getAllServices()
            .then(setServices)
            .catch(() => setError('Failed to load services'))
            .finally(() => setLoading(false));
    };

    const fetchNearbyServices = () => {
        setNearbyLoading(true);
        setNearbyError(null);
        findNearbyServices(DUMMY_LOCATION)
            .then(setNearbyServices)
            .catch(() => setNearbyError('Failed to load nearby services'))
            .finally(() => setNearbyLoading(false));
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteService(id);
            setServices(prev => prev.filter(s => s.service_id !== id));
        } catch {
            setError('Failed to delete service');
        }
    };

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
