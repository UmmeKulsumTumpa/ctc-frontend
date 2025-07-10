import React, { useState } from 'react';
import type { ServiceResponseDto } from '../../types/service.type';
import { useNavigate } from 'react-router-dom';
import MapPinIcon from '../icons/MapPinIcon';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';

interface ServiceCardProps {
    service: ServiceResponseDto;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDelete, showActions }) => {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/services/${service.service_id}/edit`);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            onDelete && onDelete(service.service_id);
        }
    };

    const [showMap, setShowMap] = useState(false);
    const hasValidCoords =
        typeof service.latitude === 'number' &&
        typeof service.longitude === 'number' &&
        !isNaN(service.latitude) &&
        !isNaN(service.longitude);

    return (
        <div className="bg-white border-2 border-sky-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-sky-900 mb-2 group-hover:text-sky-700 transition-colors">
                        {service.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                            {service.type}
                        </span>
                    </div>
                </div>
                {hasValidCoords && (
                    <button
                        className="bg-white border border-sky-200 rounded-full p-2 shadow hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 z-10"
                        title="View on map"
                        aria-label="View location on map"
                        onClick={() => setShowMap(true)}
                        type="button"
                    >
                        <MapPinIcon className="w-6 h-6 text-sky-600" />
                    </button>
                )}
            </div>

            <PlaceDisplayModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                latitude={hasValidCoords ? service.latitude : undefined}
                longitude={hasValidCoords ? service.longitude : undefined}
                address={service.address}
                placeName={service.name}
            />

            <div className="space-y-3 mb-4">
                {service.address && (
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                        <div className="text-sky-600 text-sm font-medium mb-1">Address</div>
                        <div className="text-sky-900 font-semibold">{service.address}</div>
                    </div>
                )}

                {service.description && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <div className="text-gray-600 text-sm font-medium mb-1">Description</div>
                        <div className="text-gray-900 font-semibold">{service.description}</div>
                    </div>
                )}



                {service.transport && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <div className="text-blue-600 text-sm font-medium mb-2">Transport Details</div>
                        <div className="space-y-1">
                            <div className="text-blue-900 font-semibold">Mode: {service.transport.mode}</div>
                            {service.transport.operator && (
                                <div className="text-blue-900 font-semibold">Operator: {service.transport.operator}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showActions && (
                <div className="flex gap-3 pt-4 border-t border-sky-100">
                    <button 
                        onClick={handleEdit} 
                        className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold shadow-lg hover:bg-sky-700 transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
