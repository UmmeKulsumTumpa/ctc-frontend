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
        <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center font-bold text-3xl text-green-600 my-8 tracking-wide drop-shadow">Nearby Services</h2>

            {loading && <div>Loading nearby services...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {fetched && nearbyServices.length === 0 && <div>No nearby services found.</div>}

            <div className="flex flex-col gap-6">
                {nearbyServices.map(service => (
                    <div key={service.service_id} className="mx-4">
                        <ServiceDetailsCard service={service} />
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate(-1)}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded font-semibold mb-6 border border-blue-600"
            >
                ← Back
            </button>
        </div>
    );
};

export default NearbyServicesPage;
